import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner";
import { Scanner, ScannerResponse } from "./Scanner";
import { Platform } from "ionic-angular";
import { AppPreferences } from "@ionic-native/app-preferences";
import { RapidCaptureService } from "../../../../../services/rapid-capture-service";

declare var cordova;

export class GOCBarcodeScanner implements Scanner {

  readonly name: string = 'badge';
  statusMessage: string = "badge-scanner.scan";


  constructor(public barcodeScanner: BarcodeScanner,
    public barcodeFormat: string,
    public platform: Platform,
    public appPreferences: AppPreferences,
  ) {
    //
  }

  getSupportedBarcodeFormat() {
    if (this.barcodeFormat) {
      return this.barcodeFormat;
    }
    return 'QR_CODE,DATA_MATRIX,UPC_E,UPC_A,EAN_8,EAN_13,CODE_128,CODE_39,CODE_93,CODABAR,ITF,RSS14,RSS_EXPANDED,PDF_417,AZTEC,MSI';
  }

  async scan(isRapidScan, id): Promise<ScannerResponse> {

    this.statusMessage = "badge-scanner.scanning";

    let formats = this.getSupportedBarcodeFormat();
    console.log('Barcode formats - ' + formats);

    let options: BarcodeScannerOptions = {
      formats: formats,
      showFlipCameraButton:true,
    };

    options["isRapidScanMode"] = isRapidScan;
    options["rapidScanModeDelay"] = 2;
    options["resultDisplayDuration"] = 100;

    return new Promise<ScannerResponse>((resolve, reject) => {
      let self = this;

      cordova.plugins.barcodeScanner.scan(function (scannedData) {
        console.log(scannedData);
        if (scannedData.cancelled) {
          self.statusMessage = "badge-scanner.scan";
          resolve({ isCancelled: true });
          return;
        }

        if (scannedData["barcodes"]) {
          if (scannedData["persist"]) {
            self.appPreferences.store(RapidCaptureService.dictKey(id), id, self.platform.is('ios') ? scannedData["barcodes"] : JSON.parse(scannedData["barcodes"])).then((result) => {
              console.log('badges are saved to the defaults - ' + JSON.stringify(scannedData["barcodes"]));
            }, (error) => {
              console.error("Can't save badges to the defaults - " + error);
            });
          } else {
            let barcodes = [];

            if (self.platform.is('ios')) {
              barcodes = scannedData["barcodes"];
            } else {
              try {
                barcodes = JSON.parse(scannedData["barcodes"]);
              } catch (e) {
                console.error("Can't parse badge data - " + e);
              }
            }
            resolve({ barcodes: barcodes });
          }
          return;
        }
        resolve({ scannedId: scannedData.text });
      }, function (error) {
        console.log(error);
        self.statusMessage = "badge-scanner.couldnt-scan";
        reject(error);
      }, options);
    })
  }

  // A.S GOC-300

  testScanner(): Promise<ScannerResponse> {
    this.statusMessage = "Scanning " + this.name;

    let formats = this.getSupportedBarcodeFormat();
    console.log('Barcode formats - ' + formats);

    let options: BarcodeScannerOptions = {
      formats: formats,
    };

    options["isRapidScanMode"] = false;
    return new Promise<ScannerResponse>((resolve, reject) => {
      cordova.plugins.barcodeScanner.scan(function (scannedData) {

        if (scannedData.cancelled) {
          this.statusMessage = "Scan " + this.name;
          resolve({ isCancelled: true });
          return;
        }

        resolve({ scannedId: scannedData.text });
      }, function (error) {
        this.statusMessage = "badge-scanner.couldnt-scan";
        reject(this.statusMessage);
      }, options);
    })
  }

  restart() {
    this.statusMessage = "badge-scanner.rescan";
  }


}
