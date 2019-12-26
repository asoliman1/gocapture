import {Component, Input, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, Content} from 'ionic-angular';
import {OptionItem} from "../../model/option-item";
import {ThemeProvider} from "../../providers/theme/theme";
import {SettingsService} from "../../services/settings-service";
import {settingsKeys} from "../../constants/constants";

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

  selectedTheme;

  isSingleTap = false;

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController,
              public themeProvider: ThemeProvider,
              public settingsService: SettingsService) {
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  ionViewWillLoad() {
    this.settingsService.getSetting(settingsKeys.SINGLE_TAP_SELECTION).subscribe(result => {
      this.isSingleTap = !result || JSON.parse(result);
    });
  }

  ionViewWillEnter() {
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

  onInput(event) {
    let val = event.target.value;
    let regexp = new RegExp(val, "i");
    this.filteredItems = this.items.filter(item => {

      return !val || regexp.test(item[this.fieldToSearch()]);
    });
  }

  onSelect(item) {
    this.selectedItem = item;

    if (this.isSingleTap) {
      this.viewCtrl.dismiss(this.selectedItem.value);
    }
  }

  fieldToSearch() {
    return 'search';
  }

  isSearchAvailable() {
    return this.items && this.items.length > 5
  }
}
