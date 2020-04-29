import { Component } from '@angular/core';
import { BussinessClient } from "../../services/business-service";
import { User } from "../../model";
import { Main } from "../main";
import { UrlChoose } from "./url-choose";
import { Config } from "../../config";
import {
	App,
	PopoverController,
	NavController,
	NavParams
} from "ionic-angular";
import { Popup } from '../../providers/popup/popup';
import {ThemeProvider} from "../../providers/theme/theme";

@Component({
	selector: 'login',
	templateUrl: 'login.html'
})
export class Login {

	doAuth: boolean = null;
	authCode: string;
	email: string;
	user: User = <any>{};
	codeInputType = 'password';
	useProd: boolean = true;

	constructor(private navCtrl: NavController,
		private navParams: NavParams,
		private client: BussinessClient,
		private popup: Popup,
		private popoverCtrl: PopoverController,
		public app: App,
    private themeProvider: ThemeProvider) {
	}

	ngOnInit() {

		if (this.navParams.get("unauthenticated") == true) {
			this.doAuth = true;
			return;
		}

		if (this.navParams.get('unauthorized') == true) {
			this.doAuth = true;

			let errorMessage = this.navParams.get('errorMessage');
			if (!errorMessage) {
				errorMessage = "toast.auth-failed";
			}
			this.popup.showToast({ text: errorMessage });
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

	changeInputType() {
		if (this.codeInputType == 'password') this.codeInputType = 'text';
		else this.codeInputType = 'password';
	}

	onClick() {
		if (this.doAuth) {
			if (!this.authCode || !this.email) {
				return;
			}
			this.popup.showLoading({ text: 'alerts.loading.authenticating' });
			Config.isProd = this.useProd;
			this.client.authenticate(this.email, this.authCode)
				.subscribe(data => {
					this.popup.setLoadingContent({ text: data.message });
					// this.themeProvider.setActiveTheme()
				}, err => {
					this.popup.dismiss('loading');
					this.popup.showToast({ text: err });
				}, () => {
					this.popup.dismiss('loading');
					this.navCtrl.setRoot(Main);
				});
		} else {
			this.navCtrl.setRoot(Main);
		}
	}

	presentPopover(event) {
		let popover = this.popoverCtrl.create(UrlChoose, { isProd: this.useProd }, {cssClass: 'default-theme'});
		popover.onDidDismiss((data) => {
			if (data) {
				this.useProd = data.prod;
			}
		});
		popover.present({
			ev: event
		});
	}
}
