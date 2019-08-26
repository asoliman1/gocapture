import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {BasePage} from "../base/base";
import {ThemeProvider} from "../../providers/theme/theme";

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage extends BasePage {

  private items: {value: string, isSelected: boolean}[];
  searchedItems: {value: string, isSelected: boolean}[];

  isAll: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public themeProvider: ThemeProvider,
              public viewCtrl: ViewController) {
    super(navCtrl, navParams, themeProvider);
  }

  ionViewDidLoad() {
    let selectedItems = this.navParams.get('selectedItems') || [];
    this.items = this.navParams.get('items').map((item) => {
      return {value: item, isSelected: selectedItems.length > 0 && selectedItems.indexOf(item) != -1};
    });
    this.searchedItems = this.items;
  }

  done() {
    this.viewCtrl.dismiss();
  }

  filter() {
    let data = this.searchedItems.filter(item => item.isSelected == true).map(item => {
      return item.value;
    });

    this.viewCtrl.dismiss(data);
  }

  getSearchedItems(event) {
    let val = event.target.value;
    let regexp = new RegExp(val, "i");
    this.searchedItems = [].concat(this.items.filter((item) => {
      return !val || regexp.test(item.value);
    }));
  }


  isAllUpdated() {
    this.searchedItems.forEach(item => {
      item.isSelected = this.isAll;
    });
  }
}
