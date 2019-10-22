import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { File } from "@ionic-native/file";
import { Login } from '../views/login';
import { Main } from '../views/main';

import { LogClient } from "../services/log-client";
import { RESTClient } from "../services/rest-client";
import { SyncClient } from "../services/sync-client";
import { BussinessClient } from "../services/business-service";
import { Config } from "../config";
import { isProductionEnvironment }  from "./config" ; 
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

declare var cordova;

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
    private sync: SyncClient,
    private file: File,
    public statusBar: StatusBar,
    private popup: Popup,
    private logger: LogClient,
    public themeProvider: ThemeProvider,
    private settingsService: SettingsService,
    private imageLoaderConfig: ImageLoaderConfig,
    private util:Util
  ) {
    this.subscribeThemeChanges();
    this.initializeApp();
  }

  private subscribeThemeChanges() {
    this.themeProvider.getActiveTheme().subscribe(val => {
      this.selectedTheme = val.toString();
      // A.S
      const spinnerColor = this.selectedTheme.replace('-theme','');

      const colorKey = val.split('-');
      const color = Colors[colorKey[0]] || Colors[colorKey[1]] ;

      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString(color);
      }
      // A.S
      this.imageLoaderConfig.setSpinnerColor(spinnerColor);

    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      //check user authentication at the app launch
      this.checkUserAuth();
      //check device status at the app launch
      this.checkDeviceStatus();
      //check app when it resumes and handle functions needed
      this.onAppResumes();

      this.hideSplashScreen();

      if (!window["cordova"]) {
        return;
      }
      this.util.checkFilesDirectories();

    });

    // A.S
    this.handleApiErrors();
    this.handleClientErrors();
    this.handleSyncErrors();
    this.configImageLoader();

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
    if(isProductionEnvironment){
    this.settingsService.getSetting(settingsKeys.ENABLE_LOGGING).subscribe(setting => {
        if (typeof setting == "undefined" || !setting || setting.length == 0) {
          this.logger.enableLogging(false);
        } else {
          this.logger.enableLogging(setting);
        }
    });
  }

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
    this.platform.resume.subscribe(() => {
      // A.S check device status when app resumes
      if(!(this.util.getPluginPrefs() || this.util.getPluginPrefs('rapid-scan'))){
      this.popup.dismissAll();
        this.checkDeviceStatus();
        this.client.getUpdates().subscribe(() => {
          // this.documentsSync.syncAll();
        });
      }
      this.util.rmPluginPrefs()
    });
  }


  private handleApiErrors() {
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
  }

  private handleClientErrors() {
    this.client.error.subscribe((resp) => {
      if(resp) this.popup.showToast(resp);
    });
  }

  private handleSyncErrors() {
    this.sync.error.subscribe((resp) => {
      if(resp) this.popup.showToast(resp);
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

    // console.log('Device status - ' + JSON.stringify(status));

    // this.popup.dismissAll();

    if (status.check_status != "ACTIVE_ACCESS_TOKEN") {

      const buttons = [
        {
          text: 'Unauthenticate',
          handler: () => {
            // A.S
             this.popup.showLoading('');
            this.client.unregister(user).subscribe(() => {
              this.nav.setRoot(Login, { unauthenticated: true });
              this.popup.dismiss('loading');
            }, err => {
              this.popup.dismiss('loading');
            });
          }
        }
      ];


      this.popup.showAlert('Warning', status.message, buttons, this.selectedTheme);
    }
  }
}
