import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ThemeProvider} from "../../providers/theme/theme";

/**
 * Generated class for the BasePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-base',
  templateUrl: 'base.html',
})
export class BasePage {

  selectedTheme: String;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public themeProvider: ThemeProvider) {
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BasePage');
  }

}
