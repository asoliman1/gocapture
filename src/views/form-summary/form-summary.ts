import { Component, NgZone } from '@angular/core';
import { RESTClient } from "../../services/rest-client";
import { Form } from "../../model";
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { NavParams } from 'ionic-angular/navigation/nav-params';

@Component({
  selector: 'form-summary',
  templateUrl: 'form-summary.html'
})
export class FormSummary {

  form: Form = new Form();

  constructor(private navCtrl: NavController, 
              private navParams: NavParams, 
              private client: RESTClient, 
              private zone: NgZone) {
    
  }

  ionViewWillEnter(){
    this.form = this.navParams.get("form");
  }

  doRefresh(refresher){
    
  }

}