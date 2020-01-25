import {BarcodeStatus, FormElement, FormSubmission, FormSubmissionType, SubmissionStatus} from "../model";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { Platform } from "ionic-angular";
import { Ndef, NFC } from "@ionic-native/nfc";
import { BadgeRapidCapture } from "./badge-rapid-capture";
import { BCRapidCapture } from "./bc-rapid-capture";
import { Injectable } from "@angular/core";
import { ImageProcessor } from "./image-processor";
import { File } from "@ionic-native/file";
import { Camera } from "@ionic-native/camera";
import { Util } from "../util/util";
import { AppPreferences } from "@ionic-native/app-preferences";
import { Popup } from "../providers/popup/popup";
import { Observable } from "rxjs";
import { BussinessClient } from "./business-service";

export interface RapidCapture {
  type: FormSubmissionType;
  capture(element: FormElement, id?: string): Promise<any[]>;
}

@Injectable()

export class RapidCaptureService {

  captureService: RapidCapture;
  isProcessing: boolean = false;

  constructor(public barcodeScanner: BarcodeScanner,
    public platform: Platform,
    public nfc: NFC,
    public ndef: Ndef,
    public imageProc: ImageProcessor,
    public fileService: File,
    public camera: Camera,
    public util: Util,
    public appPreferences: AppPreferences,
    public popup: Popup,
    public client: BussinessClient) {
    //
  }

  start(element: FormElement, id: string): Promise<any[]> {
    if (element.type == "business_card") {
      this.captureService = new BCRapidCapture(this.imageProc, this.fileService, this.platform, this.camera, this.util);
    } else {
      // A.S
      this.captureService = new BadgeRapidCapture(this.barcodeScanner, this.platform, this.nfc, this.ndef, this.appPreferences, null, null , this.util);
    }
    return this.captureService.capture(element, id);
  }

  getType() {
    return this.captureService.type;
  }

  public async processUnsentBadges(forms, theme) {
    if (forms.length == 0 || this.isProcessing) {
      return;
    }
    this.isProcessing = true;
    let formId = await this.appPreferences.fetch("rapidScan", "formId");
    if (formId) {
    console.log('FORM ID - ' + formId);

      let barcodes = await this.appPreferences.fetch(RapidCaptureService.dictKey(formId), formId + "");
      console.log('BARCODES - ' + JSON.stringify(barcodes));

      let selectedForm = forms.filter((form) => {
        return form.form_id == formId;
      })[0];

      // console.log('Form - ' + JSON.stringify(selectedForm));

      let stationId = await this.appPreferences.fetch(RapidCaptureService.dictKey(formId), "stationId");

      console.log('Station id - ' + stationId);
      let elementId = await this.appPreferences.fetch(RapidCaptureService.dictKey(formId), "elementId");
      console.log('Element id - ' + elementId);

      let captureType = await this.appPreferences.fetch(RapidCaptureService.dictKey(formId), "captureType");

      if (barcodes && barcodes.length > 0) {
        this.showUserPrompt(barcodes, selectedForm, stationId, elementId, theme, captureType);
      }
    }
  }

  private showUserPrompt(barcodes, selectedForm, stationId, elementId, theme, captureType) {
    const buttons = [
      {
        text: 'general.remove',
        role: 'cancel',
        handler: () => {
          this.isProcessing = false;
          this.removeDefaults(selectedForm.form_id + '');
        }
      },
      {
        text: 'alerts.rapid-scan.process',
        handler: () => {
          this.processRapidScanResult(barcodes, selectedForm, stationId, elementId, captureType);
        }
      }];
    this.popup.showAlert("general.important", {text:"alerts.rapid-scan.badges-reminder",params:{formName: selectedForm.name}}, buttons, theme);
  }

  removeDefaults(formId) {
    this.appPreferences.remove("rapidScan", "formId");
    this.appPreferences.remove(RapidCaptureService.dictKey(formId), formId);
    this.appPreferences.remove(RapidCaptureService.dictKey(formId), "stationId");
    this.appPreferences.remove(RapidCaptureService.dictKey(formId), "elementId");
    this.appPreferences.remove(RapidCaptureService.dictKey(formId), "captureType");
  }


  public static dictKey(formId) {
    return "rapidScan-" + formId + "";
  }

  private processRapidScanResult(items, form, station, elementId, captureType) {
    let submissions = [];

    let i = 100;
    let timestamp = new Date().getTime();
    for (let item of items) {
      let submId = parseInt(timestamp + "" + i);
      let saveSubmObservable = this.saveSubmissionWithData(item, form, station, elementId, submId, captureType);
      i++;
      submissions.push(saveSubmObservable);
    }

    Observable.zip(...submissions).subscribe(() => {
      this.removeDefaults(form.form_id);
      this.isProcessing = false;
      this.client.doSync(form.form_id).subscribe(() => {
        console.log('rapid scan synced items');
        //clear the defaults
      }, (error) => {
        console.error(error);
        this.isProcessing = false;
      });
    }, (error) => {
      console.error(error);
      this.isProcessing = false;
    })
  }

  //saving subm from rapid scan mode
  private saveSubmissionWithData(data, form, station, element, submId, captureType) {
    let submission = new FormSubmission();
    let elementId = "element_" + element;
    submission.fields[elementId] = data;
    submission.id = submId;
    submission.form_id = form.form_id;

    submission.status = SubmissionStatus.ToSubmit;

    submission.is_rapid_scan = 1;

    submission.hidden_elements = form.getHiddenElementsPerVisibilityRules();

    submission.station_id = station;

    if (captureType == FormSubmissionType.barcode) {
      submission.barcode_processed = BarcodeStatus.Queued;
      submission.submission_type = FormSubmissionType.barcode;
    } else if (captureType == FormSubmissionType.transcription) {
      submission.submission_type = FormSubmissionType.transcription;
    }

    return this.client.saveSubmission(submission, form, false);
  }
}
