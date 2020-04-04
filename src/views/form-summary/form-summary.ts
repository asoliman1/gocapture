import { Component } from '@angular/core';
import { Form } from "../../model";
import { NavParams } from 'ionic-angular/navigation/nav-params';

@Component({
  selector: 'form-summary',
  templateUrl: 'form-summary.html'
})
export class FormSummary {

  form: Form = new Form();

  constructor(
    private navParams: NavParams,
  ) {

  }

  ionViewWillEnter() {
    this.form = this.navParams.get("form");
  }

  doRefresh(refresher) {

  }

}