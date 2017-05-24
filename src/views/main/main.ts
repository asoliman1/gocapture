import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Nav } from 'ionic-angular';
import { Forms } from "../forms";
import { Dispatches } from "../dispatches";
import { Settings } from "../settings";
import { BussinessClient } from "../../services/business-service";
import { User, SyncStatus } from "../../model";
import { Subscription } from "rxjs";
import { SyncClient } from "../../services/sync-client";
import { IonPullUpComponent, IonPullUpFooterState } from "../../components/ion-pullup";

@Component({
	selector: 'main',
	templateUrl: 'main.html'
})
export class Main {

	@ViewChild(Nav) nav: Nav;

	rootPage: any = Forms;

	user: User = new User();	

	uploading: boolean = true;	

	loadingTrigger = false;

	sub: Subscription;

	currentSyncForm: string;

	statuses: SyncStatus[] = [];

	pages: Array<{ title: string, component: any, icon: string }>;

	@ViewChild('pullup') pullup: IonPullUpComponent;

	constructor(private navCtrl: NavController,
		private navParams: NavParams,
		private client: BussinessClient,
		private syncClient: SyncClient) {
		this.pages = [
			/*{ title: 'Home', component: Dashboard, icon: "home" },*/
			{ title: 'Forms', component: Forms, icon: "document" },
			{ title: 'Dispatches', component: Dispatches, icon: "megaphone" },
			{ title: 'Settings', component: Settings, icon: "cog" }
		]
	}

	openPage(page) {
		this.nav.setRoot(page.component);
	}

	ngOnInit() {
		this.client.getRegistration().subscribe(user => {
			this.user = user;
			this.client.setupNotifications();
		});
	}

	footerExpanded() {

	}

	footerCollapsed() {

	}

	ionViewDidEnter() {
		if (this.syncClient.isSyncing) {
			this.pullup.collapse();
			this.statuses = this.syncClient.getLastSync();
			this.currentSyncForm = this.getCurrentUploadingForm();
		}
		this.sub = this.handleSync();
		window["TesseractPlugin"] && TesseractPlugin.loadLanguage("eng", function(response) {
			console.log(response);
		}, function(reason) {
			console.error(reason);
		});
		this.client.getUpdates().subscribe(done => {
		}, (err) =>{
		});
	}

	handleSync() : Subscription{
		return this.syncClient.onSync.subscribe(stats => {
			if (stats == null) {
				return;
			}
			this.statuses = stats;
			//console.log(stats);
			this.currentSyncForm = this.getCurrentUploadingForm();
			if (this.pullup.state == IonPullUpFooterState.Minimized) {
				this.pullup.collapse();
			}
		},
		(err) => {
			setTimeout(()=>{
				this.pullup.minimize();
				this.sub.unsubscribe();
				this.sub = this.handleSync();
			}, 200);
		},
		() => {
			setTimeout(()=>{
				this.pullup.minimize();
				this.sub.unsubscribe();
				this.sub = this.handleSync();
			}, 1000);
		});
	}

	ionViewDidLeave() {
		this.sub.unsubscribe();
		this.sub = null;
	}

	getCurrentUploadingForm() {
		if (this.statuses) {
			for (let i = 0; i < this.statuses.length; i++) {
				if (this.statuses[i].loading) {
					return this.statuses[i].formName;
				}
			}
		}
		return "";
	}

	getIcon(loading, complete): string {
		if (loading) {
			return "refresh";
		}
		if (complete) {
			return "checkmark";
		}
		return "flag";
	}

	getColor(loading, complete): string {
		if (loading) {
			return "primary";
		}
		if (complete) {
			return "secondary";
		}
		return "orange";
	}

	getStateLabel(loading, complete, formName): string {
		if (loading) {
			return "Syncing " + formName;
		}
		if (complete) {
			return "Sync-ed " + formName;
		}
		return formName;
	}

}
