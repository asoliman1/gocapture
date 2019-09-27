import { AfterViewInit, Component, ElementRef, NgZone, ViewChild, HostListener } from '@angular/core';

import {
  AlertController,
  Content,
  MenuController,
  ModalController,
  Navbar,
  NavController,
  NavParams,
  Platform, Popover, PopoverController, Modal
} from 'ionic-angular';
import { BussinessClient } from "../../services/business-service";
import {
  BarcodeStatus,
  DeviceFormMembership,
  DispatchOrder,
  Form,
  FormSubmission, FormSubmissionType,
  SubmissionStatus
} from "../../model";

import { FormView } from "../../components/form-view";
import { ProspectSearch } from "../prospect-search";
import { Popup } from "../../providers/popup/popup";

import moment from "moment";
import { ThemeProvider } from "../../providers/theme/theme";
import { FormInstructions } from "../form-instructions";
import { LocalStorageProvider } from "../../providers/local-storage/local-storage";
import { Vibration } from "@ionic-native/vibration";
import { RapidCaptureService } from "../../services/rapid-capture-service";
import { ScannerType } from "../../components/form-view/elements/badge/Scanners/Scanner";
import { Observable, Subscription } from "rxjs";
import { ProgressHud } from "../../services/progress-hud";
import { AppPreferences } from "@ionic-native/app-preferences";
import { StationsPage } from "../stations/stations";
import { Idle } from 'idlejs/dist';
import { ScreenSaverPage } from '../../pages/screen-saver/screen-saver';
import { Insomnia } from '@ionic-native/insomnia';
import { SyncClient } from '../../services/sync-client';
import { DBClient } from '../../services/db-client';



@Component({
  selector: 'form-capture',
  templateUrl: 'form-capture.html'
})



export class FormCapture implements AfterViewInit {

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

  selectedStation: string = '';

  private backUnregister;

  private selectedTheme;

  private scanSources = [];

  private selectedScanSource;

  isRapidScanMode: boolean = false;

  stationsSelectOptions: string = '';

  private stationsAlert;

  private stationsPopover: Popover;

  private idle: Idle;

  private _modal: Modal;

