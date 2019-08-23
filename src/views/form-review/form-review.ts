import {Component, NgZone, ViewChild} from '@angular/core';
import {SyncClient} from "../../services/sync-client";
import {BussinessClient} from "../../services/business-service";
import {BarcodeStatus, Form, FormElementType, FormSubmission, SubmissionStatus} from "../../model";
import {FormCapture} from "../form-capture";
import {Subscription} from "rxjs/Subscription";
import {NavController} from 'ionic-angular/navigation/nav-controller';
import {NavParams} from 'ionic-angular/navigation/nav-params';
import {ToastController} from 'ionic-angular/components/toast/toast-controller';
import {Util} from "../../util/util";
import {Content} from "ionic-angular";


@Component({
	selector: 'form-review',
	templateUrl: 'form-review.html'
})
export class FormReview {

  @ViewChild(Content) content: Content;

	form: Form = new Form();

	filter = {};

	submissions: FormSubmission[] = [];

	loading: boolean = true;

	syncing: boolean = false;

	private sub: Subscription;

	private isDispatch;

	filters;

	filteredSubmissions: FormSubmission[] = [];
	searchedSubmissions: FormSubmission[] = [];

	hasSubmissionsToSend: boolean = false;

	constructor(private navCtrl: NavController,
		private navParams: NavParams,
		private client: BussinessClient,
		private zone: NgZone,
		private syncClient: SyncClient,
		private toast: ToastController,
              private util: Util,
              ) {

	  this.filters = [
	    {id: 'all', title:"All", status: 0,  description: "Tap an entry to edit/review."},
	    {id: 'sent', title:"Complete", status: SubmissionStatus.Submitted, description: "Entries uploaded. Tap to review."},
	    {id: 'hold', title:"Pending", status: SubmissionStatus.OnHold, description: "Entries pending transcription/validation. Tap to review."},
	    {id: 'ready', title:"Ready", status: SubmissionStatus.ToSubmit, description: "Entries ready to upload. Tap to edit, tap blue circle to block, or swipe left to delete."},
	    {id: 'blocked', title:"Blocked", status: SubmissionStatus.Blocked, description: "Entries blocked from upload. Tap to edit, tap red circle to unblock, or swipe left to delete."},
	    ];
	  this.filter = this.filters[0];
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
	  if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }
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

	isSubmissionRemovable(submission: FormSubmission) {
	  return (submission.status != SubmissionStatus.OnHold) &&
      (submission.status != SubmissionStatus.Submitted && !this.isNoProcessedRapidScan(submission) && submission.id != -1);
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
      case SubmissionStatus.Submitting:
				result = submission.invalid_fields == 1 ? "danger": "blue";
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

	deleteSubmission(submission) {
	  this.client.removeSubmission(submission).subscribe(result => {
	    this.doRefresh();
    });
  }


	goToEntry(submission) {
	  if (this.isNoProcessedRapidScan(submission) || submission.id == -1) {
     return;
    }
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

	shouldShowBusinessCard(submission: FormSubmission) {
    submission.status != SubmissionStatus.Submitted && this.getBusinessCard(submission);
  }

  displayedName(submission) {
	  let fullName = submission.full_name.trim();
    let hasFullName = fullName && fullName.length > 0;
    let firstName = submission.first_name.trim();
	  let hasFirstLastName = firstName && firstName.length > 0;
	  let isScannedAndNoProcessed = submission.barcode_processed == BarcodeStatus.Queued;
	  let isScannedAndPending = submission.barcode_processed == BarcodeStatus.Processed && typeof submission.hold_request_id != 'undefined';
	  if (hasFullName) {
	    return submission.full_name;
    } else if (hasFirstLastName) {
      return submission.first_name + ' ' + submission.last_name;
    } else if (isScannedAndNoProcessed || isScannedAndPending || submission.barcode_processed == BarcodeStatus.PostShowReconsilation) {
	    return "Scanned";
    }
    return "";
  }

  isNoProcessedRapidScan(submission) {
    let isScannedAndNoProcessed = submission.barcode_processed == BarcodeStatus.Queued;
    return submission.is_rapid_scan == 1 && isScannedAndNoProcessed && !submission.hold_submission;
  }

  displayedProperty(submission, key) {
    let hasValue = submission[key] && submission[key].length > 0;
    let isScannedAndNoProcessed = submission.barcode_processed == BarcodeStatus.Queued;
    if (hasValue) {
      return submission[key];
    }  else if (isScannedAndNoProcessed) {
      return "Scanned";
    }
    return "";
  }


	getBusinessCard(submission: FormSubmission){
		let id = this.form.getIdByFieldType(FormElementType.business_card);
		let front = submission.fields[id] ? submission.fields[id]["front"] : "";
		if (front && front.length > 0) {
      front = this.util.imageUrl(front);
    }
    return front;
	}

	doRefresh() {
		this.client.getSubmissions(this.form, this.isDispatch).subscribe(submissions => {
			this.submissions = submissions;
			this.loading = false;
			this.onFilterChanged();
		});
	}

  getSearchedItems(event) {
    let val = event.target.value;
    let regexp = new RegExp(val, "i");
    this.searchedSubmissions = [].concat(this.filteredSubmissions.filter((submission) => {
      return !val || regexp.test(submission.email) || regexp.test(submission.first_name) || regexp.test(submission.last_name);
    }));
  }

  isSearchingAvailable() {
    return !(this.filteredSubmissions.length == 0 || this.filteredSubmissions[0].id == -1);
  }

	onFilterChanged() {
		this.zone.run(() => {
			let f = this.filter;
			this.filteredSubmissions = this.submissions.filter((sub)=>{
				sub["hasOnlyBusinessCard"] = this.hasOnlyBusinessCard(sub);
				//Under “Ready” we should show the list of ready submissions + submissions with status = sending (with no datetime condition)
				if (Number(f["status"]) == SubmissionStatus.ToSubmit) {
            return (sub.status == SubmissionStatus.ToSubmit) || (sub.status == SubmissionStatus.Submitting);
        }

        if (Number(f["status"]) == SubmissionStatus.Blocked) {
          return (sub.status == SubmissionStatus.InvalidFields) || (sub.status == SubmissionStatus.Blocked);
        }

				return !f["status"] || sub.status + "" == f["status"] + "";
			}).reverse();
			this.hasSubmissionsToSend = this.submissions.filter((sub)=>{
			  return this.isSubmissionNeedToBeSubmitted(sub);
			}).length > 0;

			console.log(this.hasSubmissionsToSend);

			if (this.filteredSubmissions.length == 0) {
			  let fakeSubmission = new FormSubmission();
			  fakeSubmission.id = -1;
			  this.filteredSubmissions.push(fakeSubmission);
      }

			this.searchedSubmissions = this.filteredSubmissions;

      this.content.resize();
		});
	}

	private isSubmissionNeedToBeSubmitted(submission: FormSubmission) {
    return (submission.status == SubmissionStatus.ToSubmit) || (submission.status == SubmissionStatus.Submitting)
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
		let initialState = null;
		if(submission.status == SubmissionStatus.ToSubmit || submission.status == SubmissionStatus.Submitting) {
			initialState = submission.status;
			submission.status = SubmissionStatus.Blocked;
		} else if (submission.status == SubmissionStatus.Blocked) {
			initialState = submission.status;
			submission.status = SubmissionStatus.ToSubmit;
		}
		if (initialState){
			this.client.saveSubmission(submission, this.form).subscribe(()=>{
				this.onFilterChanged();
			}, (err)=>{
				submission.status = initialState;
			});
		}

		return false;
	}
}
