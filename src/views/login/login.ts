import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RESTClient, DBClient } from "../../services";
import { AuthenticationRequest } from "../../model/protocol";
import { User } from "../../model";
import { Main } from "../main";

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class Login {

  doAuth: boolean = false;
  authCode: string;
  user: User = <any>{};

  constructor(private navCtrl: NavController, 
              private navParams: NavParams, 
              private client: RESTClient,
              private db: DBClient) {

  }

  ngOnInit(){
    this.db.getRegistration()
    .subscribe((user)=> {
      if(!user){
        this.doAuth = true;
      }else{
        this.user = user;
      }
    })
  }

  onClick(){
    if(this.doAuth){
      if(!this.authCode){
        return;
      }
      let req = new AuthenticationRequest();
      req.invitation_code = this.authCode;
      req.device_name = this.authCode;
      this.client.authenticate(req).subscribe(reply => {
        this.db.saveRegistration(reply).subscribe((done)=>{
          this.navCtrl.setRoot(Main);
        })
      })
    }else{
      this.navCtrl.setRoot(Main);
    }
  }
}
