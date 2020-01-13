import { RESTClient } from './../../services/rest-client';
import { GameResult } from './../../model/game-result';
import { ACTIVATIONS_ACTIONS } from './../../constants/activations-actions';
import { Subscription } from 'rxjs';
import { FormCapture } from './../../views/form-capture/form-capture';
import { StatusBar } from '@ionic-native/status-bar';
import { Activation } from './../../model/activation';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Component({
  selector: 'page-activation-view',
  templateUrl: 'activation-view.html',
})

export class ActivationViewPage {

  activation: Activation = this.navParams.get('activation');
  isLoading: boolean = null;
  onGameEndSubs: Subscription;
  reload : boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private statusBar: StatusBar,
    private restClient: RESTClient) {
  }

  loaded(ev) {
    if (this.isLoading == null) this.isLoading = true;
    else this.isLoading = false;
  }

  ionViewDidEnter() {
    this.reloadGame();
    this.statusBar.hide();
    this.listenToGameEvents();
  }

  reloadGame(){
    this.reload = true
    this.isLoading = null;
    setTimeout(() => {
      this.reload = false
    }, 100);
  }

  listenToGameEvents() {
    const gameEvent = fromEvent(window, 'message');
    this.onGameEndSubs = gameEvent.subscribe((
      msg: MessageEvent) => this.onGameEnd(msg),
      (err) => console.log(err),
    );
  }

  onGameEnd(data: MessageEvent) {
    let result : GameResult = data.data;
    switch (result.action) {
      case ACTIVATIONS_ACTIONS.NEXT:
        this.submitActivation(result.activation_result,true);

      case ACTIVATIONS_ACTIONS.SUBMIT:
        this.submitActivation(result.activation_result , false);
        break;

      case ACTIVATIONS_ACTIONS.SUBMIT_NEXT:
        this.submitActivation(result.activation_result,true);
        break;

      case ACTIVATIONS_ACTIONS.EXIT:

        break;

      default:
        break;
    }

  }

  ionViewDidLeave() {
    this.statusBar.show();
    this.onGameEndSubs.unsubscribe();
  }

  goToForm(activationResult : any,isNext : boolean = false){
    this.navCtrl.push(FormCapture,
      {
        activation: this.activation,
        form: this.activation.event,
        activationResult,
        isNext
      });
  }

  submitActivation(activationResult : any , isNext : boolean = false){
    let activityId = this.navParams.get('activityId') ,
    prospectId = this.navParams.get('prospectId') ;
    
    if(activityId && prospectId)
    this.restClient.submitActivation({
      activation_id:this.activation.id,
      activation_result:activationResult,
      activity_id: activityId,
      prospect_id : prospectId,
    }).subscribe((data)=>{
      if(data){
        if(isNext) this.goToForm(activationResult,true);
      }
      },(err)=>{
        console.log(err);
    })
    else this.goToForm(activationResult,isNext);

  }

}
