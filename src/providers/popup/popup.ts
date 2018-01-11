import { Injectable } from '@angular/core';
import {AlertController} from "ionic-angular";


@Injectable()
export class Popup {

  constructor(public alertCtrl: AlertController) {
    //
  }

  showAlert(title, message, buttons) {
    this.alertCtrl.create({
      title: title,
      message: message,
      buttons: buttons,
      enableBackdropDismiss: false
    }).present();
  }

  showPrompt(title, message, inputs, buttons) {
    this.alertCtrl.create({
      title: title,
      message: message,
      inputs: inputs,
      buttons: buttons,
    }).present();
  }

}
