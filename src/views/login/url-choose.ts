import { Component } from '@angular/core';
import { LoadingController, ViewController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import { BussinessClient } from "../../services/business-service";
import { User } from "../../model";
import { Main } from "../main";

@Component({
	selector: 'url-choose',
	templateUrl: 'url-choose.html'
})
export class UrlChoose {

	doAuth: boolean = null;
	authCode: string;
	user: User = <any>{};

	isProd: boolean = true;

	constructor(private viewCtrl: ViewController,
				private navParams: NavParams) {
		this.isProd = this.navParams.get("isProd");
	}

	ionViewWillEnter(){
		this.isProd = this.navParams.get("isProd");
	}

	ngOnInit() {
		
	}

	onClick(prod: boolean) {
		this.isProd = prod;
		this.viewCtrl.dismiss({prod: prod});
	}
}
