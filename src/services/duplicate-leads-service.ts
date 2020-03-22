import { SubmissionsProvider } from './../providers/submissions/submissions';
import { Injectable } from "@angular/core";
import { FormCapture } from "../views/form-capture";
import { BussinessClient } from "./business-service";
import { Subscription } from "rxjs";
import { Popup } from "../providers/popup/popup";
import { App } from 'ionic-angular';

import * as moment from 'moment';
import { SubmissionMapper } from "./submission-mapper";

@Injectable()

export class DuplicateLeadsService {

  private duplicateLeadSubscription: Subscription;

  constructor(private client: BussinessClient,
    private submissionsProvider: SubmissionsProvider,
    private popup: Popup,
    private app: App,
    private submissionMapper: SubmissionMapper,
    ) {
    //
  }

  public registerDuplicateLeadHandler(forms) {

    if (this.duplicateLeadSubscription) {
      this.duplicateLeadSubscription.unsubscribe();
    }

    this.duplicateLeadSubscription = this.submissionsProvider.duplicateLead
      .subscribe((data) => {
        if (!data) {
          return;
        }

        const date = moment(data.submission.submission_date).format('MMM DD[th], YYYY [at] hh:mm A');

          this.popup.showAlert('alerts.duplicate-lead.title',
            {text:'alerts.duplicate-lead.message',params:{date}},
            [{
              text: 'Remove', handler: () => {
                this.client.removeSubmission({ id: data.id }).subscribe((_) => {
                  // this.doRefresh();

                  this.popup.showToast(
                     {text:'alerts.duplicate-lead.remove-msg'},
                     "bottom",
                     "success",
                     1500,
                  )
                }, (err) => {
                  console.log("ERR ", err);
                })
              }
            },
            {
              text: 'Edit', handler: () => {
                this.client.removeSubmission({ id: data.id }).subscribe((_) => {
                  const form = forms.find((f) => f.form_id == data.form_id);
                  const submission = this.submissionMapper.map(form, data.submission);
                  this.app.getActiveNav().push(FormCapture, { form: form, submission: submission, openEdit: true });
                }, (err) => {
                  console.log("ERR ", err);
                })
              }
            }
            ]);

      });
  }

  public handleDuplicateLeads(form, data, loading) {
    if (loading) loading.dismiss();

    this.app.getActiveNav().push(FormCapture, { form: form, submission: this.submissionMapper.map(form, data.submission), openEdit: true }).then(() => {
      const date = moment(data.submission.submission_date).format('MMM DD[th], YYYY [at] hh:mm A');
      setTimeout(() => {
        this.popup.showToast(
           {text:'alerts.duplicate-lead.already-scanned',params:{date}},
           "bottom",
           "success",
        )
      }, 2000);
    });
  }
}
