import { Component, ViewChild, NgZone } from '@angular/core';
import {
  NavController, NavParams, ModalController, MenuController, AlertController, Platform, Navbar,
  ToastController, Content
} from 'ionic-angular';
import { BussinessClient } from "../../services/business-service";
import { Form, FormSubmission, SubmissionStatus, DeviceFormMembership, DispatchOrder } from "../../model";
import { FormView } from "../../components/form-view";
import { ProspectSearch } from "../prospect-search";

@Component({
  selector: 'form-capture',
  templateUrl: 'form-capture.html'
})
export class FormCapture {

  form: Form;

  submission: FormSubmission;

  dispatch: DispatchOrder;

  @ViewChild("formView") formView: FormView;
  @ViewChild("navbar") navbar: Navbar;
  @ViewChild(Content) content: Content;

  valid: boolean = true;
  errorMessage: String;

  submitAttempt: boolean = false;

  prospect: DeviceFormMembership;

  private backUnregister;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private client: BussinessClient,
              private zone: NgZone,
              private modal: ModalController,
              private menuCtrl: MenuController,
              private alertCtrl: AlertController,
              private platform: Platform,
              private toast: ToastController) {
    console.log("FormCapture");
  }

  ionViewWillEnter() {
    this.form = this.navParams.get("form");
    this.submission = this.navParams.get("submission");
    this.dispatch = this.navParams.get("dispatch");
    if (this.dispatch) {
      this.form = this.dispatch.form;
    }
    if (!this.submission) {
      this.submission = new FormSubmission();
      this.submission.form_id = this.dispatch ? this.dispatch.form_id : this.form.form_id;
    } else {
      this.client.getContact(this.form, this.submission.prospect_id).subscribe(contact => {
        this.prospect = contact;
      });
    }
    this.menuCtrl.enable(false);
  }

  isReadOnly(submission: FormSubmission): boolean {
    return submission && submission.status == SubmissionStatus.Submitted;
  }

  ionViewDidEnter() {
    this.backUnregister = this.platform.registerBackButtonAction(() => {
      this.doBack();
    }, Number.MAX_VALUE);
    this["oldClick"] = this.navbar.backButtonClick;
    this.navbar.backButtonClick = () => {
      this.doBack();
    };
    if (this.form.is_mobile_kiosk_mode) {
      this.client.hasKioskPassword().subscribe(hasPwd => {
        if (!hasPwd) {
          this.alertCtrl.create({
            title: 'Set kiosk mode pass code',
            inputs: [
              {
                name: 'passcode',
                placeholder: 'Kiosk Mode Pass Code',
                value: ""
              }
            ],
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                }
              },
              {
                text: 'Ok',
                handler: (data) => {
                  let password = data.passcode;
                  this.client.setKioskPassword(password).subscribe((valid) => {

                  });
                }
              }
            ]
          }).present();
        }
      })
    }
  }

  ionViewWillLeave() {
    if (this.backUnregister) {
      this.backUnregister();
    }
    this.navbar.backButtonClick = this["oldClick"];
  }

  ionViewDidLeave(){
    this.menuCtrl.enable(true);
  }

  doRefresh(refresher) {

  }


  doBack() {
    if (this.form.is_mobile_kiosk_mode) {
      let alert = this.alertCtrl.create({
        title: 'Enter pass code',
        inputs: [
          {
            name: 'passcode',
            placeholder: 'Kiosk Mode Pass Code',
            value: ""
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: 'Ok',
            handler: (data) => {
              let password = data.passcode;
              this.client.validateKioskPassword(password).subscribe((valid) => {
                if(valid){
                  this.internalBack();
                }else{
                  return false;
                }
              });
            }
          }
        ]
      });
      alert.present();
    }else{
      this.internalBack();
    }
  }

  private internalBack(){

    if (!this.formView.hasChanges() || this.isReadOnly(this.submission)) {
      this.navCtrl.pop();
      return;
    }
    let alert = this.alertCtrl.create({
      title: 'Confirm exit',
      message: 'You have unsaved changes. Are you sure you want to go back?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Go back',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

  doSave() {
    this.submitAttempt = true;

    /*
     When transcription is enabled, the app is still requiring name and email. If there is a business card attached and transcription is turned on, we should not require either of these fields.
     */

    if (!this.isEmailOrNameInputted()) {
      if (this.isTranscriptionEnabled() && !this.isBusinessCardAdded()) {
        this.errorMessage = "Email or name is required";
        this.content.resize();
        return;
      }
    }

    if (!this.valid && !this.submission.id) {
      this.errorMessage = this.formView.getError();
      this.content.resize();
      return;
    }
    this.submission.fields = this.formView.getValues();
    if (!this.submission.id) {
      this.submission.id = new Date().getTime();
    }

    if (this.submission.status != SubmissionStatus.Blocked) {
      this.submission.status = SubmissionStatus.ToSubmit;
    }

    this.client.saveSubmission(this.submission, this.form).subscribe(sub => {
      if(this.form.is_mobile_kiosk_mode) {
        this.submission = null;
        this.form = null;
        this.dispatch = null;
        let successToast = this.toast.create({
          message: "Submission Successful.",
          duration: 1500,
          position: 'top',
          cssClass: 'success-toast'
        });
        successToast.present();
        setTimeout(()=>{
          this.zone.run(()=>{
            this.ionViewWillEnter();
          });
        }, 10);
      } else{
        this.navCtrl.pop();
      }
    }, err => {

    });
  }

  onValidationChange(valid: boolean) {
    this.valid = valid;
  }

  searchProspect() {
    let search = this.modal.create(ProspectSearch, { form: this.form });
    search.onDidDismiss((data: DeviceFormMembership) => {
      if (data) {
        this.prospect = data;
        this.submission.prospect_id = data.prospect_id;
        this.submission.email = data.fields["Email"];
        this.submission.first_name = data.fields["FirstName"];
        this.submission.last_name = data.fields["LastName"];
        let id = null;
        for (let field in data.fields) {
          id = this.form.getIdByUniqueFieldName(field);
          if (id) {
            this.submission.fields[id] = data.fields[field];
          }
        }
      }
    });
    search.present();
  }

  isEmailOrNameInputted() {
    let firstName = "";
    let lastName = "";
    let email = "";

    let fields = this.formView.getValues();

    let nameEl = this.getElementForType("simple_name");

    if (nameEl) {
      firstName = <any>fields[nameEl["identifier"] + "_1"] || "";
      lastName = <any>fields[nameEl["identifier"] + "_2"] || "";
    }

    let emailEl = this.getElementForType("email");

    if (emailEl) {
      email = <any>fields[emailEl["identifier"]] || "";
    }

    return (firstName.length > 0 && lastName.length > 0) || email.length > 0;
  }

  private getElementForType(type) {
    for (let element of this.form.elements) {
      if (element.type == type) {
        return element;
      }
    }
    return null;
  }

  private isTranscriptionEnabled() {
    let businessCardEl = this.getElementForType("business_card");
    return typeof businessCardEl != 'undefined' && businessCardEl['is_enable_transcription'] == 1;
  }

  private isBusinessCardAdded() {

    let fields = this.formView.getValues();
    let businessCardEl = this.getElementForType("business_card");
    let businessCard = <any>fields[businessCardEl["identifier"]] || "";

    if (businessCard) {
      let front = businessCard.front && businessCard.front.length;
      let back = businessCard.back && businessCard.back.length;

      return front || back;
    }

    return false;
  }
}
