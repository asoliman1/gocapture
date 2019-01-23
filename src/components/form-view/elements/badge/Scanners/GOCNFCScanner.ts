import {Ndef, NFC} from "@ionic-native/nfc";
import {Platform} from "ionic-angular";

export class GOCNFCScanner implements Scanner {

  readonly name: string = 'nfc';
  statusMessage: string = "Scan NFC";


  constructor(public nfc: NFC,
              public ndef: Ndef,
              public platform: Platform) {
    //
  }

  scan(): Promise<ScannerResponse> {
    return new Promise<ScannerResponse>(((resolve, reject) => {
      this.nfc.enabled().then(() => {
        this.readNfc(resolve, reject);
      }, error =>{
        this.statusMessage = "Could not scan " + this.name;
        reject("Nfc is not available");
      });
    }));
  }

  private readNfc(resolve, reject) {
    this.nfc.addNdefListener(() =>{
      if (this.platform.is("ios")) {
        this.nfc.beginSession().subscribe(() => {
          this.statusMessage = "Ready to scan. Hold the device near the badge.";
        });
      } else {
        this.statusMessage = "Ready to scan. Hold the device near the badge.";
      }
    }, error=>{
      reject( "Could not scan " + this.name);
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

  restart() {
    this.statusMessage = "Rescan " + this.name;
  }

}
