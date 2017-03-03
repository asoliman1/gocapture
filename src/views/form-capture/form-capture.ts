import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, Platform, Navbar } from 'ionic-angular';
import { BussinessClient } from "../../services/business-service";
import { Form, FormSubmission, SubmissionStatus, DeviceFormMembership, DispatchOrder } from "../../model";
import { FormView } from "../../components/form-view";
import { ProspectSearch } from "../prospect-search";

@Component({
	selector: 'form-capture',
	templateUrl: 'form-capture.html'
})
export class FormCapture {

	form: Form;

	submission: FormSubmission;

	dispatch: DispatchOrder;

	@ViewChild("formView") formView: FormView;
	@ViewChild("navbar") navbar: Navbar;

	valid: boolean;

	prospect: DeviceFormMembership;

	private backUnregister;

	constructor(private navCtrl: NavController,
			private navParams: NavParams,
			private client: BussinessClient,
			private zone: NgZone,
			private modal: ModalController,
			private alertCtrl: AlertController,
			private platform: Platform) {
		console.log("FormCapture");
	}

	ionViewWillEnter() {
		this.form = this.navParams.get("form");
		this.submission = this.navParams.get("submission");
		this.dispatch = this.navParams.get("dispatch");
		if (this.dispatch) {
			this.form = this.dispatch.form;
		}
		if (!this.submission) {
			this.submission = new FormSubmission();
			this.submission.form_id = this.dispatch ? this.dispatch.form_id : this.form.form_id;
		} else {
			this.client.getContact(this.form, this.submission.prospect_id).subscribe(contact => {
				this.prospect = contact;
			});
		}
	}

	isReadOnly(submission: FormSubmission) : boolean{
		return submission && submission.status == SubmissionStatus.Submitted;
	}

	ionViewDidEnter(){
		this.backUnregister = this.platform.registerBackButtonAction(()=>{
           this.doBack();
		}, Number.MAX_VALUE);
		this["oldClick"] = this.navbar.backButtonClick;
		this.navbar.backButtonClick = () => {
			this.doBack();
		};
	}

	ionViewWillLeave(){
		if(this.backUnregister){
			this.backUnregister();
		}
		this.navbar.backButtonClick = this["oldClick"];
	}

	doRefresh(refresher) {

	}

	doBack() {
		if (!this.formView.hasChanges()) {
			this.navCtrl.pop();
			return;
		}
		let alert = this.alertCtrl.create({
			title: 'Confirm exit',
			message: 'You have unsaved changes. Are you sure you want to go back?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
						//console.log('Cancel clicked');
					}
				},
				{
					text: 'Go back',
					handler: () => {
						this.navCtrl.pop();
					}
				}
			]
		});
		alert.present();
	}

	doSave() {
		if (!this.valid) {
			return;
		}
		this.submission.fields = this.formView.getValues();
		if (!this.submission.id) {
			this.submission.id = new Date().getTime();
		}
		if (!this.submission.status) {
			this.submission.status = SubmissionStatus.ToSubmit;
		}
		this.client.saveSubmission(this.submission, this.form).subscribe(sub => {
			this.navCtrl.pop();
		}, err => {

		});
	}

	onValidationChange(valid: boolean) {
		this.valid = valid;
	}

	searchProspect() {
		let search = this.modal.create(ProspectSearch, { form: this.form })
		search.onDidDismiss((data: DeviceFormMembership) => {
			if (data) {
				this.prospect = data;
				this.submission.prospect_id = data.prospect_id;
				this.submission.email = data.fields["Email"];
				this.submission.first_name = data.fields["FirstName"];
				this.submission.last_name = data.fields["LastName"];
				let id = null;
				for (let field in data.fields) {
					id = this.form.getIdByUniqueFieldName(field)
					if (id) {
						this.submission.fields[id] = data.fields[field];
					}
				}
			}
		});
		search.present();
	}
}