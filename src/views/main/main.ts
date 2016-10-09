import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Nav } from 'ionic-angular';
import { Dashboard } from "../dashboard";
import { Forms } from "../forms";
import { Dispatches } from "../dispatches";
import { Settings } from "../settings";

@Component({
  selector: 'main',
  templateUrl: 'main.html'
})
export class Main {

  @ViewChild(Nav) nav: Nav;

  rootPage: any = Dashboard;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
}
