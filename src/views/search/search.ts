import {Component, Input, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, Content} from 'ionic-angular';
import {OptionItem} from "../../model/option-item";

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface ISearch {
  getOptions();
  showOptions();
}

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  @Input() items: OptionItem[];

  @ViewChild(Content) content: Content;

  selectedItem: OptionItem;
  loading = true;

  searchFilter: string = "";

  filteredItems:OptionItem[] = [];

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController) {
    //
  }

  ionViewDidLoad() {
    //
  }

  ionViewDidEnter() {
    this.getItems();
    this.onInput({target: {value: ""}});
  }


  //MARK: Actions

  cancel() {
    this.viewCtrl.dismiss(null);
  }

  done() {
    if(this.selectedItem) {
      this.viewCtrl.dismiss(this.selectedItem.value);
    }
  }

  //MARK: Public

  getItems() {
    if (!this.items) {
      this.items = this.navParams.get("items");
    }
    this.content.resize();
  }

  onInput(event){
    let val = event.target.value;
    let regexp = new RegExp(val, "i");
    this.filteredItems = this.items.filter(item => {
      return !val || regexp.test(item[this.fieldToSearch()]);
    });
  }

  fieldToSearch() {
    return 'title';
  }

  isSearchAvailable() {
    return this.items && this.items.length > 5
  }
}
