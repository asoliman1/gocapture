import {BarcodeScanner, BarcodeScannerOptions} from "@ionic-native/barcode-scanner";
import { Scanner, ScannerResponse } from "./Scanner";

export class GOCBarcodeScanner implements Scanner {

  readonly name: string = 'barcode';
  statusMessage: string = "Scan barcode";

  constructor(public barcodeScanner: BarcodeScanner) {
    //
  }

  scan(): Promise<ScannerResponse> {

    this.statusMessage = "Scanning " + this.name;

    let options: BarcodeScannerOptions = {
      formats: 'QR_CODE,DATA_MATRIX,UPC_E,UPC_A,EAN_8,EAN_13,CODE_128,CODE_39,CODE_93,CODABAR,ITF,RSS14,RSS_EXPANDED,PDF_417,AZTEC,MSI'
    };

    return new Promise<ScannerResponse>((resolve, reject) => {
      this.barcodeScanner.scan(options).then((scannedData) => {
        if (scannedData.cancelled) {
          this.statusMessage = "Scan " + this.name;
          resolve({isCancelled: true});
          return;
        }

        resolve({scannedId: scannedData.text});

      }, error => {
        this.statusMessage = "Could not scan " + this.name;
        reject(error);
      });
    })
  }

  restart() {
    this.statusMessage = "Rescan " + this.name;
  }


}
