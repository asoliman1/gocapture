import { RESTClient } from './../../services/rest-client';
import { ActivationViewPage } from './../../pages/activation-view/activation-view';
import { ACTIVATIONS_DISPLAY_FORM } from './../../constants/activations-display';
import { Activation } from './../../model/activation';
import { Util } from './../../util/util';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  ViewChild
} from '@angular/core';
import {
  Content,
  ModalController,
  Navbar,
  NavController,
  NavParams,
  Popover,
  Modal,
} from 'ionic-angular';
import { BussinessClient } from "../../services/business-service";
import {
  BarcodeStatus,
  DeviceFormMembership,
  DispatchOrder,
  Form,
  FormSubmission, FormSubmissionType,
  SubmissionStatus,
} from "../../model";

import { Popup } from "../../providers/popup/popup";

import moment from "moment";
import { ThemeProvider } from "../../providers/theme/theme";
import { FormInstructions } from "../form-instructions";
import { StationsPage } from "../stations/stations";
import { Idle } from 'idlejs/dist';
import { ScreenSaverPage } from '../../pages/screen-saver/screen-saver';
import { Station } from '../../model/station';
import { FormView } from '../../components/form-view/form-view';
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
  isActivationProcessing: boolean = false;

  selectedStation: Station;
  private backUnregister;

  stationsSelectOptions: string = '';

  private stationsAlert;

  private stationsPopover: Popover;

  private idle: Idle;

  private _modal: Modal;

  private location;
  captureBg: string;

  activation: Activation = this.navParams.get("activation");
  openBadgeScan = false;
  noTranscriptable: boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private client: BussinessClient,
    private zone: NgZone,
    private modal: ModalController,
    private popup: Popup,
    private themeProvider: ThemeProvider,
    private utils: Util,
    private restClient: RESTClient,
  ) {
    this.idle = new Idle();
    this.getSavedLocation()
    this.setupForm();
  }

  setTheme() {
    this.themeProvider.setActiveTheme(this.form.event_style.theme);
  }

  async getSavedLocation() {
    this.location = await this.client.getLocation();
  }

  ngAfterViewInit() {

  }

  private checkInstructions() {
    let instructions = localStorage["FormInstructions"];
    let formsInstructions = instructions ? JSON.parse(instructions) : [];
    let shouldShowInstruction = !this.submission.id && this.form && this.form.is_enforce_instructions_initially && formsInstructions.indexOf(this.form.id) == -1;

    if (shouldShowInstruction) {
      this.openInstructions(formsInstructions);
    }
  }

  private openInstructions(formsInstructions) {

    let instructionsModal = this.modal.create(FormInstructions, { form: this.form, isModal: true });

    instructionsModal.present().then((result) => {
      formsInstructions.push(this.form.id);
      localStorage.set("FormInstructions", JSON.stringify(formsInstructions));
    });

  }

  ngOnInit() {

  }

  private handleIdleMode() {
    let screensaverData = this.activation ? this.activation.activation_style : this.form.event_style;
    if (screensaverData.is_enable_screensaver && screensaverData.screensaver_media_items.length) {
      this.idle
        .whenNotInteractive()
        .within(screensaverData.screensaver_rotation_period, 1000)
        .do(() => {
          this.showScreenSaver(screensaverData)
          console.log('idle mode started')
        })
        .start();
    }

  }

  // A.S
  private async showScreenSaver(data: any) {
    // get updated data of form
    let active = this.navCtrl.last().instance instanceof FormCapture;

    if (!this._modal && active) {
      this.handleScreenSaverRandomize(data)
      this._modal = this.modal.create(ScreenSaverPage, { event_style: data }, { cssClass: 'screensaver' });
      await this._modal.present();
      this._modal.onDidDismiss(() => {
        this._modal = null
        this.idle.restart();
      })
    }

  }

  // A.S
  private handleScreenSaverRandomize(data: any) {
    if (data.is_randomize) data.screensaver_media_items = this.utils.shuffle(data.screensaver_media_items);
  }

  // A.S
  private stopIdleMode() {
    this.idle.stop()
  }

  getCaptureScreenUrlOrder(captureOrder) {
    switch (captureOrder) {
      case ACTIVATIONS_DISPLAY_FORM.SPLIT_LEFT:
        return 2;
      case ACTIVATIONS_DISPLAY_FORM.SPLIT_RIGHT:
        return -1;
    }
  }

  private async setupForm() {
    this.submission = new FormSubmission();
    this.form = Object.assign(new Form(), this.navParams.get('form'));
    this.captureBg = this.form.event_style.capture_background_image;
    this.activation = this.navParams.get('act');
    this.submission.form_id = this.form.form_id;
    this.setTheme();
    this.handleIdleMode();
    this.checkInstructions();
    this.openStations();
  }


  ionViewWillLeave() {
    if (this.stationsPopover) {
      this.stationsPopover.dismiss();
    }
    this.stopIdleMode();
  }


  doBackWithCheckingActivation() {
    if (this.activation) {
      if (this.activation.activation_capture_form_after) {
        const buttons = [
          {
            text: 'general.cancel',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: 'general.ok',
            handler: () => {
              let currentIndex = this.navCtrl.getActive().index;
              this.navCtrl.push(ActivationViewPage, { activation: { ...this.activation } }).then(() => {
                this.navCtrl.remove(currentIndex);

              });
            }
          }

        ]
        this.popup.showAlert('Warning', { text: 'alerts.activation.message' }, buttons);
      }
      else {
        this.navCtrl.pop();
      }
    }
    else {
      this.navCtrl.pop();
    }
  }


  private clear() {
    this.formView.clear();
  }

  private handleValidations() {
    if (!this.isEmailOrNameInputted()) {
      this.errorMessage.text = "form-capture.error-msg";
      this.content.resize();
      return false;
    } else if (!this.valid && !this.shouldIgnoreFormInvalidStatus()) {
      this.errorMessage = this.formView.getError();
      this.content.resize();
      return false;
    }
    return true;
  }

  private handleSubmitParams() {
    this.submission.fields = { ...this.formView.getValues(), ...this.getDocumentsForSubmission() };
    if (!this.submission.id) this.submission.id = new Date().getTime();
    if (this.submission.status != SubmissionStatus.Blocked)
      this.submission.status = SubmissionStatus.ToSubmit;
    this.submission.hidden_elements = this.getHiddenElements();
    if (this.selectedStation) this.submission.station_id = this.selectedStation.id;
    this.setSubmissionType();
    this.submission.location = this.location;
    this.submission.updateFields(this.form);
  }

  public doSave() {
    if (this.handleValidations()) {
      this.handleSubmitParams();
      this.goToSubmit();
    }
  }

  goToSubmit() {
    if (this.activation) this.submitActivation();
    else this.submitForm();
  }


  submitActivation() {
    this.openBadgeScan = false;
    this.isActivationProcessing = true;

    this.restClient.submitForm(this.submission).subscribe(async (sub) => {
   
      this.tryClearDocumentsSelection();
      this.isActivationProcessing = false;

      if (sub.submission.prospect_id) {
        if (this.navParams.get('activationResult') && Object.keys(this.navParams.get('activationResult')).length > 0) {
          this.isActivationProcessing = true;

          await this.restClient.submitActivation({
            activation_id: this.activation.id,
            activation_result: this.navParams.get('activationResult'),
            activity_id: sub.submission.activity_id,
            prospect_id: sub.submission.prospect_id
          }).toPromise();
          this.isActivationProcessing = false;

        }

        this.goToGame(sub.submission);
      }

    }, (err) => {
      this.submission.prospect_id = null;
      this.isActivationProcessing = false;
      console.log(err);
    })

  }

  goToGame(submission: FormSubmission) {
    if (this.navParams.get("isNext") && this.activation.activation_capture_form_after) {
      let currentIndex = this.navCtrl.getActive().index;
      this.navCtrl.push(ActivationViewPage, {
        activation: this.activation,
        activityId: submission.activity_id,
      }).then(() => {
        this.navCtrl.remove(currentIndex);
      });
    }
    else if (this.navParams.get("isNext") || !this.navParams.get('activationResult')) {
      let currentIndex = this.navCtrl.getActive().index;
      this.navCtrl.push(ActivationViewPage, {
        activation: this.activation,
        activityId: submission.activity_id,
        prospectId: submission.prospect_id
      }).then(() => {
        this.navCtrl.remove(currentIndex);
      });
    }

  }

  getHiddenElements(): string[] {
    if (this.activation) {
      let hidden = this.form.getHiddenElementsPerVisibilityRules().concat(this.form.getHiddenElementsPerVisibilityRulesForActivation());
      let hiddenSet = new Set(hidden);
      let hiddenElements = Array.from(hiddenSet);
      return hiddenElements;
    }
    else {
      let hiddenElements = this.form.getHiddenElementsPerVisibilityRules();
      return hiddenElements;
    }

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
    if (requiredElements.length == 0) return false;
    let hiddenElements = this.getHiddenElements();
    for (let requiredElement of requiredElements) {
      if (hiddenElements.filter(hiddenElement => hiddenElement === requiredElement).length == 0)
        return false;
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

  submitForm() {
    this.submitAttempt = true;
    this.restClient.submitForm(this.submission).subscribe((d) => {
      this.popup.showToast(
        { text: 'toast.submission-successfull' },
        'bottom',
        'success',
        1500,
      );
      this.tryClearDocumentsSelection();
      this.resetForm();
      this.submitAttempt = false;
    }, err => {
      this.submitAttempt = false;
    })
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
    if (this.activation)
      this.submission.submission_type = FormSubmissionType.activation
    else if (this.submission.barcode_processed == BarcodeStatus.Processed ||
      this.submission.barcode_processed == BarcodeStatus.Queued ||
      this.submission.barcode_processed == BarcodeStatus.PostShowReconsilation) {
      this.submission.submission_type = FormSubmissionType.barcode;
    } else if (this.submission.prospect_id) {
      this.submission.submission_type = FormSubmissionType.list;
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
    this.isActivationProcessing = JSON.parse(event);
    if (this.isProcessing || this.isActivationProcessing) this.stopIdleMode();
    else this.handleIdleMode()
  }

  canSubmitForm(event) {
    let isSubmit = JSON.parse(event);
    if (isSubmit) {
      this.openBadgeScan = isSubmit;
      this.doSave();
    }
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


  submissionDate() {
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

  openStations(ev?) {
    if (this.form.event_stations.length && !this.selectedStation && !this.isThereActivation()) {
      this.popup.showPopover(StationsPage, {
        stations: this.form.event_stations,
        selectedStation: this.selectedStation,
        visitedStations: this.submission.stations,
        disableStationSelection: false
      }, false, ev).onDidDismiss((data) => this.onStationDismiss(data))
    }
  }

  private onStationDismiss(data) {
    if (data.isCancel) {
      if (!this.submission.id && !this.selectedStation) {
        this.navCtrl.pop();
      }
    } else {
      this.selectedStation = data.station;
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

  isThereActivation() {
    return this.activation ? true : false;
  }
}
