import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'forms',
  templateUrl: 'forms.html'
})
export class Forms {

  searchMode = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  toggleSearch(){
    this.searchMode = !this.searchMode;
  }
}
