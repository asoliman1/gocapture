import { RESTClient } from './../../services/rest-client';
import { GameResult } from './../../model/game-result';
import { ACTIVATIONS_ACTIONS } from './../../constants/activations-actions';
import { Subscription } from 'rxjs';
import { FormCapture } from './../../views/form-capture/form-capture';
import { StatusBar } from '@ionic-native/status-bar';
import { Activation } from './../../model/activation';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Popup } from "../../providers/popup/popup";
import { BussinessClient } from '../../services/business-service';
import { Network } from '@ionic-native/network';


@Component({
  selector: 'page-activation-view',
  templateUrl: 'activation-view.html',
})

export class ActivationViewPage {

  activation: Activation = this.navParams.get('activation');
  activationUrl: string;
  isLoading: boolean = null;
  isGameloaded: boolean = false;
  onGameEndSubs: Subscription;
  reload: boolean;
  actvationResultFromSubmit: any;
  private backUnregister;
  private networkSubs : Subscription;
  online: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private statusBar: StatusBar,
    private restClient: RESTClient,
    private popup: Popup,
    private platform: Platform,
    private client: BussinessClient,
  ) {
  }

  loaded(ev) {
    if (this.isLoading == null) this.isLoading = true;
    else this.isLoading = false;
  }

  ionViewWillEnter() {
    if(this.activation.activation_capture_form_after){
      this.statusBar.hide();
    }
    this.prepareActivationUrl();
  }
  
  ionViewDidEnter() {
    this.reloadGame();
    this.listenToGameEvents();
    // this.initNetwork();
  }

  prepareActivationUrl() {
    let prospectId = this.navParams.get('prospectId');
    if (prospectId) {
      this.activationUrl = this.activation.url + "&prospect_id=" + prospectId;
    }
    else {
      this.activationUrl = this.activation.url + "&prospect_id=" + 0;
    }
  }


  reloadGame() {
    this.reload = true
    this.isLoading = null;
    setTimeout(() => {
      this.reload = false
    }, 200);
  }

  listenToGameEvents() {
    const gameEvent = fromEvent(window, 'message');
    this.onGameEndSubs = gameEvent.subscribe((
      msg: MessageEvent) => this.onGameEnd(msg),
      (err) => console.log(err),
    );
  }

  onGameEnd(data: MessageEvent) {
    let result: GameResult = data.data;
    switch (result.action) {
      case ACTIVATIONS_ACTIONS.NEXT:
        this.goToForm(this.actvationResultFromSubmit, true);
        break;

      case ACTIVATIONS_ACTIONS.SUBMIT:
        this.submitActivation(result.activation_result, false, result.action);
        break;

      case ACTIVATIONS_ACTIONS.SUBMIT_NEXT:
        this.submitActivation(result.activation_result, true, result.action);
        break;

      case ACTIVATIONS_ACTIONS.EXIT:
        break;

        case ACTIVATIONS_ACTIONS.LOAD_COMPLETE:
          this.isGameloaded = true;
        break;

      case ACTIVATIONS_ACTIONS.BACK:
        this.goBack(this.actvationResultFromSubmit);
        break;

      default:
        break;
    }

  }

  ionViewDidLeave() {
    this.onGameEndSubs.unsubscribe();
  }

  goBackIfActivationFirst() {
    this.navCtrl.pop();
  }
  goBack(activationResult: any) {
    if (this.activation.activation_capture_form_after) {
      this.goBackIfActivationFirst();
    }

    else {
      const buttons = [
        {
          text: 'general.cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'general.ok',
          handler: () => {
            this.goToForm(activationResult, true)
          }
        }

      ]
      this.popup.showAlert('Warning', { text: 'alerts.activation.message' }, buttons);
    }
  }

  goToForm(activationResult: any, isNext: boolean = false) {
      let currentIndex = this.navCtrl.getActive().index;
      if(!this.activation.activation_capture_form_after){
      this.navCtrl.push(FormCapture,
        {
          activation: this.activation,
          form: this.activation.event,
          isNext
        }).then(() => {
          console.log("removing game")
          this.navCtrl.remove(currentIndex);
        });
      }
      else{
      this.navCtrl.push(FormCapture,
        {
          activation: this.activation,
          form: this.activation.event,
          activationResult,
          isNext
        }).then(() => {
          console.log("removing game")
          this.navCtrl.remove(currentIndex);
        });
      }
   
   
  }

  submitActivation(activationResult: any, isNext: boolean = false, resultAction: string) {
    let activityId = this.navParams.get('activityId'),
      prospectId = this.navParams.get('prospectId');

    if (activityId && prospectId) {
      console.log("we have data from the capture")
      console.log(this.navParams.get('activityId'), this.navParams.get('prospectId'))
      this.restClient.submitActivation({
        activation_id: this.activation.id,
        activation_result: activationResult,
        activity_id: activityId,
        prospect_id: prospectId,
      }).subscribe((data) => {
        if (data) {
          console.log(data);
          console.log(isNext)
          console.log(activationResult)
          if (isNext) this.goToForm(activationResult, true);
        }
      }, (err) => {
        this.retryForSubmitActivation(activationResult, isNext, resultAction)
        console.log("response error", err);
      })
    }

    else {
      console.log("we do not have data from the capture");
      console.log(resultAction);
      if(resultAction == ACTIVATIONS_ACTIONS.SUBMIT_NEXT){
        console.log(resultAction);
        this.goToForm(activationResult, true)
      }
      else{
        console.log(resultAction);
      this.actvationResultFromSubmit = activationResult;
      }
    }

  }

  public isOnline(): boolean {
    return this.online;
  }

  private async setOnline(val: boolean) {
    if(this.online == val) return;
    this.online = val;
    if(!val) this.retryToRefreshActivation()
  }

  private initNetwork() {
    console.log("initNetwork")
      this.networkSubs = this.client.network.subscribe((data)=>{
        console.log(data);
        this.setOnline(data == 'ON');
      })

  }

  retryForSubmitActivation(activationResult: any, isNext: boolean = false, resultAction: string){
    const buttons = [
      {
        text: 'general.back',
        handler: () => {
          this.goBack(activationResult)
        }
      },
      {
        text: 'alerts.activation.retry',
        handler: () => {
        if (this.isOnline()){
          this.submitActivation(activationResult, isNext, resultAction)
        }
        else{
          this.retryForSubmitActivation(activationResult, isNext, resultAction)
        }
        }
      }

    ]
    this.popup.showAlert('Warning', { text: 'toast.no-internet-connection' }, buttons);
  }

  retryToRefreshActivation(){
    if(this.isGameloaded === false){
    const buttons = [
      {
        text: 'general.back',
        handler: () => {
          let actvResult = {}
          this.goBack(actvResult)
          return false;
        }
      },
      {
        text: 'alerts.activation.retry',
        handler: () => {
        if (this.isOnline()){
          this.reloadGame()
        }
        else{
          this.retryToRefreshActivation()
        }
        }
      }

    ]
    this.popup.showAlert('Warning', { text: 'toast.no-internet-connection' }, buttons);
  }
}

}
