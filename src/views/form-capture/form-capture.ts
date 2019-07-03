import {Component, ElementRef, NgZone, ViewChild} from '@angular/core';

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
import {BarcodeStatus, DeviceFormMembership, DispatchOrder, Form, FormSubmission, SubmissionStatus} from "../../model";

import {FormView} from "../../components/form-view";
import {ProspectSearch} from "../prospect-search";
import {Popup} from "../../providers/popup/popup";

import moment from "moment";
import {ThemeProvider} from "../../providers/theme/theme";
import {FormInstructions} from "../form-instructions";
import {LocalStorageProvider} from "../../providers/local-storage/local-storage";
import {Vibration} from "@ionic-native/vibration";
import {RapidCaptureService} from "../../services/rapid-capture-service";
import {ScannerType} from "../../components/form-view/elements/badge/Scanners/Scanner";
import {Observable} from "rxjs";
import {ProgressHud} from "../../services/progress-hud";

@Component({
  selector: 'form-capture',
  templateUrl: 'form-capture.html'
})

export class FormCapture {

  form: Form;

  submission: FormSubmission;

  dispatch: DispatchOrder;

  @ViewChild(FormView) formView: FormView;
  @ViewChild("navbar") navbar: Navbar;
  @ViewChild(Content) content: Content;

  @ViewChild("formTitle") formTitle: ElementRef;


  valid: boolean = true;
  errorMessage: String;

  submitAttempt: boolean = false;

  prospect: DeviceFormMembership;

  isEditing: boolean = false;

  isProcessing: boolean = false;

  selectedStation: string;

  private backUnregister;

  private selectedTheme;

  private scanSources = [];

  private selectedScanSource;

  isRapidScanMode: boolean = false;

