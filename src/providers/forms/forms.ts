import { OfflineFilesProvider } from './../offline-files/offline-files';
import { HTTP } from '@ionic-native/http';
import { Image } from '../../model/image';
import { Form } from '../../model/form';
import { Injectable } from '@angular/core';
import { SubmissionStatus } from '../../model';
import { Subject, Observable } from 'rxjs';
import { Entry } from '@ionic-native/file';
import { RESTClient } from './../../services/rest-client';
import { DBClient } from './../../services/db-client';
import { Util } from './../../util/util';

@Injectable()
export class FormsProvider {

  forms: Form[] = [];
  loaded: boolean = false;
  formsObs : Subject<any> = new Subject();
  private hasNewData : boolean;

  constructor(
    private dbClient: DBClient,
    private util : Util, 
    private offlineFilesProvider : OfflineFilesProvider,
    private rest : RESTClient,

    ) {
    this.setForms()
  }

  setForms() {
    if (!this.loaded && this.dbClient.isWorkDbInited()){
      this.dbClient.getForms().subscribe((forms) => {
        forms = this.util.sortBy(forms,-1);
        this.forms = forms;
        this.loaded = true;
        this.pushUpdates();
      })
    }
   
  }

  setFormsSyncStatus(val : boolean){
    this.forms.forEach((e)=> e.isSyncing = val);
  }

   downloadForms(lastSyncDate: Date): Observable<Form[]> {
    console.log('Getting latest forms...')
    if(this.forms.length) this.loaded = true;
    else this.loaded = false;
    this.setFormsSyncStatus(true);
    return new Observable<any>(obs => {
      this.rest.getAllForms(lastSyncDate)
      .subscribe((remoteForms) => {
        this.checkFormData(remoteForms.forms);
        this.saveNewForms(remoteForms.forms,remoteForms.availableForms);
        this.loaded = true;
        // this.setFormsSyncStatus(false);
          obs.next(remoteForms.forms);
        },(err)=>{
          // this.setFormsSyncStatus(false);
          obs.error(err);
        },()=>obs.complete())

    })
  }


  // A.S GOC-326 check form data if downloaded
  private checkFormData(newForms: any[]) {
     newForms.map((form) => {
      // check event background image
      let eventBg = form.event_style.event_record_background;
      this.offlineFilesProvider.checkFile(eventBg,form.form_id,'event-bg',0);
      // check event capture background image
      let captureBg = form.event_style.capture_background_image;
      this.offlineFilesProvider.checkFile(captureBg,form.form_id,'capture-bg',0);
      // check event screen saver images
      if (form.event_style.screensaver_media_items.length) {
        form.event_style.screensaver_media_items.forEach((item,i) => {
          this.offlineFilesProvider.checkFile(item,form.form_id,'screensaver',i);
        })
      }
    })
  }


  resetForms(){
    this.forms = [];
  }

  getForms(): Form[] {
    return this.forms
  }

  saveNewForm(form: Form) {
    this.forms.push(form);
    this.updateFormSubmissions(form.form_id);
    this.pushUpdates();
  }

  saveFormDb(form: Form) {
    this.dbClient.saveForm(form).subscribe();
  }

  saveNewForms(forms: Form[],availableForms:number[]) {
    forms.forEach((e : Form)=> {
      let form = this.forms.find((f)=>f.form_id == e.form_id);
      if(form) form = Object.assign(form,e);
      else this.forms.push(e);
    });
    this.forms.forEach((e)=>{
      if(availableForms.findIndex((a)=> a == e.form_id) == -1) this.deleteForm(e);
    })
    this.forms = this.util.sortBy(this.forms,-1);
    this.dbClient.saveForms(forms).subscribe();
    this.pushUpdates();
  }

  deleteForm(form: Form) {
    this.forms = this.forms.filter((e) => e.form_id !== form.form_id);
    this.dbClient.deleteFormsInList([form.form_id]).subscribe();
  }

  updateFormSyncStatus(form_id: any, isSyncing: boolean) {
    let form = this.forms.find((e) => e.form_id == (form_id * 1));
    form.isSyncing = isSyncing;
  }

  updateFormLastSync(form_id: any, field : string , empty = false) {
    let form = this.forms.find((e) => e.form_id == (form_id * 1));
    if(!form.lastSync) form.lastSync = {}
    form.lastSync[field] = empty ? '' : new Date();
    this.saveFormDb(form)
  }

  updateFormBackground(form_id: any, background: Image) {
    let index = this.forms.findIndex((e) => e.form_id === (form_id * 1));
    this.forms[index].event_style.event_record_background = background;
    this.saveFormDb(this.forms[index])
  }

  updateFormCaptureBackground(form_id: any, background: Image) {
    let index = this.forms.findIndex((e) => e.form_id === (form_id * 1));
    this.forms[index].event_style.capture_background_image = background;
    this.saveFormDb(this.forms[index])
  }

  updateFormScreenSaver(form_id: any, screenSaver: Image[]) {
    let index = this.forms.findIndex((e) => e.form_id === (form_id * 1));
    this.forms[index].event_style.screensaver_media_items = screenSaver;
    this.saveFormDb(this.forms[index])
  }

  updateFormSubmissions(form_id: any) {
    let form = this.forms.find((e) => e.form_id === (form_id * 1));
    if(form)
    this.dbClient.getSubmissions(form.form_id,false).subscribe((submissions)=>{
      form.total_submissions = submissions.filter((e) => e.status == SubmissionStatus.Submitted).length;
      form.total_unsent = submissions.filter((e) => e.status == SubmissionStatus.ToSubmit || e.status == SubmissionStatus.Submitting).length;
      form.total_hold = submissions.filter((e) => e.status == SubmissionStatus.OnHold).length;
      // console.log(`form ${form_id} submissions ${form.total_submissions}, ${form.total_hold}, ${form.total_unsent}`);
    })
  }

  pushUpdates(){
    this.formsObs.next(true);
  }

}
