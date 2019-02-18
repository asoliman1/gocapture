import {Component, NgZone} from '@angular/core';
import { User } from "../../model";
import { DBClient } from "../../services/db-client";
import { BussinessClient } from "../../services/business-service";
import { AppVersion } from '@ionic-native/app-version';
import { Login } from "../login";
import { OcrSelector } from "../../components/ocr-selector";
import { LogView } from "../log";
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import {App} from "ionic-angular";
import {LogClient} from "../../services/log-client";
import {Popup} from "../../providers/popup/popup";
import {ThemeProvider} from "../../providers/theme/theme";
import {Observable} from "rxjs";
import {settingsKeys} from "../../constants/constants";
//import { OcrSelector } from "../../components/ocr-selector";
declare var screen;

@Component({
	selector: 'settings',
	templateUrl: 'settings.html'
})

export class Settings {

	settings: any = {};
	user: User = <any>{};
	shouldSave: boolean = false;
	version: string;
  private selectedTheme;

	constructor(private navCtrl: NavController,
		private navParams: NavParams,
		private db: DBClient,
		private client: BussinessClient,
		private alertCtrl: AlertController,
		private modalCtrl: ModalController,
		private appVersion: AppVersion,
    public app: App,
    private logger: LogClient,
    private popup: Popup,
    private themeProvider: ThemeProvider) {
		this.appVersion.getVersionNumber().then((version) => {
			this.version = version;
		});
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
	}

	ionViewWillEnter() {
		this.db.getAllConfig().subscribe(settings => {
			this.settings = settings;

      if (typeof settings[settingsKeys.ENABLE_LOGGING] == "undefined") {
        this.settings.enableLogging = true;
      }

      if (typeof settings[settingsKeys.AUTOSAVE_BC_CAPTURES] == "undefined") {
        this.settings.autosaveBCCaptures = true;
      }

			this.db.getRegistration().subscribe(user => {
				this.user = user;
				this.shouldSave = false;
			});
		});
	}

	getName(user: User) {
		let name = "";
		if(user){
			if(user.first_name){
				name += user.first_name;
			}
			if(user.last_name){
				if(name.length > 0){
					name += " ";
				}
				name += user.last_name;
			}
		}
		return name;
	}

	showLogs(){
		let modal = this.modalCtrl.create(LogView);
		modal.present();
	}

	onChange() {
		this.shouldSave = true;
		setTimeout(()=>{
			this.saveSettings();
		},1)
	}

  onChangeEnableLogging() {
	  this.logger.enableLogging(this.settings.enableLogging);
	  this.onChange();
  }

	saveSettings() {

	  let autoUpload = this.db.saveConfig(settingsKeys.AUTO_UPLOAD, this.settings.autoUpload);
    let enableLogging = this.db.saveConfig(settingsKeys.ENABLE_LOGGING, this.settings.enableLogging);
    let kioskModePassword = this.db.saveConfig(settingsKeys.KIOSK_MODE_PASSWORD, this.settings.kioskModePassword);
    let autosaveBCCaptures = this.db.saveConfig(settingsKeys.AUTOSAVE_BC_CAPTURES, this.settings.autosaveBCCaptures);

    Observable.zip(autoUpload, enableLogging, kioskModePassword, autosaveBCCaptures).subscribe(() => {
      this.shouldSave = false;
    });

	}

	sync() {
		this.client.getUpdates().subscribe(()=> {});
	}

	unauthenticate() {
		const buttons = [
      {
        text: 'Cancel',
        handler: () => {
        }
      },
      {
        text: 'Unauthenticate',
        handler: () => {
          this.client.unregister(this.user).subscribe(()=>{
            //this.user = <any>{};
            setTimeout(()=>{
              this.app.getRootNav().setRoot(Login, {unauthenticated: true});
            }, 300);
          });
        }
      }
    ];
    this.popup.showAlert("Unauthenticate?", "Are you sure you want to unauthenticate this device?", buttons, this.selectedTheme);
	}

}
