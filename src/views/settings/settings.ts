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

	constructor(private navCtrl: NavController,
		private navParams: NavParams,
		private db: DBClient,
		private client: BussinessClient,
		private alertCtrl: AlertController,
		private modalCtrl: ModalController,
		private appVersion: AppVersion,
    public app: App) {
		this.appVersion.getVersionNumber().then((version) => {
			this.version = version;
		});
	}

	ionViewWillEnter() {
		this.db.getAllConfig().subscribe(settings => {
			this.settings = settings;
			this.db.getRegistration().subscribe(user => {
				this.user = user;
				this.shouldSave = false;
			});
		});

	}

	getName(user: User){
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

	saveSettings() {
		this.db.saveConfig("autoUpload", this.settings.autoUpload).subscribe(() => {
			this.db.saveConfig("enableLogging", this.settings.enableLogging).subscribe(() => {
				this.db.saveConfig("kioskModePassword", this.settings.kioskModePassword).subscribe(() => {
					this.shouldSave = false;
				});
			});
		});
	}

	sync() {
		this.client.getUpdates().subscribe(()=> {});
	}

	unauthenticate() {
		let confirm = this.alertCtrl.create({
			title: 'Unauthenticate?',
			message: 'Are you sure you want to unauthenticate this device?',
			buttons: [
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
			]
		});
		confirm.present();
	}

}
