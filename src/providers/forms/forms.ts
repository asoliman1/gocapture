import { Image } from './../../model/image';
import { DBClient } from './../../services/db-client';
import { Form } from './../../model/form';
import { Injectable } from '@angular/core';
import { SubmissionStatus } from '../../model';
import { Subject } from 'rxjs';
import { FormControlPipe } from '../../pipes/form-control-pipe';
import { merge } from 'lodash';

@Injectable()
export class FormsProvider {

  forms: Form[] = [];
  loaded: boolean = false;
  formsObs : Subject<any> = new Subject();
  private filterPipe: FormControlPipe = new FormControlPipe();

  constructor(private dbClient: DBClient) {
    console.log('Forms Provider started')
    this.setForms()
  }

  setForms() {
    if (!this.loaded && this.dbClient.isWorkDbInited()){
      this.loaded = true;
      this.dbClient.getForms().subscribe((forms) => {
        forms = forms.map((e)=>{
          e.isSyncing = true; 
          return e;
        });
        this.forms = this.sortForms(forms);
        this.pushUpdates();
      })
    }
   
  }



  sortForms(forms) {
      return this.filterPipe.transform(forms);
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
    this.forms = this.sortForms(this.forms);
    this.pushUpdates();
  }

  saveFormDb(form: Form) {
    this.dbClient.saveForm(form).subscribe(res => { }, err => { });
  }

  saveNewForms(forms: Form[]) {
    
    forms.forEach((e : Form)=> {
      let form = this.forms.find((f)=>f.form_id == e.form_id);
      if(form) form = merge(form,e);
      else this.forms.push(e);
      this.saveFormDb(form)
    });
    this.pushUpdates();
  }


  deleteForm(form: Form) {
    this.forms = this.forms.filter((e) => e.form_id !== form.form_id);
    this.pushUpdates();
  }


  updateFormSyncStatus(form_id: any, isSyncing: boolean) {
    let form = this.forms.find((e) => e.form_id == (form_id * 1));
    form.isSyncing = isSyncing;
    // this.saveFormDb(form)
    // this.pushUpdates()
    //  console.log(`form ${form_id} syncing status is ${isSyncing}`);
  }

  updateFormBackground(form_id: any, background: Image) {
    let index = this.forms.findIndex((e) => e.form_id === (form_id * 1));
    this.forms[index].event_style.event_record_background = background;
    this.saveFormDb(this.forms[index])
    // this.pushUpdates()
    // console.log(`form ${form_id} background is `,background);
  }

  updateFormScreenSaver(form_id: any, screenSaver: Image[]) {
    let index = this.forms.findIndex((e) => e.form_id === (form_id * 1));
    this.forms[index].event_style.screensaver_media_items = screenSaver;
    this.saveFormDb(this.forms[index])
    // this.pushUpdates()
    // console.log(`form ${form_id} screen saver items `,screenSaver);
  }

  updateFormSubmissions(form_id: any) {
    let form = this.forms.find((e) => e.form_id === (form_id * 1));
    if(form)
    this.dbClient.getSubmissions(form.form_id,false).subscribe((submissions)=>{
      form.total_submissions = submissions.filter((e) => e.status == SubmissionStatus.Submitted).length;
      form.total_unsent = submissions.filter((e) => e.status == SubmissionStatus.ToSubmit).length;
      form.total_hold = submissions.filter((e) => e.status == SubmissionStatus.OnHold).length;
      console.log(`form ${form_id} submissions ${form.total_submissions}, ${form.total_unsent}, ${form.total_hold}`);
      // this.pushUpdates();
    })
  }

  pushUpdates(){
    this.formsObs.next(true);
  }

}
