import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Login } from '../views/login';
import { Main } from '../views/main';

import { LogClient } from "../services/log-client";
// import { RESTClient } from "../services/rest-client";
import { SyncClient } from "../services/sync-client";
import { BussinessClient } from "../services/business-service";
import { Config } from "../config";
import { StatusBar } from "@ionic-native/status-bar";
import { Popup } from "../providers/popup/popup";
import { Platform } from 'ionic-angular/platform/platform';
import { Nav } from 'ionic-angular/components/nav/nav';
import { ThemeProvider } from "../providers/theme/theme";
import { Colors } from "../constants/colors";
import { settingsKeys } from "../constants/constants";
import { SettingsService } from "../services/settings-service";
import { Observable } from "rxjs";
import { ImageLoaderConfig } from 'ionic-image-loader';
import { Util } from '../util/util';
import { Intercom } from '@ionic-native/intercom';
import { TranslateConfigService } from '../services/translate/translateConfigService';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  rootPage: any;
  selectedTheme: string;

  @ViewChild(Nav) nav: Nav;

  constructor(
    public platform: Platform,
    // private rest: RESTClient,
    private client: BussinessClient,
    private sync: SyncClient,
    public statusBar: StatusBar,
    private popup: Popup,
    private logger: LogClient,
    public themeProvider: ThemeProvider,
    private settingsService: SettingsService,
    private imageLoaderConfig: ImageLoaderConfig,
    private util: Util,
    private intercom: Intercom,
    private translateConfigService: TranslateConfigService,
  ) {
    this.subscribeThemeChanges();
    this.initializeApp();
  }

  private subscribeThemeChanges() {
    this.themeProvider.getActiveTheme().subscribe(val => {
      this.selectedTheme = val.toString();
      // A.S
      const spinnerColor = this.selectedTheme.replace('-theme', '');

      const colorKey = val.split('-');
      const color = Colors[colorKey[0]] || Colors[colorKey[1]];

      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString(color);
      }
      // A.S
      this.imageLoaderConfig.setSpinnerColor(spinnerColor);

    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.checkUserAuth();
      this.handleApiErrors();
      this.handleClientErrors();
      this.handleSyncErrors();
      this.configImageLoader();
      this.checkDeviceStatus();
      this.onAppResumes();
      this.onAppPause();
      this.hideSplashScreen();
      this.util.checkFilesDirectories();
      this.setAppLocalization();
      this.intercom.setLauncherVisibility('GONE');
    });
  }

  private setAppLocalization() {
    
    this.client.getRegistration(true).subscribe((user) => {
      if (user && user.localization) {
        this.translateConfigService.setLanguage(user.localization);
      } else {
        this.translateConfigService.initTranslate();
      }
    });
  }

  private checkUserAuth() {
    this.client.getRegistration(true).subscribe((user) => {
      if (user) {
        this.setLogging();
        this.setAutoSave();
        Config.isProd = user.is_production == 1;
        this.nav.setRoot(Main);
      } else {
        this.nav.setRoot(Login);
      }
    });
  }

  private setAutoSave() {
    this.settingsService.getSetting(settingsKeys.AUTOSAVE_BC_CAPTURES)
      .flatMap(setting => {
        if (typeof setting == 'undefined' || !setting || setting.length == 0) {
          return this.settingsService.setSetting(settingsKeys.AUTOSAVE_BC_CAPTURES, true);
        }
        return Observable.of((setting == 'true'));
      }).subscribe();
  }

  private setLogging() {
    this.settingsService.getSetting(settingsKeys.ENABLE_LOGGING).subscribe(setting => {
      if (typeof setting == "undefined" || !setting || setting.length == 0) {
        this.logger.enableLogging(true);
      } else {
        this.logger.enableLogging(setting);
      }
    });

  }


  private checkDeviceStatus() {
    if (this.platform.is('cordova')) {
      this.client.getRegistration(true).subscribe((user) => {
        if (user) {
          this.client.getDeviceStatus(user).subscribe((status) => {
            this.handleAccessTokenValidationResult(status, user);
          });
        }
      });
    }
  }

  private onAppResumes() {
    this.platform.resume.subscribe(async () => {
      if (!this.util.getPluginPrefs() && !this.util.getPluginPrefs('rapid-scan')) {
        this.popup.dismissAll();
        if (await this.client.getAppCloseTimeFrom() > 60) {
          this.checkDeviceStatus();
          this.client.getUpdates().subscribe(() => { }, (err) => { }, () => { });
        }
      }
      this.util.rmPluginPrefs()
    });
  }

  onAppPause() {
    this.platform.pause.subscribe(() => {
      console.log('App Paused');
      this.client.setAppCloseTime();
    });
  }


  private handleApiErrors() {
    /*
    this.rest.error.subscribe((resp) => {
      //token is invalid => unregister current user;
      if (resp && resp.status == 401) {
        this.client.getRegistration(true).subscribe((user) => {
          if (user) {
            this.client.unregister(user).subscribe(() => {
              this.nav.setRoot(Login, {
                unauthorized: true
              });
            });
          }
        });
      }

      if (resp && resp.status == 403) {
        this.nav.setRoot(Login, {
          unauthorized: true,
          errorMessage: resp.message
        })
      }
    });
     */
  }

  private handleClientErrors() {
    this.client.error.subscribe((resp) => {
      if (resp) this.popup.showToast(resp);
    });
  }

  private handleSyncErrors() {
    this.sync.error.subscribe((resp) => {
      if (resp) this.popup.showToast(resp);
    });
  }

  private configImageLoader() {
    this.imageLoaderConfig.enableDebugMode();
    this.imageLoaderConfig.enableSpinner(true);
    this.imageLoaderConfig.enableFallbackAsPlaceholder(false);
    this.imageLoaderConfig.setConcurrency(5);
    this.imageLoaderConfig.setMaximumCacheSize(30 * 1024 * 1024); // set max size to 30MB
    this.imageLoaderConfig.setMaximumCacheAge(7 * 24 * 60 * 60 * 1000); // 7 days
    // this.imageLoaderConfig.setFallbackUrl('assets/images/image-placeholder.jpg');

  }




  hideSplashScreen() {
    if (navigator && navigator["splashscreen"]) {
      setTimeout(() => {
        navigator["splashscreen"].hide();
      }, 200);
    }
  }

  handleAccessTokenValidationResult(status, user) {

    if (status.check_status != "ACTIVE_ACCESS_TOKEN") {

      const buttons = [
        {
          text: 'general.unauthenticate',
          handler: () => {
            // A.S
            this.popup.showLoading({text:''});
            this.client.unregister(user).subscribe(() => {
              this.nav.setRoot(Login, { unauthenticated: true });
              this.popup.dismiss('loading');
            }, err => {
              this.popup.dismiss('loading');
            });
          }
        }
      ];


      this.popup.showAlert('alerts.warning', {text:status.message}, buttons, this.selectedTheme);
    } else {

    }
  }
}
