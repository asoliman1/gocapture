import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RESTClient } from "../../services";
import { Main } from "../main";

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class Login {

  constructor(public navCtrl: NavController, public navParams: NavParams, private client: RESTClient) {

  }

  onClick(){
    this.navCtrl.setRoot(Main);
  }
}
