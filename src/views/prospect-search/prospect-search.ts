import { Component, NgZone } from '@angular/core';
import { DeviceFormMembership, Form } from "../../model";
import { BussinessClient } from "../../services/business-service";
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { NavParams } from 'ionic-angular/navigation/nav-params';

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

	contacts: DeviceFormMembership[] = [];

	filteredContacts: DeviceFormMembership[] = [];

	constructor(private navCtrl: NavController,
		private viewCtrl: ViewController,
		private navParams: NavParams,
		private client: BussinessClient,
		private zone: NgZone) {

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
		this.form = this.navParams.get("form");
		this.loading = true;
		this.client.getContacts(this.form).subscribe(contacts => {
			this.zone.run(()=>{
				this.loading = false;
				this.contacts = contacts;
				ProspectSearch.list = contacts;
				ProspectSearch.formId = this.form.form_id+"";
				this.onInput({target: {value: ""}})
			});
		});
	}

	onInput(event){
		let val = event.target.value;
		let regexp = new RegExp(val, "i");
		this.filteredContacts = this.contacts.filter(contact => {			
			return !val || regexp.test(contact["search"]);
		});
	}
}