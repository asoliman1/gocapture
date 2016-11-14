import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, InfiniteScroll } from 'ionic-angular';
import { RESTClient } from "../../services";
import { Form } from "../../model";

@Component({
  selector: 'form-capture',
  templateUrl: 'form-capture.html'
})
export class FormCapture {

  form: Form;

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

  doBack(){
	  this.navCtrl.pop();
  }

  ionViewWillUnload(){
	  console.log("Destroying FormCapture");
  }
}