import { Component,ViewChild } from '@angular/core';
import { BussinessClient } from "../services/business-service";
import { Platform } from 'ionic-angular/platform/platform';
import { Nav } from 'ionic-angular/components/nav/nav';
import { ThemeProvider } from "../providers/theme/theme";
import { RESTClient } from '../services/rest-client';
import { TranslateConfigService } from '../services/translate/translateConfigService';
import { Popup } from '../providers/popup/popup';
import { Main } from './../views/main/main';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  rootPage: any;
  selectedTheme: string;

  @ViewChild(Nav) nav: Nav;

  constructor(
    public platform: Platform,
    private rest: RESTClient,
    private client: BussinessClient,
    public themeProvider: ThemeProvider,
    private popup : Popup,
    private translateConfigService: TranslateConfigService,
  ) {
    this.initializeApp();
  }

  private subscribeThemeChanges() {
    this.themeProvider.getActiveTheme().subscribe(val => {
      this.selectedTheme = val.toString();
    });
  }

  initializeApp() {
    this.checkUserAuth();
    this.handleApiErrors();
    this.subscribeThemeChanges();
    this.platform.ready().then(() => {
      this.hideSplashScreen();
    });
  }

  private setAppLocalization(user) {
      if (user && user.localization) {
        this.translateConfigService.setLanguage(user.localization);
      } else {
        this.translateConfigService.initTranslate();
      }
  }

  private checkUserAuth() {
    this.client.getRegistration(true).subscribe((user) => {
      if (user) {
        this.setTheme(user);
        this.setAppLocalization(user);
        this.nav.setRoot('FormCapture',);
      } else {
        this.nav.setRoot(Main);
      }
    });
  }

  setTheme(user){
		let theme = user ? user.theme : 'default';
		this.themeProvider.setActiveTheme(theme + '-theme'); // 
	}

  private handleApiErrors() {
    
    this.rest.error.subscribe((resp) => {
      // token is invalid => unregister current user;
      if(resp) this.popup.showToast({text:resp.message});
      if (resp && resp.status == 401) {
        this.client.getRegistration(true).subscribe((user) => {
          if (user) {
            this.client.unregister(user).subscribe(() => {
              // message to logout
            });
          }
        });
      }

      if (resp && resp.status == 403) {
          // message to logout
      }
    });
     
  }

  hideSplashScreen() {
    if (navigator && navigator["splashscreen"]) {
      setTimeout(() => {
        navigator["splashscreen"].hide();
      }, 200);
    }
  }

}
