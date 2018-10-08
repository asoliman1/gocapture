import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { File } from "@ionic-native/file";

import { Login } from '../views/login';
import { Main } from '../views/main';

import { DBClient } from "../services/db-client";
import { LogClient } from "../services/log-client";
import { RESTClient } from "../services/rest-client";
import { SyncClient } from "../services/sync-client";
import { BussinessClient } from "../services/business-service";
import { Config } from "../config";
import {StatusBar} from "@ionic-native/status-bar";
import {Popup} from "../providers/popup/popup";
import { Platform } from 'ionic-angular/platform/platform';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Nav } from 'ionic-angular/components/nav/nav';
import {ThemeProvider} from "../providers/theme/theme";

declare var cordova;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any;
  selectedTheme: String;

  @ViewChild(Nav) nav: Nav;

  constructor(
    public platform: Platform,
    private db: DBClient,
    private rest: RESTClient,
    private client: BussinessClient,
    private sync: SyncClient,
    private logClient: LogClient,
    private file: File,
    private toast: ToastController,
    public statusBar: StatusBar,
    private popup: Popup,
    private loading: LoadingController,
    private logger: LogClient,
    public themeProvider: ThemeProvider) {
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log("ready!");

      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString('#c26100');
      }

      this.client.getRegistration(true).subscribe((user) => {
        if(user) {

          this.client.getSetting("enableLogging").subscribe(setting => {
            if (typeof setting == "undefined" || setting.length == 0) {
              this.logger.enableLogging(true);
            } else {
              this.logger.enableLogging(setting);
            }
          });

          Config.isProd = user.is_production == 1;
          this.nav.setRoot(Main);
        } else {
          this.nav.setRoot(Login);
        }
      });

      let checkDeviceStatus = () => {
        if (this.platform.is('cordova')) {
          this.client.getRegistration(true).subscribe((user) => {
            if(user) {
              this.client.getDeviceStatus(user).subscribe((status) => {
                this.handleAccessTokenValidationResult(status, user);
              });
            }
          });
        }
      };

      //check device status at the app launch
      checkDeviceStatus();

      this.platform.resume.subscribe(() => {

        //check device status when app resumes
        checkDeviceStatus();

        this.client.getUpdates().subscribe(()=> {});
      });

      this.hideSplashScreen();
      //StatusBar.hide();
      if(!window["cordova"]){
        return;
      }
      //ensure folders exist
      this.file.checkDir(cordova.file.dataDirectory, "leadliaison")
        .then((exists)=>{
          this.file.checkDir(cordova.file.dataDirectory + "leadliaison/", "images")
            .then((exists)=>{
              console.log("Images folder present");
            }).catch(err=>{
            this.file.createDir(cordova.file.dataDirectory + "leadliaison/", "images", true)
              .then(ok => {
                console.log("Created images folder");
              }).catch(err => {
              console.error("Can't create " + cordova.file.dataDirectory + "leadliaison" + ":\n" + JSON.stringify(err, null, 2));
            })
          });
        }).catch(err=>{
        this.file.createDir(cordova.file.dataDirectory, "leadliaison", true)
          .then(ok => {
            this.file.createDir(cordova.file.dataDirectory + "leadliaison/", "images", true)
              .then(ok => {
                console.log("Created images folder");
              }).catch(err => {
              console.error("Can't create " + cordova.file.dataDirectory + "leadliaison" + ":\n" + JSON.stringify(err, null, 2));
            })
          }).catch(err => {
          console.error("Can't create " + cordova.file.dataDirectory + "leadliaison" + ":\n" + JSON.stringify(err, null, 2));
        })
      });
    });

    let unregisterUserWithCallback = (callback) => {
      this.client.getRegistration(true).subscribe((user) => {
        if(user) {
          this.client.unregister(user).subscribe(() => {
            callback();
          });
        }
      });
    };

    this.rest.error.subscribe((resp)=>{

      //token is invalid => unregister current user;
      if(resp && resp.status == 401) {
        unregisterUserWithCallback(() => {
          this.nav.setRoot(Login, {
            unauthorized: true
          });
        })
      }

      if(resp && resp.status == 403) {
        this.nav.setRoot(Login, {
          unauthorized: true,
          errorMessage: resp.message
        })
      }
    });

    this.client.error.subscribe((resp)=>{
      let toaster = this.toast.create({
        message: resp,
        duration: 5000,
        position: "top",
        cssClass: "error"
      });
      toaster.present();
    });

    this.sync.error.subscribe((resp)=>{
      let toaster = this.toast.create({
        message: resp,
        duration: 5000,
        position: "top",
        cssClass: "error"
      });
      toaster.present();
    });
  }


  hideSplashScreen() {
    if (navigator && navigator["splashscreen"]) {
      setTimeout(() => {
        navigator["splashscreen"].hide();
      }, 200);
    }
  }

  handleAccessTokenValidationResult(status, user) {

    console.log('Device status - ' + JSON.stringify(status));

    this.popup.dismissAll();

    if (status.check_status != "ACTIVE_ACCESS_TOKEN") {

      const buttons = [
        {
          text: 'Unauthenticate',
          handler: () => {
            let loader = this.loading.create();
            loader.present();
            this.client.unregister(user).subscribe(() => {
              this.nav.setRoot(Login, {unauthenticated: true});
              loader.dismiss();
            }, err => {
              loader.dismiss();
            });
          }
        }
      ];

      this.popup.showAlert('Warning', status.message, buttons);
    }
  }
}
