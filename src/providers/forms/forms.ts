import { FileTransfer } from '@ionic-native/file-transfer';
import { Platform } from 'ionic-angular/platform/platform';
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
    private http : HTTP,
    private rest : RESTClient,
    private platform: Platform,
    private fileTransfer: FileTransfer
  ) {
    this.initForms();
  }

  initForms() {
    if (!this.loaded && this.dbClient.isWorkDbInited()){
      this.dbClient.getForms().subscribe((forms) => {
        forms = this.util.sortBy(forms,-1);
        this.setForms(forms);
        this.pushUpdates();
        this.loaded = true;
      },err=>{
        this.loaded = false;
      })
    }
  }

  setForms(newForms: Form[]){
    newForms.forEach((e : Form)=> {
      let form = this.forms.find((f)=>f.form_id == e.form_id);
      if(form) form = Object.assign(form,e);
      else this.forms.push(e);
    });
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
        remoteForms.forms = this.checkFormData(this.mapForms(remoteForms.forms), this.forms);
        this.saveNewForms(remoteForms.forms,remoteForms.availableForms);
        this.loaded = true;
        if (this.hasNewData) this.downloadFormsData(remoteForms.forms); // A.S check if form has data to be downloaded - A.S GOC-326
          obs.next(remoteForms.forms);
        },(err)=>{
          obs.error(err);
        },()=>obs.complete())

    })
  }

  mapForms(forms : Form[]){
    return forms.map(form => {
      form.id = form.form_id + "";
      return form;
    });
  }

  // A.S download all images for all forms
  private async downloadFormsData(forms: Form[]) {
    console.log('Downloading forms data...');
    await Promise.all(forms.map(async (form: Form) => {
      await this.downloadFormData(form);
    }))
    this.hasNewData = false;
    console.log('Downloading forms data finished');
  }

  private async downloadFormData(form: Form) {
    await this.downloadFormBackground(form);
    await this.downloadFormCaptureBackground(form);
    await this.downloadFormScreenSaver(form);
  }

  private async downloadFormScreenSaver(form: Form) {
    if (form.event_style.screensaver_media_items) {
      let entry: Entry;
      // this.updateFormSyncStatus(form.form_id, true)
      form.event_style.screensaver_media_items = await Promise.all(form.event_style.screensaver_media_items.map(async (item) => {
        if (item.url != '' && item.path.startsWith('https://')) {
          try {
            let file = this.util.getFilePath(item.path, `screen_saver_${form.form_id}_`);
            entry = await this.downloadFile(file.pathToDownload, file.path);
            item = { path: entry.nativeURL, url: item.url };
          } catch (error) {
            console.log('Error downloading a form screen saver image', error)
          }
        }
        return item;
      }))
      this.updateFormScreenSaver(form.form_id, form.event_style.screensaver_media_items);
      // this.updateFormSyncStatus(form.form_id, false)
    }
  }

  private async downloadFormBackground(form: Form) {
    if (form.event_style.event_record_background.url != '' && form.event_style.event_record_background.path.startsWith('https://')) {
      let entry: Entry;
      // this.updateFormSyncStatus(form.form_id, true)
      try {
        let file = this.util.getFilePath(form.event_style.event_record_background.url, `background_${form.form_id}_`);
        entry = await this.downloadFile(file.pathToDownload, file.path);
        form.event_style.event_record_background = { path: entry.nativeURL, url: form.event_style.event_record_background.url };
      } catch (error) {
        console.log('Error downloading a form background image', error)
      }
      this.updateFormBackground(form.form_id, form.event_style.event_record_background);
      // this.updateFormSyncStatus(form.form_id, false)
    }
  }

  private async downloadFormCaptureBackground(form: Form) {
    if (form.event_style.capture_background_image.url != '' && form.event_style.capture_background_image.path.startsWith('https://')) {
      let entry: Entry;
      // this.updateFormSyncStatus(form.form_id, true)
      try {
        let file = this.util.getFilePath(form.event_style.capture_background_image.url, `capture_background_${form.form_id}_`);
        entry = await this.downloadFile(file.pathToDownload, file.path);
        form.event_style.capture_background_image = { path: entry.nativeURL, url: form.event_style.capture_background_image.url };
      } catch (error) {
        console.log('Error downloading a form capture background image', error)
      }
      this.updateFormCaptureBackground(form.form_id, form.event_style.capture_background_image);
      // this.updateFormSyncStatus(form.form_id, false)
    }
  }

  // A.S GOC-326 check file if downloaded
  checkFile(newUrl: string, oldUrl: Image, id: string) {
    let i = id.split('_'), fileCongif;
    if (!oldUrl) {
      console.log(`form ${i[2] || i[1]} has new ${i[0]}`);
      this.hasNewData = true;
      return newUrl;
    }
    else if (newUrl != oldUrl.url) {
      console.log(`form ${i[2] || i[1]} has updated ${i[0]}`);
      this.hasNewData = true;
      fileCongif = this.util.getFilePath(oldUrl.url, id);
      this.util.rmFile(fileCongif.folder, fileCongif.name)
      return newUrl;
    } else if (oldUrl.path.startsWith('https://')) {
      console.log(`form ${i[2] || i[1]} will download again ${i[0]}`);
      this.hasNewData = true;
      return oldUrl.path;
    } else {
      fileCongif = this.util.getFilePath(oldUrl.url, id);
      return fileCongif.path;
    }
  }


  // A.S GOC-326 check form data if downloaded
  private checkFormData(newForms: any[], oldForms: Form[]) {
    return newForms.map((form) => {
      let oldForm = oldForms.find(f => f.form_id == form.form_id);
      // check event background image
      let eventBg = form.event_style.event_record_background;
      form.event_style.event_record_background = { path: this.checkFile(eventBg, oldForm && oldForm.event_style ? oldForm.event_style.event_record_background : null, `background_${form.form_id}_`), url: eventBg };
      // check event capture background image
      let captureBg = form.event_style.capture_background_image;
      form.event_style.capture_background_image = { path: this.checkFile(captureBg, oldForm && oldForm.event_style ? oldForm.event_style.capture_background_image : null, `capture_background_${form.form_id}_`), url: captureBg };
      // check event screen saver images
      if (form.event_style.screensaver_media_items.length) {
        let oldImgs = oldForm && oldForm.event_style ? oldForm.event_style.screensaver_media_items : [];
        form.event_style.screensaver_media_items = form.event_style.screensaver_media_items.map((item) => {
          let img = item;
          let oldImg = oldImgs.find((e) => e.url == img);
          item = { path: this.checkFile(img, oldImg, `screen_saver_${form.form_id}_`), url: img };
          return item;
        })
      }
      return form;
    })
  }


  resetForms(){
    this.forms = [];
    this.loaded = false;
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
    this.setForms(forms);
    this.forms.forEach((e)=> {
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
    this.pushUpdates();
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
    // console.log("updateFormSubmissions")
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

  async downloadFile(pathToDownload: string, path: string) {
    if (!this.platform.is('mobile')) {
      return this.fileTransfer.create().download(pathToDownload, path);
    }

    return this.http.downloadFile(pathToDownload, {}, {}, path);
  }

}
