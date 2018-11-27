import {Component, NgZone, ViewChild} from '@angular/core';
import {
  AlertController,
  Content,
  MenuController,
  ModalController,
  Navbar,
  NavController,
  NavParams,
  Platform,
  ToastController
} from 'ionic-angular';
import {BussinessClient} from "../../services/business-service";
import {
  BarcodeStatus,
  DeviceFormMembership,
  DispatchOrder,
  Form,
  FormSubmission,
  FormSubmissionType,
  SubmissionStatus
} from "../../model";
import {FormView} from "../../components/form-view";
import {ProspectSearch} from "../prospect-search";
import {Popup} from "../../providers/popup/popup";
import {Login} from "../login";
import moment from "moment";
import {ThemeProvider} from "../../providers/theme/theme";
import {FormInstructions} from "../form-instructions";
import {LocalStorageProvider} from "../../providers/local-storage/local-storage";

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

  private selectedTheme;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private client: BussinessClient,
              private zone: NgZone,
              private modal: ModalController,
              private menuCtrl: MenuController,
              private platform: Platform,
              private toast: ToastController,
              private popup: Popup,
              private themeProvider: ThemeProvider,
              private localStorage: LocalStorageProvider) {
    console.log("FormCapture");
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
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

    let instructions = this.localStorage.get("FormInstructions");
    let formsInstructions = instructions ? JSON.parse(instructions) : [];

    if (this.form.is_enforce_instructions_initially && formsInstructions.indexOf(this.form.id) == -1) {
      this.modal.create(FormInstructions, {form: this.form, isModal: true}).present().then((result) => {
        formsInstructions.push(this.form.id);
        this.localStorage.set("FormInstructions", JSON.stringify(formsInstructions));
      });
    }


  }

  isReadOnly(submission: FormSubmission): boolean {
    return submission && (submission.status == SubmissionStatus.Submitted || submission.status == SubmissionStatus.OnHold);
  }

  ionViewDidEnter() {
    this.backUnregister = this.platform.registerBackButtonAction(() => {
      this.doBack();
    }, Number.MAX_VALUE);
    this["oldClick"] = this.navbar.backButtonClick;
    this.navbar.backButtonClick = () => {
      this.doBack();
    };
    let isKioskMode = this.form.is_mobile_kiosk_mode && !this.form.is_mobile_quick_capture_mode;
    if (isKioskMode) {
      this.client.hasKioskPassword().subscribe(hasPwd => {

        if (!hasPwd) {

          const inputs = [{
            name: 'passcode',
            placeholder: 'Kiosk Mode Pass Code',
            value: ""
          }];

          const buttons = [
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
            }];

          this.popup.showPrompt('Set kiosk mode pass code', "", inputs, buttons, this.selectedTheme);
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
    let isKioskMode = this.form.is_mobile_kiosk_mode && !this.form.is_mobile_quick_capture_mode;
    if (isKioskMode) {
      this.client.hasKioskPassword().subscribe((hasPas) => {
        if (hasPas) {

          const buttons = [
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
                  if (valid) {
                    this.internalBack();
                  } else {
                    return false;
                  }
                });
              }
            }];

          const inputs = [{
            name: 'passcode',
            placeholder: 'Kiosk Mode Pass Code',
            value: ""
          }];

          this.popup.showPrompt('Enter pass code', "", inputs, buttons, this.selectedTheme);

        } else {
          const buttons = [
            {
              text: 'Ok',
              handler: () => {
                this.internalBack();
              }
            }];

          this.popup.showAlert('Info', "No kiosk password set!", buttons, this.selectedTheme);
        }
      });
    } else {
      this.internalBack();
    }
  }

  private internalBack() {

    if (!this.formView.hasChanges() || this.isReadOnly(this.submission)) {
      this.navCtrl.pop();
      return;
    }

    const buttons = [
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
    ];

    this.popup.showAlert('Confirm exit', 'You have unsaved changes. Are you sure you want to go back?', buttons, this.selectedTheme);
  }

  doSave() {
    this.submitAttempt = true;

    /*
     When transcription is enabled, the app is still requiring name and email. If there is a business card attached and transcription is turned on, we should not require either of these fields.
     */

    let isNotScanned = this.submission.barcode_processed == BarcodeStatus.None;
    let noTranscriptable = !this.isTranscriptionEnabled() || (this.isTranscriptionEnabled() && !this.isBusinessCardAdded());

    if (isNotScanned && noTranscriptable ) {
      if (!this.isEmailOrNameInputted()) {
        this.errorMessage = "Email or name is required";
        this.content.resize();
        return;
      }
    }

    if (isNotScanned && !this.valid && !this.submission.id) {
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
      if(this.form.is_mobile_kiosk_mode || this.form.is_mobile_quick_capture_mode) {
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
    this.errorMessage = '';
    this.content.resize();
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
    return businessCardEl && businessCardEl['is_enable_transcription'] == 1;
  }

  private isBusinessCardAdded() {

    let fields = this.formView.getValues();
    let businessCardEl = this.getElementForType("business_card");
    let businessCard = <any>fields[businessCardEl["identifier"]] || "";

    if (businessCard) {
      let front = businessCard.front && businessCard.front.length > 0;
      let back = businessCard.back && businessCard.back.length > 0;

      return front || back;
    }

    return false;
  }

  private submissionDate() {
    return moment(this.submission.sub_date).format('MMM DD[th], YYYY [at] hh:mm A');
  }

}
