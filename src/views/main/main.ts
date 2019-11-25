import { Component, ViewChild } from '@angular/core';
import { Forms } from "../forms";
import { Settings } from "../settings";
import { BussinessClient } from "../../services/business-service";
import { User, SyncStatus } from "../../model";
import { Subscription } from "rxjs/Subscription";
import { SyncClient } from "../../services/sync-client";
import { IonPullUpComponent } from "../../components/ion-pullup";
import { Nav } from 'ionic-angular/components/nav/nav';
import { ThemeProvider } from "../../providers/theme/theme";
import { App } from "ionic-angular";
import { RapidCaptureService } from "../../services/rapid-capture-service";

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
		public client: BussinessClient,
		private themeProvider: ThemeProvider,
		private rapidCaptureService: RapidCaptureService,
		) {
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
			this.themeProvider.setActiveTheme(theme + '-theme'); // A.S a bug in some themes
		});
	}

	ionViewDidEnter() {

		this.client.getForms().subscribe((forms) => {
			setTimeout(() => {
				this.rapidCaptureService.processUnsentBadges(forms, this.user.theme ? this.user.theme : 'default');
			}, 2000);
		});

		this.client.getUpdates().subscribe();
	}


}
