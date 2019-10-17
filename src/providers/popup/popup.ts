import { Injectable } from '@angular/core';
import {
  LoadingController,
  ToastController,
  ActionSheetController,
  AlertController,
  Alert,
  ActionSheetButton,
  Loading,
  ActionSheet,
  AlertButton,
  Toast
} from 'ionic-angular';


@Injectable()
export class Popup {

  private alert: Alert;
  private loading: Loading;
  private toast: Toast;
  private actionSheet: ActionSheet;

  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public actionCtrl: ActionSheetController,
    public loadingCtrl: LoadingController) {
    //
  }

  // A.S
  showLoading(message,theme?) {
    this.loading = this.loadingCtrl.create({ content: message,cssClass:theme });
    return this.loading.present();
  }

  showAlert(title, message, buttons: AlertButton[] | string[], theme?) {
    if (this.alert) {
      this.alert.dismiss();
    }
    this.alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: buttons,
      enableBackdropDismiss: false,
      cssClass: theme 
    });
    return this.alert.present();
  }

  // A.S
  showActionSheet(title, buttons: ActionSheetButton[], theme?) {
    this.actionSheet = this.actionCtrl.create({
      title, buttons, cssClass: theme
    })
    return this.actionSheet.present();
  }

  // A.S
  showToast(message, position = "top", theme = "error", duration = 3000) {
    this.toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position,
      cssClass: theme,
      showCloseButton: true,
      closeButtonText: 'x'
    });

    return this.toast.present();
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
    return this.alert.present();
  }

  // A.S
  dismissAll() {
    this.dismiss('alert');
    this.dismiss('loading');
    this.dismiss('toast');
    this.dismiss('actionSheet');
  }

  // A.S
  dismiss(type) {
    if (this[type]) this[type].dismiss();
    this[type] = null;
  }

  // A.S
  setLoadingContent(content){
    this.loading.setContent(content);
  }
}
