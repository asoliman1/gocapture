import { Component } from '@angular/core';
import { User } from "../../model";
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { DBClient } from "../../services";
import { AppVersion } from 'ionic-native';
import { Login } from "../login";

@Component({
	selector: 'settings',
	templateUrl: 'settings.html'
})
export class Settings {

	private settings: any = {};
	private user: User = <any>{};
	private shouldSave: boolean = false;
	private version: string;

	constructor(private navCtrl: NavController,
		private navParams: NavParams,
		private db: DBClient,
		private alertCtrl: AlertController) {
		AppVersion.getVersionNumber().then((version) => {
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

	onChange() {
		this.shouldSave = true;
	}

	saveSettings() {
		this.db.saveConfig("autoUpload", this.settings.autoUpload).subscribe(() => {
			this.db.saveConfig("enableLogging", this.settings.enableLogging).subscribe(() => {
				this.shouldSave = false;
			});
		});
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
						this.db.deleteRegistration(this.user.id + "").subscribe(()=>{
							this.user = <any>{};
							setTimeout(()=>{
								this.navCtrl.setRoot(Login);
							}, 300);
						});
					}
				}
			]
		});
		confirm.present();
	}
}
