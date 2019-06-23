import { Injectable } from '@angular/core';
import {Loading, LoadingController} from "ionic-angular";

@Injectable()
export class ProgressHud {

  private loading: Loading;

  //used to monitor progress present/dismiss
  private isLoading = false;

  constructor(public loadingCtrl: LoadingController) {
  }


  async hideLoader() {
    if (this.isLoading && this.loading) {
      await this.loading.dismiss();
      this.loading = null;
      this.isLoading = false;
    }
  }

  async showLoader(content: string, duration: number = 0) {
    this.isLoading = true;
    this.loading = await this.loadingCtrl.create({
      enableBackdropDismiss: false,
      content: content,
      duration: duration
    });
    await this.loading.present();
  }
}
