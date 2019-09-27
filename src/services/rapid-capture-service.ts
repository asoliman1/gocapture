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


  public async processUnsentBadges(forms, theme) {
    if (forms.length == 0 || this.isProcessing) {
      return;
    }
    this.isProcessing = true;
    let formId = await this.appPreferences.fetch("rapidScan", "formId");
    console.log('FORM ID - ' + formId);
    if (formId) {
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

      if (barcodes && barcodes.length > 0) {
        this.showUserPrompt(barcodes, selectedForm, stationId, elementId, theme);
      }
    }
  }

  private showUserPrompt(barcodes, selectedForm, stationId, elementId, theme) {
    const buttons = [
      {
        text: 'Delete',
        role: 'cancel',
        handler: () => {
          this.isProcessing = false;
          this.removeDefaults(selectedForm.form_id + '');
        }
      },
      {
        text: 'Process',
        handler: () => {
          this.processRapidScanResult(barcodes, selectedForm, stationId, elementId);
        }
      }];
    this.popup.showAlert("Important", "You have Rapid Scanned badges for " + selectedForm.name + " saved in local storage on this device that have not been submitted. Do you want to submit or delete them?", buttons, theme);
  }

  removeDefaults(formId) {
    this.appPreferences.remove("rapidScan", "formId");
    this.appPreferences.remove(RapidCaptureService.dictKey(formId), formId);
    this.appPreferences.remove(RapidCaptureService.dictKey(formId), "stationId");
    this.appPreferences.remove(RapidCaptureService.dictKey(formId), "elementId");
  }


  public static dictKey(formId) {
    return "rapidScan-" + formId + "";
  }

  private processRapidScanResult(items, form, station, elementId) {
    let submissions = [];

    let i = 100;
    let timestamp = new Date().getTime();
    for (let item of items) {
      let submId = parseInt(timestamp + "" + i);
      let saveSubmObservable = this.saveSubmissionWithData(item, form, station, elementId, submId);
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
  private saveSubmissionWithData(data, form, station, element, submId) {
    let submission = new FormSubmission();
    let elementId = "element_" + element;
    submission.fields[elementId] = data;
    submission.id = submId;
    submission.form_id = form.form_id;

    submission.status = SubmissionStatus.ToSubmit;

    submission.is_rapid_scan = 1;

    submission.hidden_elements = form.getHiddenElementsPerVisibilityRules();

    submission.station_id = station;

    if (this.captureService.type == FormSubmissionType.barcode) {
      submission.barcode_processed = BarcodeStatus.Queued;
      submission.submission_type = FormSubmissionType.barcode;
    } else if (this.captureService.type == FormSubmissionType.transcription) {
      submission.submission_type = FormSubmissionType.transcription;
    }

    return this.client.saveSubmission(submission, form, false);
  }
}
