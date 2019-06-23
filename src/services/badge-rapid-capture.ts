import {Injectable, OnInit} from "@angular/core";
import {FormElement, FormSubmission} from "../model";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {Scanner, ScannerResponse, ScannerType} from "../components/form-view/elements/badge/Scanners/Scanner";
import {GOCNFCScanner} from "../components/form-view/elements/badge/Scanners/GOCNFCScanner";
import {GOCBarcodeScanner} from "../components/form-view/elements/badge/Scanners/GOCBarcodeScanner";
import {Platform} from "ionic-angular";
import {Ndef, NFC} from "@ionic-native/nfc";
import {RapidCapture} from "./rapid-capture-service";

@Injectable()

export class BadgeRapidCapture implements RapidCapture {

  scanner: Scanner;

  constructor(public barcodeScanner: BarcodeScanner,
              public platform: Platform,
              public nfc: NFC,
              public ndef: Ndef) {
    //
  }

  private getScanner(element): Scanner {
    if (element.badge_type == ScannerType.NFC) {
      return new GOCNFCScanner(this.nfc, this.ndef, this.platform);
    }
    return new GOCBarcodeScanner(this.barcodeScanner, element.barcode_type, this.platform);
  }

  capture(element: FormElement) {
    this.scanner = this.getScanner(element);
    return this.scanner.scan(true).then((response) => {
      return response.barcodes;
    })
  }

}
