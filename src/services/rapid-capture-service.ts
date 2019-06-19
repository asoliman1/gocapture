import {FormElement} from "../model";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {Platform} from "ionic-angular";
import {Ndef, NFC} from "@ionic-native/nfc";
import {BadgeRapidCapture} from "./badge-rapid-capture";
import {BCRapidCapture} from "./bc-rapid-capture";
import {Injectable} from "@angular/core";

export interface RapidCapture {
  capture(element: FormElement): Promise<string[]>;
}

@Injectable()

export class RapidCaptureService {

  captureService : RapidCapture;

  constructor(public barcodeScanner: BarcodeScanner,
              public platform: Platform,
              public nfc: NFC,
              public ndef: Ndef) {
    //
  }

  start(element: FormElement) {
    if (element.badge_type == "business_card") {
      this.captureService = new BCRapidCapture();
    } else {
      this.captureService = new BadgeRapidCapture(this.barcodeScanner, this.platform, this.nfc, this.ndef);
    }

    return this.captureService.capture(element);
  }
}
