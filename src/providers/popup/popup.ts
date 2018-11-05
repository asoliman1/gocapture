import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Alert } from 'ionic-angular/components/alert/alert';
import {ThemeProvider} from "../theme/theme";


@Injectable()
export class Popup {

  private alert: Alert;

  constructor(public alertCtrl: AlertController) {
    //
  }

  showAlert(title, message, buttons, theme?) {
    if (this.alert) {
      this.alert.dismiss();
    }
    this.alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: buttons,
      enableBackdropDismiss: false,
      cssClass: theme.toString()
    });

    this.alert.present();
  }

  showPrompt(title, message, inputs, buttons, theme?) {

    if (this.alert) {
      this.alert.dismiss();
    }

    this.alert = this.alertCtrl.create({
      title: title,
      message: message,
      inputs: inputs,
      buttons: buttons,
      cssClass: theme
    });
    this.alert.present();
  }

  dismissAll() {
    if (this.alert) {
      this.alert.dismiss();
    }
  }
}
