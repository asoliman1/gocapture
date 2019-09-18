import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {BasePage} from "../base/base";
import {ThemeProvider} from "../../providers/theme/theme";
import {FilterType, GCFilter} from "../../components/filters-view/gc-filter";
import {FilterService, Modifiers} from "../../services/filter-service";
import {iFilterItem} from "../../model/protocol/ifilter-item";

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage extends BasePage {

  private items: iFilterItem[];
  searchedItems: iFilterItem[];
  selectedItems: any[];
  title: '';
  selectedFilter: GCFilter;
  modifiers: any[];
  selectedModifier: any = FilterService.modifiers()[0];

  isAll: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public themeProvider: ThemeProvider,
              public viewCtrl: ViewController) {
    super(navCtrl, navParams, themeProvider);
  }

  ionViewDidLoad() {
    let selectedItems = this.navParams.get('selectedItems') || [];
    this.items = this.navParams.get('items');
    this.items.forEach(item => item.isSelected = selectedItems.length > 0 && selectedItems.indexOf(item.value) != -1);
    this.searchedItems = this.items;

    this.title = this.navParams.get('title') || 'Filter';
    this.selectedFilter = this.navParams.get('filter');

    this.modifiers = FilterService.modifiers();
  }

  done() {
    this.viewCtrl.dismiss();
  }

  filter() {
    let data = this.searchedItems.filter(item => item.isSelected == true).map(item => {
      return item.value;
    });

    if (this.shouldShowSelect()) {
      data = this.selectedItems.map((item) => {
        return item.value;
      });
    }

    this.viewCtrl.dismiss({data: data, modifier: this.selectedModifier.value});
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

  shouldShowSelect() {
    return  this.selectedFilter.id == FilterType.Name || this.selectedFilter.id == FilterType.Email;
  }

  clearSelectedItems() {
    this.selectedItems = [];
  }
}
