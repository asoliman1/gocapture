import { Injectable } from "@angular/core";
import {FormCapture} from "../views/form-capture";
import {BussinessClient} from "./business-service";
import {Subscription} from "rxjs";
import {ToastController} from "ionic-angular";
import {SyncClient} from "./sync-client";
import {Popup} from "../providers/popup/popup";
import {App} from 'ionic-angular';

import * as moment from 'moment';
import {ThemeProvider} from "../providers/theme/theme";
import {SubmissionMapper} from "./submission-mapper";

@Injectable()

export class DuplicateLeadsService {

  private duplicateLeadSubscription: Subscription;

  constructor(private client: BussinessClient,
              private syncClient: SyncClient,
              private popup: Popup,
              private toast: ToastController,
              private app: App,
              private themeProvider: ThemeProvider,
              private submissionMapper: SubmissionMapper) {
    //
  }

  public registerDuplicateLeadHandler(forms) {

    if (this.duplicateLeadSubscription) {
      this.duplicateLeadSubscription.unsubscribe();
    }

    this.duplicateLeadSubscription = this.syncClient.duplicateLead
      .subscribe((data) => {
        if (!data) {
          return;
        }

        const date = moment(data.submission.submission_date).format('MMM DD[th], YYYY [at] hh:mm A');

        this.themeProvider.getActiveTheme().subscribe((theme) => {
          this.popup.showAlert('Duplicate Lead',
            `This lead has already been captured on ${date}. Do you want to edit it?`,
            [{ text: 'Remove', handler: () => {
                this.client.removeSubmission({id: data.id}).subscribe((_) => {
                  // this.doRefresh();

                  this.toast.create({
                    message: "Duplicate lead removed successfully.",
                    duration: 1500,
                    position: "bottom",
                    cssClass: "success"
                  }).present();
                }, (err) => {
                  console.log("ERR ", err);
                })
              }},
              { text: 'Edit', handler: () => {
                  this.client.removeSubmission({id: data.id}).subscribe((_) => {
                    const form = forms.find((f) => f.form_id == data.form_id);
                    const submission = this.submissionMapper.map(form, data.submission);
                    this.app.getActiveNav().push(FormCapture, { form: form, submission: submission, openEdit: true });
                  }, (err) => {
                    console.log("ERR ", err);
                  })
                }}
            ], theme);
        });

      });
  }

  public handleDuplicateLeads(form, data) {
    this.app.getActiveNav().push(FormCapture, { form: form, submission: this.submissionMapper.map(form, data.submission), openEdit: true }).then(() => {
      const date = moment(data.submission.submission_date).format('MMM DD[th], YYYY [at] hh:mm A');

      setTimeout(()=>{
        this.toast.create({
          message: `Lead already scanned on ${date}. Edit the submission as needed.`,
          duration: 2500,
          position: "bottom",
          cssClass: "success"
        }).present();
      }, 2000);
    });
  }
}
