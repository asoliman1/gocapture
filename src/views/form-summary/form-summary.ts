import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RESTClient } from "../../services/rest-client";
import { Form } from "../../model";

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