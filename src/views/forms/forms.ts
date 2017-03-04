import {
	Component,
	trigger,
	state,
	style,
	transition,
	animate, ViewChild, NgZone
} from '@angular/core';

import { Subscription, Subscriber } from "rxjs";

import { NavController, NavParams, InfiniteScroll, ActionSheetController, Searchbar } from 'ionic-angular';
import { SyncClient } from "../../services/sync-client";
import { BussinessClient } from "../../services/business-service";
import { Form, SyncStatus } from "../../model";
import { FormCapture } from "../form-capture";
import { FormSummary } from "../form-summary";
import { FormReview } from "../form-review";


@Component({
	selector: 'forms',
	templateUrl: 'forms.html',
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
		]),
		trigger('loadingTrigger', [
			state('visible', style({ transform: 'translateY(256px)' })),
			state('hidden', style({ transform: 'translateY(300px)' })),
			transition('visible => hidden', [animate('300ms 200ms')]),
			transition('hidden => visible', [animate('300ms 100ms')])
		])
	]
})
export class Forms {

	searchMode = false;

	searchTrigger = "hidden";

	@ViewChild("search") searchbar: Searchbar;

	forms: Form[] = [];
	filteredForms: Form[] = [];

	private sub : Subscription;

	constructor(private navCtrl: NavController,
		private navParams: NavParams,
		private client: BussinessClient,
		private zone: NgZone,
		private actionCtrl: ActionSheetController,
		private syncClient: SyncClient) {
	}

	doRefresh(refresher?) {
		this.client.getForms().subscribe(forms => {
			this.forms = forms;
			this.getItems({target: {value: ""}});
		});
	}

	toggleSearch() {
		this.searchMode = !this.searchMode;
		this.searchTrigger = this.searchMode ? "visible" : "hidden";
		if(this.searchMode){
			setTimeout(()=>{
				this.searchbar.setFocus();
			}, 100);
		}
	}

	doInfinite(infiniteScroll?: InfiniteScroll) {
		this.client.getForms().subscribe(forms => {
			this.forms = this.forms.concat(forms);
			if (infiniteScroll) {
				infiniteScroll.complete();
			}
		});
	}

	sync() {
		this.client.getUpdates().subscribe(()=> {});
	}

	getItems(event) {
		let val = event.target.value;
		let regexp = new RegExp(val, "i");
		this.filteredForms = this.forms.filter(form => {
			return !val || regexp.test(form.name);
		});
	}

	presentActionSheet(form: Form) {
		let actionSheet = this.actionCtrl.create({
			title: form.name,
			buttons: [
				{
					text: 'Capture',
					icon: "magnet",
					handler: () => {
						//console.log('capture clicked');
						this.navCtrl.push(FormCapture, { form: form });
					}
				}, {
					text: 'Review Submissions',
					icon: "eye",
					handler: () => {
						//console.log('review clicked');
						this.navCtrl.push(FormReview, { form: form, isDispatch: false });
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
						console.log('summary clicked');
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
		setTimeout(()=>{				
			this.doRefresh();
			this.sub = this.syncClient.entitySynced.subscribe((type)=>{
				if(type == "Forms" || type == "Submissions"){
					this.doRefresh();
				}
			});
		}, 100);
	}

	ionViewDidLeave() {
		this.sub.unsubscribe();
	}
}
