import { RESTClient } from './../../services/rest-client';
import { GameResult } from './../../model/game-result';
import { ACTIVATIONS_ACTIONS } from './../../constants/activations-actions';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { FormCapture } from './../../views/form-capture/form-capture';
import { StatusBar } from '@ionic-native/status-bar';
import { Activation } from './../../model/activation';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Popup } from "../../providers/popup/popup";
import { ActivationsPage } from '../../views/activations/activations';
import { BussinessClient } from '../../services/business-service';
import { concatStatic } from 'rxjs/operator/concat';
import { Network } from '@ionic-native/network';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { FormInstructions } from '../../views/form-instructions';


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
    private net: Network,
    private localStorage: LocalStorageProvider,
    private modal: ModalController,
  ) {
  }

  loaded(ev) {
    if (this.isLoading == null) this.isLoading = true;
    else this.isLoading = false;
  }

  ngAfterViewInit(){
    this.checkInstructions()
  }

  private checkInstructions() {
    let instructions;
    let getInstructions;
    let shouldShowInstruction;
    if (this.activation.activation_capture_form_after) {
      if (this.activation.instructions_mobile_mode == 1) {
        instructions = this.localStorage.get("activationInstructions");
        getInstructions = instructions ? JSON.parse(instructions) : [];
        shouldShowInstruction = getInstructions.indexOf(this.activation.id) == -1;
      }
      else if (this.activation.instructions_mobile_mode == 2) {
        shouldShowInstruction = true;
      }
    }

    if (shouldShowInstruction) {
      this.openInstructions(getInstructions);
    }

  }

  private openInstructions(formsInstructions) {
    let instructionsModal;
    instructionsModal = this.modal.create(FormInstructions, { activation: this.activation, isModal: true });

    instructionsModal.present().then((result) => {
      if (formsInstructions) {
        formsInstructions.push(this.activation.id);
        this.localStorage.set("activationInstructions", JSON.stringify(formsInstructions));
      }
    });

    instructionsModal.onDidDismiss(() => {})
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
    this.initNetwork();
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
    if (this.backUnregister) {
      this.backUnregister();
    }
    this.networkSubs.unsubscribe();
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
                    this.statusBar.show();
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
              this.statusBar.show();
              this.navCtrl.pop();
            }
          }];

        this.popup.showAlert('Info', { text: 'alerts.kiosk-mode.message' }, buttons);
      }
    });
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
          this.navCtrl.remove(currentIndex);
        });
      }
   
   
  }

  submitActivation(activationResult: any, isNext: boolean = false, resultAction: string) {
    let activityId = this.navParams.get('activityId'),
      prospectId = this.navParams.get('prospectId');

    if (activityId && prospectId) {
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
