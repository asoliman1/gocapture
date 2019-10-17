import { Image } from './../../model/image';
import { DBClient } from './../../services/db-client';
import { Form } from './../../model/form';
import { Injectable } from '@angular/core';
import { FormSubmission, SubmissionStatus } from '../../model';


@Injectable()
export class FormsProvider {
  forms: Form[] = [];
  loaded: boolean = false;
  constructor(private dbClient: DBClient) {
    console.log('Forms Provider started')
    this.setForms()
  }

  setForms() {
    if (!this.loaded && this.dbClient.isWorkDbInited())
      this.dbClient.getForms().subscribe((forms) => {
        this.forms = forms;
        this.loaded = true;
        console.log(forms)
      })
  }

  getForms(): Form[] {
    return this.forms
  }

  saveNewForm(form: Form) {
    this.forms.push(form);
  }

  saveFormDb(form: Form) {
    this.dbClient.saveForm(form).subscribe(res => { }, err => { });
    this.saveFormDb(form);
  }

  saveNewForms(forms: Form[]) {
    this.forms = forms;
  }

  deleteForm(form: Form) {
    this.forms = this.forms.filter((e) => e.form_id !== form.form_id);
  }


  updateFormSyncStatus(form_id: any, isSyncing: boolean) {
    let form = this.forms.find((e) => e.form_id == (form_id * 1));
    form.isSyncing = isSyncing;
    this.saveFormDb(form)
    //  console.log(`form ${form_id} syncing status is ${isSyncing}`);
  }

  updateFormBackground(form_id: any, background: Image) {
    let index = this.forms.findIndex((e) => e.form_id === (form_id * 1));
    this.forms[index].event_style.event_record_background = background;
    this.saveFormDb(this.forms[index])
    // console.log(`form ${form_id} background is `,background);
  }

  updateFormScreenSaver(form_id: any, screenSaver: Image[]) {
    let index = this.forms.findIndex((e) => e.form_id === (form_id * 1));
    this.forms[index].event_style.screensaver_media_items = screenSaver;
    this.saveFormDb(this.forms[index])
    // console.log(`form ${form_id} screen saver items `,screenSaver);
  }

  updateFormSubmissions(form_id: any, submissions: FormSubmission[]) {
    console.log(form_id);
    let index = this.forms.findIndex((e) => e.form_id === (form_id * 1));
    this.forms[index].total_submissions = submissions.filter((e) => e.status == SubmissionStatus.Submitted).length;
    this.forms[index].total_unsent = submissions.filter((e) => e.status == SubmissionStatus.ToSubmit).length;
    this.forms[index].total_hold = submissions.filter((e) => e.status == SubmissionStatus.OnHold).length;
    console.log(`form ${form_id} submissions `, this.forms[index].total_submissions, this.forms[index].total_unsent, this.forms[index].total_hold);
  }

}