  stationsSelectOptions: string = '';

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
              private localStorage: LocalStorageProvider,
              private vibration: Vibration,
              private rapidCaptureService: RapidCaptureService,
              private alertCtrl: AlertController,
              private progressHud: ProgressHud) {

    console.log("FormCapture");
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  ionViewWillEnter() {
    this.setupForm();

    this.menuCtrl.enable(false);

    let instructions = this.localStorage.get("FormInstructions");
    let formsInstructions = instructions ? JSON.parse(instructions) : [];

    if (this.form.is_enforce_instructions_initially && formsInstructions.indexOf(this.form.id) == -1) {
      let instructionsModal = this.modal.create(FormInstructions, {form: this.form, isModal: true});
      instructionsModal.present().then((result) => {
        formsInstructions.push(this.form.id);
        this.localStorage.set("FormInstructions", JSON.stringify(formsInstructions));
      });

      instructionsModal.onDidDismiss(()=>{
        this.openStations();
      })
    } else {
      this.openStations();
    }
  }

  private setupForm() {
    this.form = this.navParams.get("form");
    this.isRapidScanMode = this.navParams.get("isRapidScanMode");
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
  }

  private initiateRapidScanMode() {
    if (this.isRapidScanMode) {
      this.handleRapidScanModeSources();
    }
  }

  //Rapid scan
  private handleRapidScanModeSources() {
    if (this.isReadOnly(this.submission)) {
      return;
    }
    this.scanSources = this.getScanSources();

    this.openRapidScanMode();
  }

  private startRapidScanModeForSource(source: string) {
    this.selectedScanSource = source;

    this.progressHud.showLoader("Loading scanner...", 2000);

    let element = this.getElementForId(this.selectedScanSource);
    this.rapidCaptureService.start(element).then((items) => {
      this.progressHud.hideLoader();
      let submissions = [];
      for (let item of items) {
        let saveSubmObservable = this.saveSubmissionWithData(item, element);
        submissions.push(saveSubmObservable);
      }

      Observable.zip(...submissions).subscribe(() => {
        this.navCtrl.pop().then(()=> {
          this.client.doSync(this.form.form_id).subscribe(()=> {
            console.log('rapid scan synced barcodes');
          }, (error) => {
            console.error(error);
          });
        });
      }, (error) => {
        console.error(error);
        this.navCtrl.pop();
        this.progressHud.hideLoader();
      })
    });
  }

  private saveSubmissionWithData(data, element) {
    let submission = new FormSubmission();
    submission.fields = this.formView.getValues();
    let elementId = "element_" + element.id;
    submission.fields[elementId] = data;
    submission.id = new Date().getTime() + Math.floor(Math.random() * 100000);
    submission.form_id = this.dispatch ? this.dispatch.form_id : this.form.form_id;

    submission.status = SubmissionStatus.ToSubmit;

    submission.hidden_elements = this.getHiddenElementsPerVisibilityRules();

    if (this.selectedStation) {
      submission.station_id = this.selectedStation;
    }

    if (element.badge_type == ScannerType.NFC || element.badge_type == ScannerType.Barcode) {
      //put the submission to the queue to process badges
      submission.barcode_processed = BarcodeStatus.Queued;
    }
    return this.client.saveSubmission(submission, this.form, false);
  }

  getScanSources() {
    let sources = [];
    let businessCardElement = this.getElementForType("business_card");
    let barcodeElement = this.getElementForType("barcode");
    let nfcElement = this.getElementForType("nfc");

    //TODO: add business card rapid scan mode for android
    if (this.platform.is("ios")) {
      if (businessCardElement) {
        sources.push({id: businessCardElement.id, name: "Business card"});
      }
    }

    if (barcodeElement) {
      sources.push({id: barcodeElement.id, name: "Badge scan"});
    }

    // if (nfcElement) {
    //   sources.push({id: nfcElement.id, name: "NFC scan"});
    // }

    return sources;
  }

  isReadOnly(submission: FormSubmission): boolean {
    return submission &&
      (submission.status == SubmissionStatus.Submitted ||
      submission.status == SubmissionStatus.OnHold ||
      submission.status == SubmissionStatus.Submitting)
  }

  isAllowedToEdit(submission: FormSubmission): boolean {
    return submission &&
      (submission.status == SubmissionStatus.Submitted ||
        submission.status == SubmissionStatus.Submitting)
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
                    setTimeout(() => {
                      this.internalBack();
                    }, 500);
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
          this.clear();
          this.navCtrl.pop();
        }
      }
    ];

    this.vibration.vibrate(500);

    this.popup.showAlert("<div class='warning-title'>WARNING</div>", 'You have unsubmitted data on this form. If you go back, this submission will not be saved. If you wish to save this submission, tap the Submit button instead.', buttons, this.selectedTheme);
  }

  private clear() {
    this.formView.clear();
  }

  doEdit() {
    this.isEditing = true;
    this.form = null;
    setTimeout(()=> {
      this.setupForm();
    });
  }


  doSave(shouldSyncData = true) {
    this.submitAttempt = true;

    /*
     When transcription is enabled, the app is still requiring name and email. If there is a business card attached and transcription is turned on, we should not require either of these fields.
     */

    let isNotScanned = this.submission.barcode_processed == BarcodeStatus.None;
    let noTranscriptable = !this.isTranscriptionEnabled() || (this.isTranscriptionEnabled() && !this.isBusinessCardAdded());

    if (isNotScanned && noTranscriptable && !this.submission.is_filled_from_list) {
      if (!this.isEmailOrNameInputted()) {
        this.errorMessage = "Email or name is required";
        this.content.resize();
        return;
      }
    }

    if (noTranscriptable && !this.valid) {
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

    this.submission.hidden_elements = this.getHiddenElementsPerVisibilityRules();

    if (this.selectedStation) {
      this.submission.station_id = this.selectedStation;
    }

    this.client.saveSubmission(this.submission, this.form, shouldSyncData).subscribe(sub => {
      if(this.form.is_mobile_kiosk_mode || this.form.is_mobile_quick_capture_mode) {
        this.clearPlaceholders();
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
            this.setupForm();
          });
        }, 10);
      } else {
        this.navCtrl.pop();
      }
    }, (err) => {
      console.error(err);
    });
  }

  onValidationChange(valid: boolean) {
    this.valid = valid;
    setTimeout(()=>{
      this.errorMessage = '';
    });

    this.content.resize();
  }

  onProcessing(event) {
    this.isProcessing = JSON.parse(event);
  }

  searchProspect() {
    let search = this.modal.create(ProspectSearch, { form: this.form });
    search.onDidDismiss((data: DeviceFormMembership) => {
      if (data) {
        this.submission.is_filled_from_list = true;
        this.prospect = data;
        this.submission.prospect_id = data.prospect_id;
        this.submission.email = data.fields["Email"];
        this.submission.first_name = data.fields["FirstName"];
        this.submission.last_name = data.fields["LastName"];
        let id = null;
        let vals = [];
        for (let field in data.fields) {
          id = this.form.getIdByUniqueFieldName(field);
          if (id) {
            this.submission.fields[id] = data.fields[field];

            let index = id.indexOf("_") + 1;
            let parentId = id.substring(index, index + 1);
            console.log(`parentId - ${parentId}`);

            let element = this.getElementForId(parentId);
            element.is_filled_from_list = true;

            vals.push({id: id, value: data.fields[field]});
          }
        }

        Form.fillFormGroupData(vals, this.formView.getFormGroup());
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

  private getElementForId(identifier) {
    for (let element of this.form.elements) {
      if (element.id == identifier) {
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

  private getHiddenElementsPerVisibilityRules(): string[] {
    let hiddenElements = this.form.elements.filter(element => {
      return element["visible_conditions"] && !element.isMatchingRules;
    });

    let elementsIds = [];
    for (let element of hiddenElements) {
      elementsIds = elementsIds.concat(`element_${element["id"]}`);
    }
    return elementsIds;
  }

  openStations() {

    if (this.isReadOnly(this.submission)) {
      return;
    }

    if (this.form.event_stations && this.form.event_stations.length > 0) {
      // this.stationsSelect.open(event);
      // this.stationsSelect.open(new UIEvent('touch'));

      let alert = this.alertCtrl.create({
        title: 'Select Station:',
        buttons: [

          {
            text: 'Ok',
            handler: (station) => {
              if (!station) {
                return false;
              }
              this.selectedStation = station;
              alert.didLeave.subscribe(() => {
                this.initiateRapidScanMode();
              });
            }
          }
        ],
        cssClass: this.selectedTheme + ' gc-alert'
      });

      for (let station of this.form.event_stations) {
        alert.addInput({label: station.name, value: station.id, type: 'radio', checked: station.id == this.selectedStation});
      }

      alert.present();
    } else {
      this.initiateRapidScanMode();
    }
  }

  clearPlaceholders() {
    this.form.elements.forEach((element) => {
      element.placeholder = '';
    });
  }

  openRapidScanMode() {
    if (this.isReadOnly(this.submission)) {
      return;
    }

    if (this.isRapidScanMode && this.scanSources) {
      if (this.scanSources.length == 1) {
        this.startRapidScanModeForSource(this.scanSources[0].id);
      } else if (this.scanSources.length > 1) {
        let alert = this.alertCtrl.create({
          title: 'Scan Mode:',
          buttons: [
            {
              text: 'Ok',
              handler: (scanSource) => {
                if (!scanSource) {
                  return false;
                }
                this.selectedScanSource = scanSource;
                this.startRapidScanModeForSource(this.selectedScanSource);
              }
            }
          ],
          cssClass: this.selectedTheme + ' gc-alert'
        });

        for (let scanSource of this.scanSources) {
          alert.addInput({
            label: scanSource.name,
            value: scanSource.id,
            type: 'radio',
            checked: scanSource.id == this.selectedStation
          });
        }

        alert.present();
      }
    }
  }

  stationTitle(stationId) {
    for (let station of this.form.event_stations) {
      if (station.id == stationId) {
        return station.name;
      }
    }
    return '';
  }
}
