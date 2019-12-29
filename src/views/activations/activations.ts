import { Activation } from './../../model/activation';
import { ActivationsProvider } from './../../providers/activations/activations';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Searchbar } from 'ionic-angular';


@Component({
  selector: 'page-activations',
  templateUrl: 'activations.html',
})
export class ActivationsPage {
  searchMode = false;

  searchTrigger = "hidden";

  @ViewChild("search") searchbar: Searchbar;

  activations : Activation[] = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams , 
    private activationsProvider:ActivationsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivationsPage');
  }

  toggleSearch() {
    this.searchMode = !this.searchMode;
    this.searchTrigger = this.searchMode ? "visible" : "hidden";
    if (this.searchMode) {
      setTimeout(() => {
        if (this.searchbar)
          this.searchbar.setFocus();
      }, 100);
    }
  }

  getItems(event) {
    let val = event.target.value;
    let regexp = new RegExp(val, "i");
    this.activations = this.activationsProvider.activations.filter(act => {
      return !val || regexp.test(act.name);
    });
  }

  navigate(act){
    this.navCtrl.push(ActivationsPage,{activation:act});
  }

}
