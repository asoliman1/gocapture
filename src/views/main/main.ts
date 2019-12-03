import { Component, ViewChild } from '@angular/core';
import { Forms } from "../forms";
import { Settings } from "../settings";
import { BussinessClient } from "../../services/business-service";
import { User } from "../../model";
import { Nav } from 'ionic-angular/components/nav/nav';
import { ThemeProvider } from "../../providers/theme/theme";
import { RapidCaptureService } from "../../services/rapid-capture-service";
import { FormsProvider } from '../../providers/forms/forms';

@Component({
	selector: 'main',
	templateUrl: 'main.html'
})
export class Main {

	@ViewChild(Nav) nav: Nav;
	rootPage: any = Forms;
	user: User = new User();
	pages: Array<{ title: string, component: any, icon: string }>;

	constructor(
		public  client: BussinessClient,
		private themeProvider: ThemeProvider,
		private rapidCaptureService: RapidCaptureService,
		private formsProvider: FormsProvider
	) {
		this.pages = [
			{ title: 'Events', component: Forms, icon: "document" },
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

		setTimeout(() => {
			this.rapidCaptureService.processUnsentBadges(this.formsProvider.forms, this.user.theme ? this.user.theme : 'default');
		}, 2000);

		this.client.getUpdates().subscribe();
	}


}
