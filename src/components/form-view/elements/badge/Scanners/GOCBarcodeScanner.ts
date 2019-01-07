import {BarcodeScanner} from "@ionic-native/barcode-scanner";

export class GOCBarcodeScanner implements Scanner {

  readonly name: string = 'barcode';
  statusMessage: string;

  constructor(public barcodeScanner: BarcodeScanner) {
    //
  }

  scan(): Promise<ScannerResponse> {

    this.statusMessage = "Scanning " + this.name;

    return new Promise<ScannerResponse>((resolve, reject) => {
      this.barcodeScanner.scan().then((scannedData) => {
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
