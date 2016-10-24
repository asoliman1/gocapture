import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, InfiniteScroll } from 'ionic-angular';
import { RESTClient } from "../../services";
import { Form, FormSubmission, SubmissionStatus } from "../../model";
import { FormCapture } from "../form-capture";

@Component({
  selector: 'form-review',
  templateUrl: 'form-review.html'
})
export class FormReview {

  form: Form = new Form();

  filter: string = "";

  submissions: FormSubmission[] = <any>[
    {
      first_name: "sdfasdf",
      last_name: "bfgbdfgdf",
      email: "me@me.com",
      status: 1
    },
    {
      first_name: "hfghnc",
      last_name: "dhjmghj",
      email: "me@me.com",
      status: 2
    }, {
      first_name: "eertherth",
      last_name: "fertherth",
      email: "me@me.com",
      status: 3
    }, {
      first_name: "dfghdfghg",
      last_name: "hdghghj",
      email: "me@me.com",
      status: 4
    }, {
      first_name: "fhji",
      last_name: "jfghjjers",
      email: "me@me.com",
      status: 2
    }, {
      first_name: "ksdfgeht",
      last_name: "lthrshsghsh",
      email: "me@me.com",
      status: 4
    },
  ];

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private client: RESTClient,
    private zone: NgZone) {

  }

  ionViewWillEnter() {
    this.form = this.navParams.get("form");
  }

  getColor(submission: FormSubmission) {
    let result = "";
    switch (submission.status) {
      case SubmissionStatus.OnHold:
        result = "yellow";
        break;
      case SubmissionStatus.Blocked:
        result = "danger";
        break;
      case SubmissionStatus.ToSubmit:
        result = "secondary";
        break;
      case SubmissionStatus.Submitted:
        result = "light";
        break;
    }
    return result;
  }

  goToEntry(submission){
    this.navCtrl.push(FormCapture, {form: this.form, submission: submission});
  }

  doRefresh(refresher) {

  }

  doInfinite(refresher) {

  }
}