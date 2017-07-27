import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import { BussinessClient } from "../../services/business-service";
import { User } from "../../model";
import { Main } from "../main";
import { UrlChoose } from "./url-choose";
import { Config } from "../../config";

@Component({
	selector: 'login',
	templateUrl: 'login.html'
})
export class Login {

	doAuth: boolean = null;
	authCode: string;
	user: User = <any>{};

	useProd: boolean = true;

	constructor(private navCtrl: NavController,
		private navParams: NavParams,
		private client: BussinessClient,
		private loading: LoadingController,
		private toast: ToastController,
		private popoverCtrl: PopoverController) {

	}

	ngOnInit() {
		if(this.navParams.data.unauthorized == true){
			this.doAuth = true;
			let toaster = this.toast.create({
				message: "Authorization failed. Please obtain a new Authentication Code",
				duration: 5000,
				position: "top",
				cssClass: "error"
			});
			toaster.present();
			return;
		}
		this.client.getRegistration()
			.subscribe((user) => {
				if (!user) {
					this.doAuth = true;
				} else {
					this.doAuth = false;
					this.user = user;
				}
			});
	}

	onClick() {
		if (this.doAuth) {
			if (!this.authCode) {
				return;
			}
			let loader = this.loading.create({
				content: "Authenticating..."
			});
			loader.present();
			Config["isProd"] = this.useProd;
			this.client.authenticate(this.authCode).subscribe(
				data => {
					loader.setContent(data.message);
				},
				err => {
					loader.dismiss();
					let toaster = this.toast.create({
						message: err,
						duration: 5000,
						position: "top",
						cssClass: "error"
					});
					toaster.present();
				},
				() => {
					loader.dismiss();
					this.navCtrl.setRoot(Main);
				});
		} else {
			this.navCtrl.setRoot(Main);
		}
	}

	presentPopover(event){
		let popover = this.popoverCtrl.create(UrlChoose, {isProd: this.useProd});
		popover.onDidDismiss((data)=> {
			if(data){
				this.useProd = data.prod;
			}
		});
		popover.present({
			ev: event
		});
	}
}
