import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SyncClient } from "../../services/sync-client";
import { BussinessClient } from "../../services/business-service";
import { Form, FormSubmission, SubmissionStatus } from "../../model";
import { FormCapture } from "../form-capture";
import { Subscription } from "rxjs";

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
		private syncClient: SyncClient) {

	}

	ionViewWillEnter() {
		this.form = this.navParams.get("form");
		this.isDispatch = this.navParams.get("isDispatch");
		this.loading = true;
		this.doRefresh();
		this.syncing = this.syncClient.isSyncing();

		this.sub = this.syncClient.onSync.subscribe(stats => { },
			(err) => { },
			() => {
				this.syncing = this.syncClient.isSyncing();
				//this.doRefresh();
			});
	}

	ionViewDidLeave() {
		this.sub.unsubscribe();
		this.sub = null;
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
				result = "secondary";
				break;
			case SubmissionStatus.Submitted:
				result = "primary";
				break;
		}
		return result;
	}

	goToEntry(submission) {
		if (submission.status == SubmissionStatus.Submitted) {
			return;
		}
		this.navCtrl.push(FormCapture, { form: this.form, submission: submission });
	}

	doRefresh() {
		this.client.getSubmissions(this.form, this.isDispatch).subscribe(submissions => {
			this.submissions = submissions;
			this.loading = false;
			this.onFilterChanged();
		});
	}

	onFilterChanged() {
		var f = this.filter;
		this.filteredSubmissions = this.submissions.filter((sub)=>{
			return !f || sub.status + "" == f;
		});
		this.hasSubmissionsToSend = this.submissions.filter((sub)=>{return sub.status == SubmissionStatus.ToSubmit}).length > 0;
		
	}

	sync() {
		this.syncing = true;
		this.client.doSync(this.form.form_id)
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