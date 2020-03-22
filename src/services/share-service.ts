import { Util } from './../util/util';
import { Injectable } from '@angular/core';
import { SocialSharing } from "@ionic-native/social-sharing";
import { Popup } from '../providers/popup/popup';

@Injectable()
export class ShareService {

  constructor(public socialSharing: SocialSharing, private popup: Popup , private util:Util) { 
  }

  public shareViaEmail(
    message: string,
    subject: string,
    to: string[],
    cc?: string[],
    bcc?: string[],
    files?: string | string[]
  ): Promise<boolean> {
    this.util.setPluginPrefs();

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
        this.showErrorToast();
        return false;
      })
  }

  public shareViaSMS(message: string, phoneNumber: string): Promise<boolean> {
    this.util.setPluginPrefs();

    return this.socialSharing.shareViaSMS(message, phoneNumber)
      .then((_) => {
        console.log('SMS SHARED SUCCESSFULLY');
        return true;
      })
      .catch((err) => {
        console.log("SMS COULDN'T BE SENT ", err);
        this.showErrorToast();
        return false;
      });
  }

  // A.S GOC-300
  public share(title = '', message: string): Promise<boolean> {
    this.util.setPluginPrefs();

    return this.socialSharing.share(message, title)
      .then((_) => {
        console.log('Data SHARED SUCCESSFULLY');
        return true;
      })
      .catch((err) => {
        console.log("Data COULDN'T BE SENT ", err);
        this.showErrorToast('A problem occured when trying to share your content');
        return false;
      });
  }
  public shareViaFacebook(message: string, image?: string, url?: string): Promise<boolean> {
    this.util.setPluginPrefs();

    return this.socialSharing.shareViaFacebook(message, image, url)
      .then((_) => {
        console.log('SHARED VIA FACEBOOK SUCCESSFULLY');
        return true;
      })
      .catch((err) => {
        console.log("COULDN'T SHARE VIA FACEBOOK ", JSON.stringify(err));
        this.showErrorToast();
        return false;
      })
  }

  public shareViaInstagram(message: string, image: string): Promise<boolean> {
    this.util.setPluginPrefs();

    return this.socialSharing.shareViaInstagram(message, image)
      .then((_) => {
        console.log('SHARED VIA INSTAGRAM SUCCESSFULLY');
        return true
      })
      .catch((err) => {
        console.log("COULDN'T SHARE VIA INSTAGRAM ", JSON.stringify(err));
        this.showErrorToast();
        return false;
      })
  }


  public shareViaWhatsApp(message: string, image?: string, url?: string): Promise<boolean> {
    this.util.setPluginPrefs();
    return this.socialSharing.shareViaWhatsApp(message, image, url)
      .then((_) => {
        console.log('SHARED VIA WHATSAPP SUCCESSFULLY');
        return true;
      })
      .catch((err) => {
        console.log("COULDN'T SHARE VIA WHATSAPP ", JSON.stringify(err));
        this.showErrorToast();
        return true;
      })
  }

  private showErrorToast(errorMsg = 'documents.share-error') {
    this.popup.showToast({text:errorMsg});
  }
}
