import { Injectable } from "@angular/core";
import { FormElement, FormSubmissionType } from "../model";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { Scanner, ScannerResponse, ScannerType } from "../components/form-view/elements/badge/Scanners/Scanner";
import { GOCNFCScanner } from "../components/form-view/elements/badge/Scanners/GOCNFCScanner";
import { GOCBarcodeScanner } from "../components/form-view/elements/badge/Scanners/GOCBarcodeScanner";
import { Platform } from "ionic-angular";
import { Ndef, NFC } from "@ionic-native/nfc";
import { RapidCapture } from "./rapid-capture-service";
import { AppPreferences } from "@ionic-native/app-preferences";
import { Popup } from "../providers/popup/popup";
import { ShareService } from "./share-service";
import { Util } from "../util/util";

@Injectable()

export class BadgeRapidCapture implements RapidCapture {

  scanner: Scanner;
  type: FormSubmissionType;

  constructor(public barcodeScanner: BarcodeScanner,
    public platform: Platform,
    public nfc: NFC,
    public ndef: Ndef,
    public appPreferences: AppPreferences,
    public popup: Popup,
    public share: ShareService,
    public util:Util
  ) {
  this.type = FormSubmissionType.barcode;
  }

  private getScanner(element): Scanner {
    this.util.setPluginPrefs();
    if (element.badge_type == ScannerType.Nfc) {
      return new GOCNFCScanner(this.nfc, this.ndef, this.platform);
    }
    return new GOCBarcodeScanner(this.barcodeScanner, element.barcode_type, this.platform, this.appPreferences);
  }

  capture(element: FormElement, id: string) {
    this.util.setPluginPrefs();
    this.scanner = this.getScanner(element);
    return this.scanner.scan(true, id).then((response) => {
      return response.barcodes;
    })
  }

  // A.S GOC-300
  testCapture(type: ScannerType) {
    this.util.setPluginPrefs()
    let scanner = this.getScanner({ badge_type: type });
    scanner.testScanner().then((scannedId: ScannerResponse) => {
      if (!scannedId.isCancelled) {
        this.popup.showAlert(`Badge ID`, scannedId.scannedId, [
          {
            text: 'Share', handler: () => {
              this.share.share(`Badge ID`, scannedId.scannedId)
            }
          }
          , { text: 'Done', role: 'cancel',  }
        ])
      }
    }).catch((err) => {
      this.popup.showAlert(`${type == ScannerType.Barcode ? 'Barcode' : 'NFC'} Error`, err, [
        { text: 'Ok', role: 'cancel' }
      ])
    })
  }
}

