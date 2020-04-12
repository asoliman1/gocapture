import { ActivationsPage } from './../../views/activations/activations';
import { SupportPage } from './../../pages/support/support';
import { Component, ViewChild, NgZone } from '@angular/core';
import { Forms } from "../forms";
import { Settings } from "../settings";
import { BussinessClient } from "../../services/business-service";
import { User } from "../../model";
import { Nav } from 'ionic-angular/components/nav/nav';
import { ThemeProvider } from "../../providers/theme/theme";
import { RapidCaptureService } from "../../services/rapid-capture-service";
import { FormsProvider } from '../../providers/forms/forms';
import { DBClient } from '../../services/db-client';

@Component({
	selector: 'main',
	templateUrl: 'main.html'
})
export class Main {

	@ViewChild(Nav) nav: Nav;
	rootPage: any = Forms;
	user: User = new User();
	pages: Array<{ title: string, component: any, icon: string, data?: any }>;

	constructor(
		public client: BussinessClient,
		private themeProvider: ThemeProvider,
		private rapidCaptureService: RapidCaptureService,
		private formsProvider: FormsProvider,
		private ngZone : NgZone,
		private dbClient : DBClient,
	) {
	}

	openPage(page) {
		this.nav.setRoot(page.component, page.data);
	}

	setPages() {
		this.pages = [
			{ title: 'sideMenu.events', component: Forms, icon: "document" }
		];
		
		if (this.user.activations)
			this.pages.push({
				title: 'sideMenu.activations',
				component: ActivationsPage,
				icon: "game-controller-b" 
			})

			else {
				this.pages = this.pages.filter((e) => e.title != 'Activations');
			}

			this.pages.push({
				title: 'sideMenu.settings', component: Settings, icon: "cog"
			})

		if (this.user.in_app_support)
			this.pages.push({
				title: 'sideMenu.support',
				component: SupportPage,
				icon: "help",
				data: { documentation: this.user.documentation_url, email: this.user.support_email }
			})
		else {
			this.pages = this.pages.filter((e) => e.title != 'Support');
		}
	}


	ngOnInit() {
		this.client.setupNotifications();
		this.checkUnsentBadges();
		this.client.getUpdates().subscribe(()=>{},(err)=>{},()=>{});
		this.client.userUpdates.subscribe((user: User)=>{
			this.setUser(user);
		})
		this.dbClient.getRegistration().subscribe((user)=>{
			this.setUser(user)
		})
	}
	
	checkUnsentBadges(){
		setTimeout(() => {
			this.rapidCaptureService.processUnsentBadges(this.formsProvider.forms, this.user.theme ? this.user.theme : 'default');
		}, 2000);
	}

	setUser(user : User){
		this.ngZone.run(()=>{
			this.user = user;
			this.setPages();
		})
	}


}
