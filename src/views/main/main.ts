import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Nav } from 'ionic-angular';
import { Dashboard } from "../dashboard";
import { Forms } from "../forms";
import { Dispatches } from "../dispatches";
import { Settings } from "../settings";
import { BussinessClient } from "../../services/business-service";
import { User } from "../../model";

@Component({
  selector: 'main',
  templateUrl: 'main.html'
})
export class Main {

  @ViewChild(Nav) nav: Nav;

  rootPage: any = Dashboard;

  user: User = new User();

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(private navCtrl: NavController, 
  			  private navParams: NavParams,
			  private client: BussinessClient ) {
    this.pages = [
      { title: 'Home', component: Dashboard, icon: "home" },
      { title: 'Forms', component: Forms, icon: "document" },
      { title: 'Dispatches', component: Dispatches, icon: "megaphone" },
      { title: 'Settings', component: Settings, icon: "cog" }
    ]
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  ngOnInit(){
	  this.client.getRegistration().subscribe(user => {
		  this.user = user;
	  })
  }
}
