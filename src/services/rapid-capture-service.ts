import {BarcodeStatus, FormElement, FormSubmission, SubmissionStatus} from "../model";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {Platform} from "ionic-angular";
import {Ndef, NFC} from "@ionic-native/nfc";
import {BadgeRapidCapture} from "./badge-rapid-capture";
import {BCRapidCapture} from "./bc-rapid-capture";
import {Injectable} from "@angular/core";
import {ImageProcessor} from "./image-processor";
import {File} from "@ionic-native/file";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {Camera} from "@ionic-native/camera";
import {Util} from "../util/util";
import {AppPreferences} from "@ionic-native/app-preferences";
import {Popup} from "../providers/popup/popup";
import {Observable} from "rxjs";
import {BussinessClient} from "./business-service";
import {ScannerType} from "../components/form-view/elements/badge/Scanners/Scanner";

export interface RapidCapture {
  capture(element: FormElement, id?: string): Promise<any[]>;
}

@Injectable()

export class RapidCaptureService {

  captureService : RapidCapture;
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
      this.captureService = new BadgeRapidCapture(this.barcodeScanner, this.platform, this.nfc, this.ndef, this.appPreferences);
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
      let barcodes = await this.appPreferences.fetch(this.dictKey(formId), formId + "");
      console.log('BARCODES - ' + JSON.stringify(barcodes));

      let selectedForm = forms.filter((form) => {
        return form.form_id == formId;
      })[0];

      // console.log('Form - ' + JSON.stringify(selectedForm));

      let stationId = await this.appPreferences.fetch(this.dictKey(formId), "stationId");

      console.log('Station id - ' + stationId);
      let elementId = await this.appPreferences.fetch(this.dictKey(formId), "elementId");

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
          this.appPreferences.remove(this.dictKey(selectedForm.form_id), selectedForm.form_id + "");
          this.appPreferences.remove(this.dictKey(selectedForm.form_id), "stationId");
          this.appPreferences.remove(this.dictKey(selectedForm.form_id), "elementId");
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


  private dictKey(formId) {
    return "rapidScan-" + formId + "";
  }

  private processRapidScanResult(items, form, station, elementId) {
    let submissions = [];

    for (let item of items) {
      let saveSubmObservable = this.saveSubmissionWithData(item, form, station, elementId);
      submissions.push(saveSubmObservable);
    }

    Observable.zip(...submissions).subscribe(() => {
      this.appPreferences.remove(this.dictKey(form.form_id), form.form_id + "").then(() => {
        this.isProcessing = false;
      });
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
  private saveSubmissionWithData(data, form, station, element) {
    let submission = new FormSubmission();
    let elementId = "element_" + element;
    submission.fields[elementId] = data;
    submission.id = new Date().getTime() + Math.floor(Math.random() * 100000);
    submission.form_id = form.form_id;

    submission.status = SubmissionStatus.ToSubmit;

    submission.is_rapid_scan = 1;

    submission.hidden_elements = form.getHiddenElementsPerVisibilityRules();

    submission.station_id = station;

    submission.barcode_processed = BarcodeStatus.Queued;

    return this.client.saveSubmission(submission, form, false);
  }
}
