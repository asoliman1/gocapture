import {Ndef, NFC} from "@ionic-native/nfc";

export class GOCNFCScanner implements Scanner {

  readonly name: string = 'nfc';
  statusMessage: string = "Scan NFC";


  constructor(public nfc: NFC,
              public ndef: Ndef) {
    //
  }

  scan(): Promise<ScannerResponse> {

    return new Promise<ScannerResponse>(((resolve, reject) => {

      this.nfc.enabled().then(isAvailable => {
        if (isAvailable) {
          this.statusMessage = "Ready to scan. Hold the device near the badge.";
          this.nfc.addNdefListener(() => {
            console.log('successfully attached ndef listener');
          }, (err) => {
            console.log('Error attaching ndef listener', err);
            reject(err);
          }).subscribe((event) => {
            let payload = event.tag.ndefMessage[0].payload;
            let tagContent = this.nfc.bytesToString(payload).substring(3);

            console.log('Received ndef message. the tag contains: ', tagContent);
            resolve({scannedId: tagContent});
          }, err => {
            this.statusMessage = "Could not scan " + this.name;
            reject(err);
          });
        }
      }, error =>{
        this.statusMessage = "Could not scan " + this.name;
        reject("Nfc is not available");
      });
    }));
  }

  restart() {
    this.statusMessage = "Rescan " + this.name;
  }

}
