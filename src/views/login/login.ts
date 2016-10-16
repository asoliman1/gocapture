import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RESTClient } from "../../services";
import { AuthenticationRequest } from "../../model/protocol";
import { Main } from "../main";

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class Login {

  constructor(private navCtrl: NavController, private navParams: NavParams, private client: RESTClient) {

  }

  onClick(){
    let req = new AuthenticationRequest();
    this.client.authenticate(req).subscribe(reply => {
      this.navCtrl.setRoot(Main);
    })
  }
}
