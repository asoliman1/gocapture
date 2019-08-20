import {Component, ViewChild, NgZone} from '@angular/core';
import { Forms } from "../forms";
import { Settings } from "../settings";
import { BussinessClient } from "../../services/business-service";
import { User, SyncStatus } from "../../model";
import { Subscription } from "rxjs/Subscription";
import { SyncClient } from "../../services/sync-client";
import { IonPullUpComponent, IonPullUpFooterState } from "../../components/ion-pullup";
import { Nav } from 'ionic-angular/components/nav/nav';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import {Util} from "../../util/util";
import {ThemeProvider} from "../../providers/theme/theme";
import {App} from "ionic-angular";
import {FormCapture} from "../form-capture";
import {RapidCaptureService} from "../../services/rapid-capture-service";
import {DocumentsService} from "../../services/documents-service";
import {DocumentsSyncClient} from "../../services/documents-sync-client";

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

	shouldShowSyncBar: boolean = false;

	@ViewChild('pullup') pullup: IonPullUpComponent;

	constructor(
	  private navCtrl: NavController,
		private navParams: NavParams,
		public client: BussinessClient,
		private syncClient: SyncClient,
    private util: Util,
    private themeProvider: ThemeProvider,
    private app: App,
    private rapidCaptureService: RapidCaptureService,
    private documentsSync: DocumentsSyncClient) {
		this.pages = [
			/*{ title: 'Home', component: Dashboard, icon: "home" },*/
			{ title: 'Events', component: Forms, icon: "document" },
			//{ title: 'Dispatches', component: Dispatches, icon: "megaphone" },
			{ title: 'Settings', component: Settings, icon: "cog" }
		];
	}

	openPage(page) {
		this.nav.setRoot(page.component);
	}

	ngOnInit() {
		this.client.getRegistration().subscribe(user => {
			this.user = user;
			this.client.setupNotifications();
			let theme = this.user.theme ? this.user.theme : 'default';
			this.themeProvider.setActiveTheme(theme + '-theme');
		});

		//TODO: move sync bar to the separate components
    this.app.viewWillEnter.subscribe((viewCtrl) => {

      let isFormCaptureView = viewCtrl.instance instanceof FormCapture;

      this.shouldShowSyncBar = !isFormCaptureView;

    })
	}

	footerExpanded() {

	}

	footerCollapsed() {

	}

	ionViewDidEnter() {

    this.client.getForms().subscribe((forms)=>{
      setTimeout(()=>{
        this.rapidCaptureService.processUnsentBadges(forms, this.user.theme ? this.user.theme : 'default');
      }, 2000);
    });

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
			setTimeout(()=>{
				this.client.doAutoSync();
			}, 350);
		}, (err) =>{
			setTimeout(()=>{
				this.client.doAutoSync();
			}, 350);
		});


	}

	handleSync() : Subscription{
		let timer = null;
		let hidePullup = false;
		return this.syncClient.onSync.subscribe(stats => {
			if (stats == null) {
				return;
			}
			this.statuses = stats;
			//console.log(stats);
			this.currentSyncForm = this.getCurrentUploadingForm();

			this.documentsSync.syncAll();

			if (this.pullup.state == IonPullUpFooterState.Minimized && !hidePullup) {
				this.pullup.collapse();
			}
			timer = setTimeout(() => {
				hidePullup = true;
				this.pullup.minimize();
			}, 12500);
		},
		(err) => {
			clearTimeout(timer);
			setTimeout(()=>{
				this.pullup.minimize();
				this.sub.unsubscribe();
				this.sub = this.handleSync();
			}, 200);
		},
		() => {
			clearTimeout(timer);
			setTimeout(()=>{
				this.pullup.minimize();
				this.sub.unsubscribe();
				this.sub = this.handleSync();
			}, 300);
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
