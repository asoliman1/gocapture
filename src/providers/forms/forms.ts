import { DBClient } from './../../services/db-client';
import { Form } from './../../model/form';
import { Injectable } from '@angular/core';


@Injectable()
export class FormsProvider {
  forms: Form[] = [];
  loaded: boolean = false;
  constructor(private dbClient: DBClient) {
    console.log('Forms Provider started')
    this.setForms()
  }

  setForms() {
    if (!this.loaded)
      this.dbClient.getForms().subscribe((forms) => {
        this.forms = forms;
        console.log(forms)
      })
      this.loaded = true;
  }

  getForms() : Form[]{ 
    return this.forms
  }

  saveNewForm(form: Form) {
    this.forms.push(form);
    this.dbClient.saveForm(form).subscribe(res => { }, err => { });
  }

  deleteForm(form: Form) {
    this.forms = this.forms.filter((e) => e.form_id !== form.form_id);
  }

  updateForm(form: Form) {
    for (let index = 0; index < this.forms.length; index++) {
      let element = this.forms[index];
      if (element.form_id == form.form_id) {
        element = form;
        this.dbClient.saveForm(form).subscribe(res => { }, err => { });
        return;
      }
    }
  }


}
