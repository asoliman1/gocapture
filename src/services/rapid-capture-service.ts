import {FormElement} from "../model";
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

export interface RapidCapture {
  capture(element: FormElement): Promise<string[]>;
}

@Injectable()

export class RapidCaptureService {

  captureService : RapidCapture;

  constructor(public barcodeScanner: BarcodeScanner,
              public platform: Platform,
              public nfc: NFC,
              public ndef: Ndef,
              public imageProc: ImageProcessor,
              public fileService: File,
              private camera: Camera) {
    //
  }

  start(element: FormElement) {
    if (element.type == "business_card") {
      this.captureService = new BCRapidCapture(this.imageProc, this.fileService, this.platform, this.camera);
    } else {
      this.captureService = new BadgeRapidCapture(this.barcodeScanner, this.platform, this.nfc, this.ndef);
    }

    return this.captureService.capture(element);
  }
}
