import { Injectable } from "@angular/core";
import {FormCapture} from "../views/form-capture";
import {BarcodeStatus, FormSubmission, FormSubmissionType, SubmissionStatus} from "../model";
import {BussinessClient} from "./business-service";
import {Subscription} from "rxjs";
import {NavController, ToastController} from "ionic-angular";
import {SyncClient} from "./sync-client";
import {Popup} from "../providers/popup/popup";
import {App} from 'ionic-angular';

import * as moment from 'moment';

@Injectable()

export class DuplicateLeadsService {

  private duplicateLeadSubscription: Subscription;

  constructor(private client: BussinessClient,
              private syncClient: SyncClient,
              private popup: Popup,
              private toast: ToastController,
              private app: App) {
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
                  const submission = this.mapDuplicateResponseToSubmission(data);
                  this.app.getActiveNav().popToRoot({animate: false}).then(() => {
                    this.app.getActiveNav().push(FormCapture, { form: form, submission: submission, openEdit: true });
                  });
                }, (err) => {
                  console.log("ERR ", err);
                })
              }}
          ]);
      });
  }


  private mapDuplicateResponseToSubmission(data: any) {
    const submission = new FormSubmission;
    submission.id = data.submission.activity_id;
    submission.form_id = parseInt(data.form_id);
    submission.activity_id = data.submission.activity_id;
    submission.prospect_id = data.submission.prospect_id;
    submission.email = data.submission.email;
    submission.sub_date = data.submission.submission_date;
    submission.status = SubmissionStatus.Submitted;
    submission.barcode_processed = data.submission.barcode_processed || BarcodeStatus.None;
    submission.submission_type = data.submission.submission_type || FormSubmissionType.normal;

    submission.fields = {};
    data.submission.data.forEach((el) => {
      if (el.value_splitted) {
        Object.keys(el.value_splitted).forEach((key) => {
          submission.fields[key] = el.value_splitted[key];
        });
      } else {
        if (el["value"]) {
          submission.fields["element_" + el['element_id']] = el["value"];
        }
      }
    });

    return submission;
  }

}
