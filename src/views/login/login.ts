import { Component } from '@angular/core';
import { BussinessClient } from "../../services/business-service";
import { User } from "../../model";
import { Main } from "../main";
import { UrlChoose } from "./url-choose";
import { Config } from "../../config";
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { NavParams } from 'ionic-angular/navigation/nav-params';

@Component({
	selector: 'login',
	templateUrl: 'login.html'
})
export class Login {

	doAuth: boolean = null;
	authCode: string;
	email: string;
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

		if(this.navParams.get("unauthenticated") == true) {
			this.doAuth = true;
			return;
		}

		if(this.navParams.get('unauthorized') == true) {
			this.doAuth = true;

			let errorMessage = this.navParams.get('errorMessage');
			if (!errorMessage) {
			  errorMessage = "Authorization failed. Please obtain a new Authentication Code";
      }

			let toaster = this.toast.create({
				message: errorMessage,
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
			if (!this.authCode || !this.email) {
				return;
			}
			let loader = this.loading.create({
				content: "Authenticating..."
			});
			loader.present();
			Config.isProd = this.useProd;
			this.client.authenticate(this.email, this.authCode).subscribe(
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
