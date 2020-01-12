import { StatusBar } from '@ionic-native/status-bar';
import { Activation } from './../../model/activation';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ActivationViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-activation-view',
  templateUrl: 'activation-view.html',
})
export class ActivationViewPage {
  activation : Activation = this.navParams.get('activation');
  isLoading : boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams,private statusBar:StatusBar) {
    this.statusBar.hide();
  }

  loaded(ev){
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  ionViewDidLeave(){
   this.statusBar.show();
  }
}
