import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {BasePage} from "../base/base";
import {ThemeProvider} from "../../providers/theme/theme";
import {FilterType, GCFilter} from "../../components/filters-view/gc-filter";
import {FilterService, Modifier} from "../../services/filter-service";
import {iFilterItem} from "../../model/protocol/ifilter-item";
import {iTagItem} from "../../model/protocol/itag-item";

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage extends BasePage {

  items: iFilterItem[];
  selectedTags: iTagItem[];

  searchedItems: iFilterItem[];
  title: '';

  selectedFilter: GCFilter;

  modifiers: any[];
  selectedModifier: Modifier;

  isAll: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public themeProvider: ThemeProvider,
              public viewCtrl: ViewController) {
    super(navCtrl, navParams, themeProvider);
  }

  ionViewDidLoad() {
    this.items = this.navParams.get('items');
    this.selectedTags = this.navParams.get('selectedItems') || [];

    this.searchedItems = this.navParams.get('items');

    this.title = this.navParams.get('title') || 'Filter';
    this.selectedFilter = this.navParams.get('filter');

    this.modifiers = FilterService.modifiers();
    this.selectedModifier = this.selectedFilter.modifier || FilterService.modifiers()[0];

    this.items.forEach((item) => {
      item.isSelected = this.items.length > 0 && this.items.indexOf(item.value) != -1;
    });
  }

  done() {
    this.viewCtrl.dismiss();
  }

  filter() {
    let data = this.searchedItems.filter(item => item.isSelected == true).map(item => {
      return item.value;
    });

    if (this.isModifierMode()) {
      data = this.selectedTags;
    }

    this.viewCtrl.dismiss({data: data, modifier: this.selectedModifier});
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

  addTagFn(value) {
    let trimmedValue = value && value.trim();
    if (trimmedValue.length) {
      return {value: trimmedValue, tag: true, isSelected: true };
    }
    return;
  }

  isModifierMode() {
    return  this.selectedFilter.id == FilterType.Name || this.selectedFilter.id == FilterType.Email;
  }

  clearSelectedItems() {
    this.items = [];
  }
}
