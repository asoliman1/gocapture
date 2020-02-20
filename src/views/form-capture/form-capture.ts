import { FormsProvider } from './../../providers/forms/forms';
import { SettingsService } from './../../services/settings-service';
import { formViewService } from './../../components/form-view/form-view-service';
import { Util } from './../../util/util';
import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import {
  Content,
  MenuController,
  ModalController,
  Navbar,
  NavController,
  NavParams,
  Platform, Popover, Modal
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
import { AppPreferences } from "@ionic-native/app-preferences";
import { StationsPage } from "../stations/stations";
import { Idle } from 'idlejs/dist';
import { ScreenSaverPage } from '../../pages/screen-saver/screen-saver';
import { Insomnia } from '@ionic-native/insomnia';
import { Station } from '../../model/station';
import { settingsKeys } from '../../constants/constants';
import { Intercom } from '@ionic-native/intercom';

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
  errorMessage: { text: string, param: string } = { text: '', param: '' };

  submitAttempt: boolean = false;

  prospect: DeviceFormMembership;

  isEditing: boolean = false;

  isProcessing: boolean = false;

  selectedStation: Station;

  private backUnregister;

  private selectedTheme;

  private scanSources = [];

  private selectedScanSource;

  isRapidScanMode: boolean = false;

  stationsSelectOptions: string = '';

  private stationsPopover: Popover;

  private idle: Idle;

  private _modal: Modal;

  private location;

  buttonBar: Subscription;

  captureBg: string;

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
    private appPreferences: AppPreferences,
    private utils: Util,
    private formViewService: formViewService,
    private formsProvider: FormsProvider,
    private settingsService: SettingsService,
    private intercom: Intercom,
    private insomnia: Insomnia) {
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
    // A.S
    this.idle = new Idle();
    this.getSavedLocation()
    this.setupForm();
    this.convertCaptureImageSrc();
  }


  getSavedLocation() {
    this.settingsService.getSetting(settingsKeys.LOCATION).subscribe((data) => {
      if (data) this.location = JSON.parse(data);
    })
  }


  ngAfterViewInit() {
    // A.S GOC-333
    this.setupIdleMode();

    this.menuCtrl.enable(false);

    this.checkInstructions();
  }

  private checkInstructions() {
    let instructions = this.localStorage.get("FormInstructions");
    let formsInstructions = instructions ? JSON.parse(instructions) : [];
    let shouldShowInstruction = !this.submission.id && this.form && this.form.is_enforce_instructions_initially && formsInstructions.indexOf(this.form.id) == -1;

    if (shouldShowInstruction) {
      this.openInstructions(formsInstructions);
    } else {
      if (!this.submission.id) {
        this.openStations();
      }
    }
  }

  private openInstructions(formsInstructions) {

    let instructionsModal = this.modal.create(FormInstructions, { form: this.form, isModal: true });

    instructionsModal.present().then((result) => {
      formsInstructions.push(this.form.id);
      this.localStorage.set("FormInstructions", JSON.stringify(formsInstructions));
    });

    instructionsModal.onDidDismiss(() => {
      if (!this.submission.id) {
        this.openStations();
      }
    })
  }

  ngOnInit() {

  }

  private setupIdleMode() {
    if (this.form.event_style.is_enable_screensaver && !this.isRapidScanMode) {
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
          this.showScreenSaver()
          console.log('idle mode started')
        })
        .start();
  }

  private isScreenSaverAllowed() {
    return this.navCtrl.last().instance instanceof FormCapture &&
      this.form.event_style.is_enable_screensaver &&
      !this.isRapidScanMode;
  }

  // A.S
  private async showScreenSaver() {
    // get updated data of form
    this.form.event_style = this.getFormStyle();
    if (this.imagesDownloaded()) {
      if (!this._modal && this.isScreenSaverAllowed()) {
        this.handleScreenSaverRandomize()
        this._modal = this.modal.create(ScreenSaverPage, { event_style: this.form.event_style }, { cssClass: 'screensaver' });
        await this._modal.present();
        console.log('Screen saver started.')
        this._modal.onDidDismiss(() => {
          this._modal = null
          this.idle.restart();
          console.log('Screen saver dismissed.')
        })
      }
    } else {
      console.log('Still downloading images...');
    }
  }

  // A.S
  private handleScreenSaverRandomize() {
    if (this.form.event_style.is_randomize)
      this.form.event_style.screensaver_media_items = this.utils.shuffle(this.form.event_style.screensaver_media_items)
  }

  // A.S
  private imagesDownloaded() {
    this.form.event_style.screensaver_media_items = this.form.event_style.screensaver_media_items.filter((e) => !e.path.startsWith('https://'))
    return this.form.event_style.screensaver_media_items.length;
  }

  // A.S
  private stopIdleMode() {
    this.idle.stop()
    // console.log('idle mode stopped');
  }

  // return updated object data of form
  getFormSubmissions() {
    return this.navParams.get("form").total_submissions;
  }

  // return updated object data of form
  getFormStyle() {
    return this.navParams.get("form").event_style;
  }

  private async setupForm() {
    // return new object data of form (not updated)
    this.form = Object.assign(new Form(), this.navParams.get("form"));
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

  private convertCaptureImageSrc() {
    let win: any = window;
    this.captureBg = win.Ionic.WebView.convertFileSrc(this.form.event_style.capture_background_image.path);
  }

  private setStation(submission) {
    if (submission && submission.station_id) {
      this.selectedStation = this.getStationById(submission.station_id);
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

    this.popup.showLoading({ text: 'alerts.loading.loading-scanner' });

    let element = this.getElementForId(this.selectedScanSource);
    this.startRapidScan(element);
  }

  private startRapidScan(element) {
    //save form id for which we have rapidscan
    this.appPreferences.store("rapidScan", "formId", this.form.form_id);
    if (this.selectedStation) {
      this.appPreferences.store("rapidScan-" + this.form.form_id, "stationId", this.selectedStation.id);
    }
    this.utils.setPluginPrefs('rapid-scan');
    this.appPreferences.store("rapidScan-" + this.form.form_id, "elementId", element.id);
    this.rapidCaptureService.start(element, this.form.form_id + "").then((items) => {
      this.popup.dismiss('loading');
      setTimeout(() => {
        this.utils.rmPluginPrefs('rapid-scan');
      }, 500);
      if (items.length)
        this.processRapidScanResult(items, element);
    }).catch((err) => {
      this.popup.dismiss('loading');
      setTimeout(() => {
        this.utils.rmPluginPrefs('rapid-scan');
      }, 500);
    });

    this.appPreferences.store("rapidScan-" + this.form.form_id, "captureType", this.rapidCaptureService.getType());
  }


  private processRapidScanResult(items, element) {
    // A.S GOC-322
    this.popup.showToast({ text: 'toast.uploading-leads' }, "bottom", "success");

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
      this.formsProvider.updateFormSubmissions(this.form.form_id);
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
      submission.station_id = this.selectedStation.id;
    }

    submission.location = this.location;

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
        sources.push({ id: businessCardElement.id, name: "form-capture.business-card" });
      }
    }

    if (barcodeElement) {
      sources.push({ id: barcodeElement.id, name: "form-capture.badge-scan" });
    }

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

  private handleBack() {
    this.backUnregister = this.platform.registerBackButtonAction(() => {
      this.doBack();
    }, Number.MAX_VALUE);
    this["oldClick"] = this.navbar.backButtonClick;
    this.navbar.backButtonClick = () => {
      this.doBack();
    };
  }

  private handleKioskMode() {
    let isKioskMode = this.form.is_mobile_kiosk_mode && !this.form.is_mobile_quick_capture_mode;
    if (isKioskMode) {
      this.client.hasKioskPassword().subscribe(hasPwd => {

        if (!hasPwd) {

          const inputs = [{
            name: 'passcode',
            placeholder: 'alerts.kiosk-mode.placeholder',
            value: ""
          }];

          const buttons = [
            {
              text: 'general.cancel',
              role: 'cancel',
              handler: () => {
              }
            },
            {
              text: 'general.ok',
              handler: (data) => {
                let password = data.passcode;
                this.client.setKioskPassword(password).subscribe((valid) => {

                });
              }
            }];

          this.popup.showPrompt({ text: 'alerts.kiosk-mode.set-password' }, { text: '' }, inputs, buttons);
        }
      })
    }
  }

  private listenToBtns() {
    this.buttonBar = this.formViewService.onButtonEmit.subscribe((data) => {
      if (data == 'reset') this.resetForm();
      else if (data == 'submit') this.doSave();
    })
  }

  private disableIntercom() {
    this.intercom.setInAppMessageVisibility('GONE');
    this.intercom.setLauncherVisibility('GONE');
  }

  ionViewDidEnter() {
    this.disableIntercom();
    this.handleBack();
    this.handleKioskMode();
    this.listenToBtns();
  }


  ionViewWillLeave() {
    this.intercom.setInAppMessageVisibility('VISIBLE');

    if (this.backUnregister) {
      this.backUnregister();
    }
    this.navbar.backButtonClick = this["oldClick"];

    if (this.stationsPopover) {
      this.stationsPopover.dismiss();
    }
    this.stopIdleMode();
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
    this.insomnia.allowSleepAgain()
      .then(() => { })
      .catch((err) => console.log(err));
    this.buttonBar.unsubscribe();
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
              text: 'general.cancel',
              role: 'cancel',
              handler: () => {
              }
            },
            {
              text: 'general.ok',
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
            placeholder: 'alerts.kiosk-mode.placeholder',
            value: ""
          }];

          this.popup.showPrompt({ text: 'alerts.kiosk-mode.enter-passcode' }, { text: '' }, inputs, buttons);

        } else {
          const buttons = [
            {
              text: 'general.ok',
              handler: () => {
                this.internalBack();
              }
            }];

          this.popup.showAlert('Info', { text: 'alerts.kiosk-mode.message' }, buttons);
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
        text: 'general.ok',
        role: 'cancel',
        handler: () => {
          //console.log('Cancel clicked');
        }
      },
      {
        text: 'general.back',
        handler: () => {
          this.clear();
          this.navCtrl.pop();
        }
      }
    ];

    this.vibration.vibrate(500);

    this.popup.showAlert("alerts.warning", { text: 'form-capture.unsubmitted-data-msg' }, buttons);
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

  private isFormValid() {
    /*
  When transcription is enabled, the app is still requiring name and email.
  If there is a business card attached and transcription is turned on, we should not require either of these fields.
  */
    let isNotScanned = this.submission.barcode_processed == BarcodeStatus.None;
    let noTranscriptable = !this.isTranscriptionEnabled() || (this.isTranscriptionEnabled() && !this.isBusinessCardAdded());

    if (isNotScanned && noTranscriptable) {
      if (!this.isEmailOrNameInputted()) {
        this.errorMessage.text = "form-capture.error-msg";
        this.content.resize();
        return false;
      } else if (!this.valid && !this.shouldIgnoreFormInvalidStatus()) {
        this.errorMessage = this.formView.getError();
        this.content.resize();
        return false;
      }
    }
    return true;
  }

  public doSave(shouldSyncData = true) {
    this.submitAttempt = true;

    if (!this.isFormValid()) return;

    this.submission.fields = { ...this.formView.getValues(), ...this.getDocumentsForSubmission() };

    if (!this.submission.id) {
      this.submission.id = new Date().getTime();
    }

    if (this.submission.status != SubmissionStatus.Blocked) {
      this.submission.status = SubmissionStatus.ToSubmit;
    }

    this.submission.hidden_elements = this.form.getHiddenElementsPerVisibilityRules();

    if (this.selectedStation) {
      this.submission.station_id = this.selectedStation.id;
    }

    this.setSubmissionType();
    // A.S
    this.submission.location = this.location;
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
      this.formsProvider.updateFormSubmissions(this.form.form_id);
      this.kioskModeCallback();
    }, (err) => {
      console.error(err);
    });

  }

  invalidControls() {
    const invalid = [];
    const controls = this.formView.theForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  /*
   Per our discussion, from the device side we should ignore validation Required fields if they are hidden because
   of visibility rules and send their IDs in the hidden_elements array to our backend.
   */
  shouldIgnoreFormInvalidStatus() {
    let invalidControls = this.invalidControls();

    let requiredElements = this.requiredElements(invalidControls);

    if (requiredElements.length == 0) {
      return false;
    }

    let hiddenElements = this.form.getHiddenElementsPerVisibilityRules();

    for (let requiredElement of requiredElements) {
      if (hiddenElements.filter(hiddenElement => hiddenElement === requiredElement).length == 0) {
        return false;
      }
    }

    return true;
  }

  requiredElements(controls) {
    let requiredElements = [];
    for (let control of controls) {
      let id = control.split('_').pop();
      let invalidElement = this.form.elements.filter(element => element.id == id)[0];
      if (invalidElement.is_required === false) {
        return [];
      }
      requiredElements.push(control);
    }
    return requiredElements;
  }

  kioskModeCallback() {
    if (this.form.is_mobile_kiosk_mode) {
      this.popup.showToast(
        { text: 'toast.submission-successfull' },
        'bottom',
        'success',
        1500,
      );
      this.resetForm();
    } else {
      this.navCtrl.pop();
    }
  }

  private resetForm() {
    this.clearPlaceholders();
    this.submission = null;
    this.form = null;
    this.dispatch = null;
    setTimeout(() => {
      this.zone.run(() => {
        this.setupForm();
      });
    }, 10);
  }

  setSubmissionType() {
    if (this.submission.barcode_processed == BarcodeStatus.Processed ||
      this.submission.barcode_processed == BarcodeStatus.Queued ||
      this.submission.barcode_processed == BarcodeStatus.PostShowReconsilation) {
      this.submission.submission_type = FormSubmissionType.barcode;
    } else if (this.submission.prospect_id) {
      this.submission.submission_type = FormSubmissionType.list;
    } else if (this.isTranscriptionEnabled() && this.isBusinessCardAdded()) {
      this.submission.submission_type = FormSubmissionType.transcription;
    }
  }

  onValidationChange(valid: boolean) {
    this.valid = valid;
    setTimeout(() => {
      this.errorMessage.text = '';
      this.errorMessage.param = '';
    });

    this.content.resize();
  }

  onProcessing(event) {
    this.isProcessing = JSON.parse(event);
    if (this.isProcessing) this.stopIdleMode();
    else this.setupIdleMode()
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
            let value =
              isAudio && data.fields[field] && data.fields[field].startsWith('http') ?
                data.fields[field] :
                data.fields[field] || this.formView.getFormGroup().value[id];

            this.submission.fields[id] = value;

            let identifier = id.replace("element_", "");

            let index = identifier.indexOf("_");
            let parentId = identifier.substring(0, index);

            if (!parentId) {
              parentId = identifier;
            }


            let element = this.getElementForId(parentId);
            element.is_filled_from_list = true;

            vals.push({ id, value });
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
      this.popup.showPopover(StationsPage, {
        stations: this.form.event_stations,
        selectedStation: this.selectedStation,
        visitedStations: this.submission.stations,
        disableStationSelection: this.isAllowedToEdit(this.submission) && !this.isEditing
      }, false, this.selectedTheme + ' gc-popover').onDidDismiss((data) => this.onStationDismiss(data))
    } else {
      this.initiateRapidScanMode();
    }
  }

  private onStationDismiss(data) {
    if (data.isCancel) {
      if (!this.submission.id && !this.selectedStation) {
        this.navCtrl.pop();
      }
    } else {
      this.selectedStation = data.station;
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
        this.popup.showAlert(
          'form-capture.scan-mode',
          { text: '' },
          [
            {
              text: 'general.cancel',
              role: 'cancel',
              handler: () => {
                this.navCtrl.pop()
              }
            },
            {
              text: 'general.ok',
              handler: (scanSource) => {
                if (!scanSource) {
                  return false;
                }
                this.selectedScanSource = scanSource;
                this.startRapidScanModeForSource(this.selectedScanSource);
              },
            },

          ],
          this.selectedTheme + ' gc-alert',
          this.scanSources.map((e) => {
            return {
              label: e.name,
              value: e.id,
              type: 'radio',
              checked: this.selectedStation && e.id == this.selectedStation.id
            }
          })
        );

      }
    }
  }

  // A.S
  getStationById(stationId) {
    for (let station of this.form.event_stations)
      if (station.id == stationId) return station;

    return null;
  }
}