  onFormUpdate: Subscription;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private client: BussinessClient,
    private zone: NgZone,
    private modal: ModalController,
    private menuCtrl: MenuController,
    private platform: Platform,
    private popup: Popup,
    private themeProvider: ThemeProvider,
    private localStorage: LocalStorageProvider,
    private vibration: Vibration,
    private rapidCaptureService: RapidCaptureService,
    private alertCtrl: AlertController,
    private progressHud: ProgressHud,
    private appPreferences: AppPreferences,
    private popoverCtrl: PopoverController,
    private syncClient: SyncClient,
    private dbClient: DBClient,
    private insomnia: Insomnia) {
    console.log("FormCapture");
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
    // A.S
    this.idle = new Idle();
  }



  ngAfterViewInit() {
    // A.S GOC-333
    this.setupIdleMode();

    this.menuCtrl.enable(false);

    let instructions = this.localStorage.get("FormInstructions");
    let formsInstructions = instructions ? JSON.parse(instructions) : [];
    let shouldShowInstruction = !this.submission.id && this.form && this.form.is_enforce_instructions_initially && formsInstructions.indexOf(this.form.id) == -1;


    if (shouldShowInstruction) {
      let instructionsModal = this.modal.create(FormInstructions, {form: this.form, isModal: true});

      instructionsModal.present().then((result) => {
        formsInstructions.push(this.form.id);
        this.localStorage.set("FormInstructions", JSON.stringify(formsInstructions));
      });

      instructionsModal.onDidDismiss(() => {
        if (!this.submission.id) {
          this.openStations();
        }
      })
    } else {
      if (!this.submission.id) {
        this.openStations();
      }
    }
  }

  ngOnInit() {
    this.setupForm();
  }

  private setupIdleMode() {
    if (this.form.event_style.is_enable_screensaver) {
      this.insomnia.keepAwake()
        .then(() => this.handleIdleMode()
        ).catch((err) => {
          console.log(err)
          this.handleIdleMode()
        }
        )

    }
  }

  private handleIdleMode() {
    if (this.form.event_style.screensaver_media_items.length)
      this.idle
        .whenNotInteractive()
        .within(this.form.event_style.screensaver_rotation_period, 1000)
        .do(() => {
          setTimeout(() => {
            this.showScreenSaver()
          }, 20);
          console.log('idle mode started')
        })
        .start();
  }

  private showScreenSaver() {
    if (!this.isLoadingImages()) {
      if (!this._modal) {
        this._modal = this.modal.create(ScreenSaverPage, { event_style: this.form.event_style }, { cssClass: 'screensaver' });
        this._modal.present();
        this._modal.onDidDismiss(() => {
          this._modal = null
        })
      }
    } else {
      console.log('still downloading images');
    }
  }

  private isLoadingImages() {
    for (let index = 0; index < this.form.event_style.screensaver_media_items.length; index++) {
      const element = this.form.event_style.screensaver_media_items[index];
      if (element.startsWith('https://')) return true;
    }
    return false;
  }

  private stopIdleMode() {
    this.idle.stop();
  }

  private setupForm() {
    this.form = this.navParams.get("form");
    this.isRapidScanMode = this.navParams.get("isRapidScanMode");
    this.submission = this.navParams.get("submission");

    this.setStation(this.submission);

    this.dispatch = this.navParams.get("dispatch");
    this.submitAttempt = false;
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

    if (this.navParams.get("openEdit") && !this.isEditing) {
      this.isEditing = true;
    }
  }

  private setStation(submission) {
    if (submission && submission.station_id) {
      this.selectedStation = submission.station_id;
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

  private async startRapidScanModeForSource(source: string) {
    this.selectedScanSource = source;

    this.popup.showLoading("Loading scanner...");

    let element = this.getElementForId(this.selectedScanSource);
    this.startRapidScan(element);
  }

  private startRapidScan(element) {
    //save form id for which we have rapidscan
    this.appPreferences.store("rapidScan", "formId", this.form.form_id);
    this.appPreferences.store("rapidScan-" + this.form.form_id, "stationId", this.selectedStation);
    this.appPreferences.store("rapidScan-" + this.form.form_id, "elementId", element.id);
    this.rapidCaptureService.start(element, this.form.form_id + "").then((items) => {
      this.popup.dismiss('loading');
      if (items.length)
        this.processRapidScanResult(items, element);
    }).catch((err) => {
      this.popup.dismiss('loading');
    });
  }


  private processRapidScanResult(items, element) {
    // A.S GOC-322
    this.popup.showToast("Uploading leads… Keep the app open until this process completes.", "bottom", "success");

    let submissions = [];

    let i = 100;
    let timestamp = new Date().getTime();
    for (let item of items) {
      let submId = parseInt(timestamp + "" + i);
      let saveSubmObservable = this.saveSubmissionWithData(item, element, submId);
      i++;
      submissions.push(saveSubmObservable);
    }

    Observable.zip(...submissions).subscribe(() => {
      //barcodes are saved to the database so we can clear the defaults
      this.rapidCaptureService.removeDefaults(this.form.form_id);

      this.navCtrl.pop().then(() => {
        this.client.doSync(this.form.form_id).subscribe(() => {
          console.log('rapid scan synced items');
        }, (error) => {
          console.error(error);
        });
      });
    }, (error) => {
      console.error(error);
      this.navCtrl.pop();
      this.progressHud.hideLoader();
    })
  }

  //saving subm from rapid scan mode
  private saveSubmissionWithData(data, element, submId) {
    let submission = new FormSubmission();

    if (element.post_show_reconciliation) {
      submission.hold_submission = 1;
      submission.hold_submission_reason = "Post-Show Reconciliation";
      submission.barcode_processed = BarcodeStatus.PostShowReconsilation;
    } else if (element.badge_type == ScannerType.Nfc || element.badge_type == ScannerType.Barcode) {
      //put the submission to the queue to process badges
      submission.barcode_processed = BarcodeStatus.Queued;
    }

    submission.fields = this.formView.getValues();
    let elementId = "element_" + element.id;
    submission.fields[elementId] = data;
    submission.id = submId;
    submission.form_id = this.dispatch ? this.dispatch.form_id : this.form.form_id;

    submission.status = SubmissionStatus.ToSubmit;

    submission.is_rapid_scan = 1;

    submission.hidden_elements = this.form.getHiddenElementsPerVisibilityRules();

    if (this.selectedStation) {
      submission.station_id = this.selectedStation;
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
        sources.push({ id: businessCardElement.id, name: "Business card" });
      }
    }

    if (barcodeElement) {
      sources.push({ id: barcodeElement.id, name: "Badge scan" });
    }

    // if (nfcElement) {
    //   sources.push({id: nfcElement.id, name: "NFC scan"});
    // }

    return sources;
  }

  isReadOnly(submission: FormSubmission): boolean {
    return !this.isEditing && submission &&
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
    this.onFormUpdate = this.syncClient.entitySynced.subscribe((e) => {
      if (e === 'Forms') this.checkFormUpdates() // check for any form update
    })
  }

  checkFormUpdates() {
    this.dbClient.getFormsByIds([this.form.form_id]).subscribe((forms) => {
      this.form.event_style = forms[0].event_style;
      this.form.event_stations = forms[0].event_stations;
    })
  }

  ionViewWillLeave() {
    if (this.backUnregister) {
      this.backUnregister();
    }
    this.navbar.backButtonClick = this["oldClick"];

    if (this.stationsPopover) {
      this.stationsPopover.dismiss();
    }
    this.onFormUpdate.unsubscribe();
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
    this.insomnia.allowSleepAgain()
    .then(()=>{})
    .catch((err)=>console.log(err));
    this.stopIdleMode();
  }

  doRefresh(refresher) {

  }

  doBack() {
    if (this.stationsAlert) {
      this.stationsAlert.dismiss();
    }
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
    setTimeout(() => {
      this.setupForm();
      this.content.resize();
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

    this.submission.fields = { ...this.formView.getValues(), ...this.getDocumentsForSubmission() };

    if (!this.submission.id) {
      this.submission.id = new Date().getTime();
    }

    if (this.submission.status != SubmissionStatus.Blocked) {
      this.submission.status = SubmissionStatus.ToSubmit;
    }

    this.submission.hidden_elements = this.form.getHiddenElementsPerVisibilityRules();

    if (this.selectedStation) {
      this.submission.station_id = this.selectedStation;
    }

    if (this.submission.barcode_processed == BarcodeStatus.Processed ||
      this.submission.barcode_processed == BarcodeStatus.Queued ||
      this.submission.barcode_processed == BarcodeStatus.PostShowReconsilation) {
      this.submission.submission_type = FormSubmissionType.barcode;
    }

    if (this.submission.prospect_id) {
      this.submission.submission_type = FormSubmissionType.list;
    }

    if (this.isTranscriptionEnabled() && this.isBusinessCardAdded()) {
      this.submission.submission_type = FormSubmissionType.transcription;
    }

    this.client.saveSubmission(this.submission, this.form, shouldSyncData).subscribe(sub => {
      this.tryClearDocumentsSelection();

      if (this.isEditing) {
        if (this.form.is_mobile_kiosk_mode) {
          this.navCtrl.pop();
        } else {
          this.navCtrl.popToRoot();
        }
        return;
      }

      if (this.form.is_mobile_kiosk_mode) {
        this.clearPlaceholders();
        this.submission = null;
        this.form = null;
        this.dispatch = null;
        this.popup.showToast(
          "Submission Successful.",
          'bottom',
          'success',
          1500,
        );
        setTimeout(() => {
          this.zone.run(() => {
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
    setTimeout(() => {
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

            //skip prefilling if audio element
            let audioRecorderEl = this.getElementForType("audio");

            let isAudio = audioRecorderEl.identifier == id;

            //reset prospect audio field
            if (isAudio) {
              this.prospect.fields[field] = "";
            }

            this.submission.fields[id] = isAudio ? "" : data.fields[field];

            let identifier = id.replace("element_", "");

            let index = identifier.indexOf("_");
            let parentId = identifier.substring(0, index);

            if (!parentId) {
              parentId = identifier;
            }

            console.log(`parentId - ${parentId}`);

            let element = this.getElementForId(parentId);
            element.is_filled_from_list = true;


            vals.push({ id: id, value: isAudio ? "" : data.fields[field] });
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

  getDocumentsForSubmission() {
    const documentsElements = {};

    const filteredElements = this.form.elements
      .filter((element) => element.type === 'documents' && element.documents_set)
      .filter((element) => element.documents_set.selectedDocumentIdsForSubmission);

    filteredElements.forEach((element) => {
      documentsElements["element_" + element.id] = element.documents_set.selectedDocumentIdsForSubmission;
    });

    return documentsElements;
  }

  onOpenStations() {
    let isKioskMode = this.form.is_mobile_kiosk_mode && !this.form.is_mobile_quick_capture_mode;
    if (isKioskMode) {
      return;
    }
    this.openStations();
  }

  openStations() {

    if (this.form.event_stations && this.form.event_stations.length > 0) {
      // this.stationsSelect.open(event);
      // this.stationsSelect.open(new UIEvent('touch'));

      this.stationsPopover = this.popoverCtrl.create(StationsPage, {
        stations: this.form.event_stations,
        selectedStation: this.selectedStation,
        visitedStations: this.submission.stations,
        disableStationSelection: this.isAllowedToEdit(this.submission) && !this.isEditing
      }, {
        enableBackdropDismiss: false,
        cssClass: this.selectedTheme + ' gc-popover'
      });
      this.stationsPopover.present();

      this.stationsPopover.onDidDismiss((data) => {
        if (data.isCancel) {
          if (!this.submission.id && !this.selectedStation) {
            this.navCtrl.pop();
          }
        } else {
          this.selectedStation = data.station;
          this.initiateRapidScanMode();
        }
      })

      /*
      this.stationsAlert = this.alertCtrl.create({
        title: 'Select Station:',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              this.navCtrl.pop();
            }
          },
          {
            text: 'Ok',
            handler: (station) => {
              if (!station) {
                return false;
              }
              this.selectedStation = station;
              this.stationsAlert.didLeave.subscribe(() => {
                this.initiateRapidScanMode();
              });
            }
          }
        ],
        cssClass: this.selectedTheme + ' gc-alert'
      });

      for (let station of this.form.event_stations) {
        this.stationsAlert.addInput({label: station.name, value: station.id, type: 'radio', checked: station.id == this.selectedStation});
      }
      this.stationsAlert.present();
       */
    } else {
      this.initiateRapidScanMode();
    }
  }

  clearPlaceholders() {
    this.form.elements.forEach((element) => {
      element.placeholder = '';
    });
  }

  tryClearDocumentsSelection() {
    this.form.elements
      .filter((d) => d.type === 'documents')
      .forEach((element) => {
        if (element.documents_set && element.documents_set.selectedDocumentIdsForSubmission) {
          element.documents_set.selectedDocumentIdsForSubmission = [];
        }
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
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                this.navCtrl.pop()
              }
            },
            {
              text: 'Ok',
              handler: (scanSource) => {
                if (!scanSource) {
                  return false;
                }
                this.selectedScanSource = scanSource;
                this.startRapidScanModeForSource(this.selectedScanSource);
              },
            },

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
