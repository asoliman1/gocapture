import { TranslateService } from '@ngx-translate/core';
import { ThemeProvider } from './../theme/theme';
import { Injectable, Component } from '@angular/core';
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
  Toast,
  PopoverController,
  Popover
} from 'ionic-angular';
import { AlertInputOptions } from 'ionic-angular/components/alert/alert-options';


@Injectable()
export class Popup {

  private alert: Alert;
  private popover: Popover;
  private loading: Loading;
  private toast: Toast;
  private actionSheet: ActionSheet;
  private theme: string;

  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public actionCtrl: ActionSheetController,
    public popoverCtrl: PopoverController,
    private themeProvider: ThemeProvider,
    private translate: TranslateService,
    public loadingCtrl: LoadingController) {
    //
    this.themeProvider.getActiveTheme().subscribe((data) => {
      this.theme = data.toString();
    })
  }

  // A.S
  showLoading(message: { text: string, params?: any }, theme = this.theme) {
    this.loading = this.loadingCtrl.create({
      content: message.text ? this.translate.instant(message.text, message.params || {}) : '',
      cssClass: theme
    });
    this.loading.present();
    return this.loading;
  }

  showAlert(title: string, message: { text: string, params?: any }, buttons: AlertButton[], theme = this.theme, inputs = []) {
    if (this.alert) {
      this.alert.dismiss();
    }

    this.alert = this.alertCtrl.create({
      title: this.translate.instant(title),
      message: message.text ? this.translate.instant(message.text, message.params || {}) : '',
      buttons: this.translateBtns(buttons),
      inputs: this.translateInputs(inputs),
      enableBackdropDismiss: false,
      cssClass: theme
    });
     this.alert.present();
     return this.alert;
  }

  translateBtns(Btns: any[]) {
    return Btns.map((e) => {
      e.text = e.text ? this.translate.instant(e.text) : '';
      return e;
    })
  }

  // A.S
  showActionSheet(title: string, buttons: ActionSheetButton[], theme = this.theme) {
   this.actionSheet = this.actionCtrl.create({
      title: title ? this.translate.instant(title) : '',
      buttons: this.translateBtns(buttons),
      cssClass: theme
    })
    this.actionSheet.present();
    return this.actionSheet;
  }

  // A.S
  showPopover(page: any, data: any, enableBackdropDismiss = false, theme = this.theme) {
    this.popover = this.popoverCtrl.create(page, data, { cssClass: theme , enableBackdropDismiss });
    this.popover.present();
     return this.popover;
  }

  // A.S
  showToast(message: { text: string, params?: any }, position = "top", theme = "error", duration = 3000) {
    this.toast = this.toastCtrl.create({
      message: this.translate.instant(message.text, message.params || {}),
      duration: duration,
      position: position,
      cssClass: theme,
      showCloseButton: true,
      closeButtonText: 'x'
    });

     this.toast.present();
     return this.toast;
  }

  showPrompt(title: { text: string, params?: any }, message: { text: string, params?: any }, inputs: AlertInputOptions[], buttons: AlertButton[], theme = this.theme) {

    if (this.alert) {
      this.alert.dismiss();
    }

    this.alert = this.alertCtrl.create({
      title: this.translate.instant(title.text, title.params || {}),
      message: message.text ? this.translate.instant(message.text, message.params || {}) : '',
      inputs: this.translateInputs(inputs),
      buttons: this.translateBtns(buttons),
      cssClass: theme
    });
     this.alert.present();
     return this.alert;
  }

  translateInputs(inputs: AlertInputOptions[]) {
    return inputs.map((e) => {
      e.label = e.label ? this.translate.instant(e.label) : '';
      e.placeholder = e.placeholder ? this.translate.instant(e.placeholder) : '';
      return e;
    })
  }

  // A.S
  dismissAll() {
    this.dismiss('alert');
    this.dismiss('loading');
    this.dismiss('toast');
    this.dismiss('actionSheet');
    this.dismiss('popover');
  }

  // A.S
  dismiss(type) {
    if (this[type]) this[type].dismiss();
    this[type] = null;
  }

  // A.S
  setLoadingContent(content: { text: string, params?: any }) {
    this.loading.setContent(content.text ? this.translate.instant(content.text, content.params || {}) : '');
  }
}
