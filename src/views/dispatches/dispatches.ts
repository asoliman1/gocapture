import {
	Component,
	trigger,
	state,
	style,
	transition,
	animate, ViewChild, NgZone
} from '@angular/core';

import { NavController, NavParams, InfiniteScroll,ActionSheetController } from 'ionic-angular';
import { BussinessClient } from "../../services/business-service";
import { DispatchOrder } from "../../model/dispatch-order";
import { FormCapture } from "../form-capture";
import { FormSummary } from "../form-summary";
import { FormReview } from "../form-review";
import { FormSubmission } from "../../model";

@Component({
	selector: 'dispatches',
	templateUrl: 'dispatches.html',
	animations: [
		// Define an animation that adjusts the opactiy when a new item is created
		//  in the DOM. We use the 'visible' string as the hard-coded value in the 
		//  trigger.
		//
		// When an item is added we wait for 300ms, and then increase the opacity to 1
		//  over a 200ms time interval. When the item is removed we don't delay anything
		//  and use a 200ms interval.
		//
		trigger('visibleTrigger', [
			state('visible', style({ opacity: '1', height: '5.8rem' })),
			state('hidden', style({ opacity: '0', height: '0' })),
			transition('visible => hidden', [animate('300ms 200ms')]),
			transition('hidden => visible', [animate('300ms 100ms')])
		])
	]
})
export class Dispatches {

	searchMode = false;

	searchTrigger = "hidden";

	@ViewChild("search") searchbar;

	dispatches: any[] = [];

	filteredDispatches: any[] = [];

	constructor(private navCtrl: NavController,
		private navParams: NavParams,
		private client: BussinessClient,
		private actionCtrl: ActionSheetController,
		private zone: NgZone) {
		this.doInfinite();
	}

	doRefresh(refresher?) {
		this.client.getDispatches().subscribe(forms => {
			//console.log(forms);
			this.dispatches = forms;
			if (refresher) {
				refresher.complete();
			}
		});
	}

	toggleSearch() {
		this.searchMode = !this.searchMode;
		this.searchTrigger = this.searchMode ? "visible" : "hidden";
	}

	doInfinite(infiniteScroll?: InfiniteScroll) {
		this.client.getDispatches().subscribe(forms => {
			this.dispatches = this.dispatches.concat(forms);
			if (infiniteScroll) {
				infiniteScroll.complete();
			}
		});
	}

	getItems(event) {
		let val = event.target.value;
		let regexp = new RegExp(val, "i");
		this.filteredDispatches = this.dispatches.filter(form => {
			return !val || regexp.test(form.name);
		});
	}

	sync() {
		this.client.getUpdates().subscribe(()=> {});
	}

	presentActionSheet(form: DispatchOrder) {
		let actionSheet = this.actionCtrl.create({
			title: form.name,
			buttons: [
				{
					text: 'Capture',
					icon: "magnet",
					handler: () => {
						//console.log('capture clicked');
						let sub : FormSubmission = new FormSubmission();
						sub.prospect_id = form.prospect_id;
						sub.form_id = form.form_id;
						Object.keys(form.fields_values).forEach((key)=>{
							sub.fields[key] = form.fields_values[key];
						});
						this.navCtrl.push(FormCapture, { form: form.form, submission: sub, dispatch: form });
					}
				}, {
					text: 'Review Submissions',
					icon: "eye",
					handler: () => {
						//console.log('review clicked');
						this.navCtrl.push(FormReview, { form: form, isDispatch: true, dispatch: form  });
					}
				}, {
					text: 'Share',
					icon: "share",
					handler: () => {
						//console.log('share clicked');
					}
				}, {
					text: 'Summary',
					icon: "megaphone",
					handler: () => {
						//console.log('summary clicked');
						this.navCtrl.push(FormSummary, { form: form });
					}
				}, {
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
						//console.log('Cancel clicked');
					}
				}
			]
		});
		actionSheet.present();
	}

	ionViewDidEnter() {
		this.doRefresh();
	}
}