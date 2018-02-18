import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { SyncClient } from "../../services/sync-client";
import { BussinessClient } from "../../services/business-service";
import { Form, FormSubmission, SubmissionStatus, FormElementType } from "../../model";
import { FormCapture } from "../form-capture";
import { Subscription } from "rxjs/Subscription";

@Component({
	selector: 'form-review',
	templateUrl: 'form-review.html'
})
export class FormReview {

	form: Form = new Form();

	filter: string = "";

	submissions: FormSubmission[] = [];

	loading: boolean = true;

	syncing: boolean = false;

	private sub: Subscription;

	private isDispatch;

	filteredSubmissions: FormSubmission[] = [];

	hasSubmissionsToSend: boolean = false;

	constructor(private navCtrl: NavController,
		private navParams: NavParams,
		private client: BussinessClient,
		private zone: NgZone,
		private syncClient: SyncClient,
		private toast: ToastController) {

	}

	ionViewDidEnter() {
		this.form = this.navParams.get("form");
		this.isDispatch = this.navParams.get("isDispatch");
		this.loading = true;
		this.doRefresh();
		this.syncing = this.syncClient.isSyncing();

		this.sub = this.syncClient.onSync.subscribe(stats => { },
			(err) => { },
			() => {
				this.syncing = this.syncClient.isSyncing();
				this.doRefresh();
			});
	}

	ionViewDidLeave() {
		this.sub.unsubscribe();
		this.sub = null;
	}

	getIcon(sub: FormSubmission){
		let result = "checkmark-circle";
		switch (sub.status) {
			case SubmissionStatus.ToSubmit:
				result = sub.invalid_fields == 1 ? "warning": "checkmark-circle";
				break;
		}
		return result;
	}

	getColor(submission: FormSubmission) {
		let result = "";
		switch (submission.status) {
			case SubmissionStatus.OnHold:
				result = "orange";
				break;
			case SubmissionStatus.Blocked:
				result = "danger";
				break;
			case SubmissionStatus.ToSubmit:
				result = submission.invalid_fields == 1 ? "danger": "primary";
				break;
			case SubmissionStatus.Submitted:
				result = "secondary";
				break;
			case SubmissionStatus.InvalidFields:
				result = "danger";
				break;
		}
		return result;
	}

	goToEntry(submission) {
		this.navCtrl.push(FormCapture, { form: this.form, submission: submission });
	}

	hasOnlyBusinessCard(submission: FormSubmission){
		let id = this.form.getIdByFieldType(FormElementType.business_card);
		let emailId = this.form.getIdByFieldType(FormElementType.email);
		let nameId = this.form.getIdByFieldType(FormElementType.simple_name);
		let email = emailId ? submission.fields[emailId] : "";
		let name = nameId && submission.fields[nameId] ? submission.fields[nameId][nameId + "_1"] || submission.fields[nameId][nameId + "_2"] : "";
		return !email && !name && submission.fields[id];
	}

	getBusinessCard(submission: FormSubmission){
		let id = this.form.getIdByFieldType(FormElementType.business_card);
		return submission.fields[id] ? submission.fields[id]["front"] + "?" + new Date().getTime() : "" ;
	}

	doRefresh() {
		this.client.getSubmissions(this.form, this.isDispatch).subscribe(submissions => {
			this.submissions = submissions;
			this.loading = false;
			this.onFilterChanged();
		});
	}

	onFilterChanged() {
		this.zone.run(() => {
			var f = this.filter;
			this.filteredSubmissions = this.submissions.filter((sub)=>{
				sub["hasOnlyBusinessCard"] = this.hasOnlyBusinessCard(sub);
				return !f || sub.status + "" == f + "";
			}).reverse();
			this.hasSubmissionsToSend = this.submissions.filter((sub)=>{return sub.status == SubmissionStatus.ToSubmit}).length > 0;
		});		
	}

	sync() {
		this.syncing = true;
		this.client.doSync(this.form.form_id).subscribe((data)=>{
			this.zone.run(() => {
				this.syncing = false;
				this.doRefresh();
			});
		}, (err) => {
			this.zone.run(() => {
				this.syncing = false;
				this.doRefresh();
				let toaster = this.toast.create({
					message: "There was an error sync-ing the submissions",
					duration: 5000,
					position: "top",
					cssClass: "error"
				});
				toaster.present();
			});
		});
	}

	statusClick(event: Event, submission: FormSubmission) {
		event.stopImmediatePropagation();
		event.stopPropagation();
		event.preventDefault();
		var initialState = null;
		if(submission.status == SubmissionStatus.ToSubmit){
			initialState = submission.status;
			submission.status = SubmissionStatus.Blocked;
		}else if(submission.status == SubmissionStatus.Blocked){
			initialState = submission.status;
			submission.status = SubmissionStatus.ToSubmit;
		}
		if(initialState){
			this.client.saveSubmission(submission, this.form).subscribe(()=>{
				this.onFilterChanged();
			}, (err)=>{
				submission.status = initialState;
			});
		}

		return false;
	}
}