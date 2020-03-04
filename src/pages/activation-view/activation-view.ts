import { RESTClient } from './../../services/rest-client';
import { GameResult } from './../../model/game-result';
import { ACTIVATIONS_ACTIONS } from './../../constants/activations-actions';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { FormCapture } from './../../views/form-capture/form-capture';
import { StatusBar } from '@ionic-native/status-bar';
import { Activation } from './../../model/activation';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Popup } from "../../providers/popup/popup";
import { ActivationsPage } from '../../views/activations/activations';
import { BussinessClient } from '../../services/business-service';
import { concatStatic } from 'rxjs/operator/concat';
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
  private networkOn: Subscription;
  private networkOff: Subscription;
  private online: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private statusBar: StatusBar,
    private restClient: RESTClient,
    private popup: Popup,
    private platform: Platform,
    private client: BussinessClient,
    private net: Network
  ) {
    this.initNetwork();
  }

  loaded(ev) {
    if (this.isLoading == null) this.isLoading = true;
    else this.isLoading = false;
  }

  ionViewWillEnter() {
    this.prepareActivationUrl();
  }
  ionViewDidEnter() {
    this.reloadGame();
    this.statusBar.hide();
    this.listenToGameEvents();
    this.backUnregister = this.platform.registerBackButtonAction(() => {
      this.goBack(this.actvationResultFromSubmit);
    }, Number.MAX_VALUE);

    if (this.activation.activation_capture_form_after) {
      this.client.hasKioskPassword().subscribe(hasPwd => {

        if (!hasPwd) {

          const inputs = [{
            name: 'passcode',
            placeholder: 'alerts.kiosk-mode.placeholder',
            value: ""
          }];

          const buttons = [
            {
              text: 'general.cancel',
              role: 'cancel',
              handler: () => {
              }
            },
            {
              text: 'general.ok',
              handler: (data) => {
                let password = data.passcode;
                this.client.setKioskPassword(password).subscribe((valid) => {

                });
              }
            }];

          this.popup.showPrompt({ text: 'alerts.kiosk-mode.set-password' }, { text: '' }, inputs, buttons);
        }
      })
    }
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

  ionViewWillLeave() {
    console.log("activationurl", this.activationUrl)
    if (this.backUnregister) {
      this.backUnregister();
    }
    this.networkOn.unsubscribe();
    this.networkOff.unsubscribe()
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
    this.statusBar.show();
    this.onGameEndSubs.unsubscribe();
  }

  goBackIfActivationFirst() {
    this.client.hasKioskPassword().subscribe((hasPas) => {
      if (hasPas) {

        const buttons = [
          {
            text: 'general.cancel',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: 'general.ok',
            handler: (data) => {
              let password = data.passcode;
              this.client.validateKioskPassword(password).subscribe((valid) => {
                if (valid) {
                  setTimeout(() => {
                    this.navCtrl.pop();
                  }, 500);
                } else {
                  return false;
                }
              });
            }
          }];

        const inputs = [{
          name: 'passcode',
          placeholder: 'alerts.kiosk-mode.placeholder',
          value: ""
        }];

        this.popup.showPrompt({ text: 'alerts.kiosk-mode.enter-passcode' }, { text: '' }, inputs, buttons);

      } else {
        const buttons = [
          {
            text: 'general.ok',
            handler: () => {
              this.navCtrl.pop();
            }
          }];

        this.popup.showAlert('Info', { text: 'alerts.kiosk-mode.message' }, buttons);
      }
    });
  }
  goBack(activationResult: any) {
    if (this.activation.activation_capture_form_after) {
      console.log("activationFirst")
      this.goBackIfActivationFirst();
    }

    else {
      console.log(this.navParams.get('prospectId'))
      console.log("activationSecond")
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
      console.log("Go to Form")
      let currentIndex = this.navCtrl.getActive().index;
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

  submitActivation(activationResult: any, isNext: boolean = false, resultAction: string) {
    let activityId = this.navParams.get('activityId'),
      prospectId = this.navParams.get('prospectId');

    if (activityId && prospectId) {
      console.log("we have data from the capture")
      this.restClient.submitActivation({
        activation_id: this.activation.id,
        activation_result: activationResult,
        activity_id: activityId,
        prospect_id: prospectId,
      }).subscribe((data) => {
        if (data) {
          if (isNext) this.goToForm(activationResult, true);
        }
      }, (err) => {
        this.retryForSubmitActivation(activationResult, isNext, resultAction)
        console.log("response error", err);
      })
    }

    else {
      console.log("we do not have data from the capture");
      if(resultAction == ACTIVATIONS_ACTIONS.SUBMIT_NEXT){
        this.goToForm(activationResult, true)
      }
      else{
      this.actvationResultFromSubmit = activationResult;
      }
    }

  }

  public isOnline(): boolean {
    return this.online;
  }

  private async setOnline(val: boolean) {
    this.online = val;
  }

  private initNetwork() {
    console.log("initNetwork")
    this.networkOn = this.net.onConnect().subscribe(() => {
      console.log("network was connected");
      this.setOnline(true);
    });
    this.networkOff = this.net.onDisconnect().subscribe(() => {
      console.log("network was disconnected :-(");
      this.retryToRefreshActivation()
      this.setOnline(false);
    });

    // if(this.client.isOnline()){
    //   console.log("network was connected");
    //   this.setOnline(true);
    // }
    // else{
    //   console.log("network was disconnected :-(");
    //   this.retryToRefreshActivation()
    //   this.setOnline(false);
    // }

  }

  retryForSubmitActivation(activationResult: any, isNext: boolean = false, resultAction: string){
    const buttons = [
      {
        text: 'Go Back',
        handler: () => {
          this.goBack(activationResult)
        }
      },
      {
        text: 'retry',
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
    this.popup.showAlert('Warning', { text: 'No Internet Connection' }, buttons);
  }

  retryToRefreshActivation(){
    if(this.isGameloaded === false){
    const buttons = [
      {
        text: 'Go Back',
        handler: () => {
          let actvResult = {}
          this.goBack(actvResult)
          return false;
        }
      },
      {
        text: 'retry',
        handler: () => {
        if (this.isOnline()){
          console.log("if online")
          this.reloadGame()
        }
        else{
          console.log("if not online")
          this.retryToRefreshActivation()
        }
        }
      }

    ]
    this.popup.showAlert('Warning', { text: 'No Internet Connection' }, buttons);
  }
}

}
