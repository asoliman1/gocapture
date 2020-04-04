import { Component,ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular/platform/platform';
import { RESTClient } from '../services/rest-client';
import { TranslateConfigService } from '../services/translate/translateConfigService';
import { Popup } from '../providers/popup/popup';
import { ThemeProvider } from '../providers/theme/theme';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  rootPage: any = 'Main';
  selectedTheme : string = this.themeProvider.defaultTheme;

  constructor(
    public platform: Platform,
    private rest: RESTClient,
    private popup : Popup,
    private translateConfigService: TranslateConfigService,
    private themeProvider : ThemeProvider
  ) {
    this.initializeApp();
  }

  private subscribeThemeChanges() {
    this.themeProvider.getActiveTheme().subscribe(val => {
      this.selectedTheme = val.toString();
    });
  }

  private initializeApp() {
    this.setAppLocalization();
    this.handleApiErrors();
    this.subscribeThemeChanges();
    this.platform.ready().then(() => {
      this.hideSplashScreen();
    });
  }

  private setAppLocalization() {
      this.translateConfigService.initTranslate();
  }

  private handleApiErrors() {
    this.rest.error.subscribe((resp) => {
      if(resp) this.popup.showToast({text:resp.message});
      if (resp && resp.status == 401) this.popup.showToast({text:resp.message});
      if (resp && resp.status == 403) this.popup.showToast({text:resp.message});
    });
  }

  hideSplashScreen() {
    if (navigator && navigator["splashscreen"]) navigator["splashscreen"].hide();
  }

}
