import { Component } from '@angular/core';
import { DeviceFormMembership, Form } from "../../model";
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { BussinessClient } from "../../services/business-service";

@Component({
	selector: 'prospect-search',
	templateUrl: 'prospect-search.html'
})
export class ProspectSearch {
	static list = [];
	static formId = "";

	selectedContact: DeviceFormMembership = null;
	loading = true;

	form: Form;

	searchFilter: string = "";

	contacts: DeviceFormMembership[];

	constructor(private navCtrl: NavController,
		private viewCtrl: ViewController,
		private navParams: NavParams,
		private client: BussinessClient) {

	}

	cancel() {
		this.viewCtrl.dismiss(null);
	}

	done() {
		if(this.selectedContact){
			this.viewCtrl.dismiss(this.selectedContact);
		}
	}

	ionViewDidEnter() {
		this.form = this.navParams.data["form"];
		this.loading = true;
		this.client.getContacts(this.form).subscribe(contacts => {
			this.loading = false;
			this.contacts = contacts;
			ProspectSearch.list = contacts;
			ProspectSearch.formId = this.form.id;
		});
	}
}