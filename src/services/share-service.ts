import { Injectable } from '@angular/core';
import {SocialSharing} from "@ionic-native/social-sharing";

@Injectable()
export class ShareService {

  constructor(public socialSharing: SocialSharing) {}

  public shareViaEmail(
    message: string,
    subject: string,
    to: string[],
    cc?: string[],
    bcc?: string[],
    files?: string | string[]
  ): Promise<boolean> {
    return this.socialSharing.canShareViaEmail()
      .then((_) => {
        return this.socialSharing.shareViaEmail(message, subject, to, cc, bcc, files)
          .then((_) => {
            console.log('EMAIL SHARED SUCCESSFULLY');
            return true
          })
          .catch((err) => {
            console.log('EMAIL FAILED. ', JSON.stringify(err));
            return false;
          })
      })
      .catch((err) => {
        console.log('CANNOT SHARE VIA EMAIL ', JSON.stringify(err));
        return false;
      })
  }

  public shareViaSMS(message: string, phoneNumber: string): Promise<boolean> {
    return this.socialSharing.shareViaSMS(message, phoneNumber)
      .then((_) => {
        console.log('SMS SHARED SUCCESSFULLY');
        return true;
      })
      .catch((err) => {
        console.log("SMS COULDN'T BE SENT ", err);
        return false;
      });
  }

  public shareViaFacebook(message: string, image?: string, url?: string): Promise<boolean> {
    return this.socialSharing.shareViaFacebook(message, image, url)
      .then((_) => {
        console.log('SHARED VIA FACEBOOK SUCCESSFULLY');
        return true
      })
      .catch((err) => {
        console.log("COULDN'T SHARE VIA FACEBOOK ", JSON.stringify(err));
        return false;
      })
  }

  public shareViaInstagram(message: string, image: string): Promise<boolean> {
    return this.socialSharing.shareViaInstagram(message, image)
      .then((_) => {
        console.log('SHARED VIA INSTAGRAM SUCCESSFULLY');
        return true
      })
      .catch((err) => {
        console.log("COULDN'T SHARE VIA INSTAGRAM ", JSON.stringify(err));
        return false;
      })
  }


  public shareViaWhatsApp(message: string, image?: string, url?: string): Promise<boolean> {
    return this.socialSharing.shareViaWhatsApp(message, image, url)
      .then((_) => {
        console.log('SHARED VIA WHATSAPP SUCCESSFULLY');
        return true;
      })
      .catch((err) => {
        console.log("COULDN'T SHARE VIA WHATSAPP ", JSON.stringify(err));
        return true;
      })
  }
}