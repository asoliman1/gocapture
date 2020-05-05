import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { GameResult } from './../../model/game-result';
import { ACTIVATIONS_ACTIONS } from './../../constants/activations-actions';
import { Popup } from "../../providers/popup/popup";
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { BussinessClient } from '../../services/business-service';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the ActivationElementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-activation-element',
  templateUrl: 'activation-element.html',
})
export class ActivationElementPage {
  private backUnregister;
  isLoading: boolean = null;
  onGameEndSubs: Subscription;
  reload: boolean;
  private networkSubs: Subscription;
  online: boolean = true;
  isGameloaded: boolean = false;
  activationUrl : string = this.navParams.get('actUrl')

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private client: BussinessClient, private statusBar: StatusBar,
    private viewCtrl: ViewController, private popup: Popup, private platform: Platform) {
      this.statusBar.hide();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivationElementPage');
  }

  loaded(ev) {
    if (this.isLoading == null) this.isLoading = true;
    else this.isLoading = false;
  }


  listenToGameEvents() {
    const gameEvent = fromEvent(window, 'message');
    this.onGameEndSubs = gameEvent.subscribe((
      msg: MessageEvent) => this.onGameEnd(msg),
      (err) => console.log(err),
    );
  }

  prepareActivationUrl() {
      this.activationUrl = this.navParams.get('actUrl')
    
  }
  onGameEnd(data: MessageEvent) {
    let result: GameResult = data.data;
    switch (result.action) {
      case ACTIVATIONS_ACTIONS.NEXT:
        this.submitResult(result.activation_result);
        break;

      case ACTIVATIONS_ACTIONS.SUBMIT:
        break;

      case ACTIVATIONS_ACTIONS.SUBMIT_NEXT:
        this.submitResult(result.activation_result);

        break;

      case ACTIVATIONS_ACTIONS.EXIT:
        break;

      case ACTIVATIONS_ACTIONS.LOAD_COMPLETE:
        this.isGameloaded = true;
        break;

      case ACTIVATIONS_ACTIONS.BACK:
        this.goBack();
        break;

      default:
        break;
    }

  }

  submitResult(activationResult: any){
    this.viewCtrl.dismiss({result: activationResult});
  }

  ionViewDidLeave() {
    this.onGameEndSubs.unsubscribe();
    this.statusBar.show();
  }
  ionViewDidEnter() {
    this.reloadGame();
    this.listenToGameEvents();
    this.initNetwork();
    this.backUnregister = this.platform.registerBackButtonAction(() => {
      this.goBack();
    }, Number.MAX_VALUE);
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

  goBack() {
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
          this.viewCtrl.dismiss(null);
        }
      }

    ]
    this.popup.showAlert('Warning', { text: 'alerts.activation.message' }, buttons);

  }

  private initNetwork() {
    console.log("initNetwork")
    this.networkSubs = this.client.network.subscribe((data) => {
      console.log(data);
      this.setOnline(data == 'ON');
    })
  }
  private async setOnline(val: boolean) {
    if (this.online == val) return;
    this.online = val;
    if (!val) this.retryToRefreshActivation()
  }

  retryToRefreshActivation() {
    if (this.isGameloaded === false) {
      const buttons = [
        {
          text: 'general.back',
          handler: () => {
            let actvResult = {}
            this.goBack()
            return false;
          }
        },
        {
          text: 'alerts.activation.retry',
          handler: () => {
            if (this.isOnline()) {
              this.reloadGame()
            }
            else {
              this.retryToRefreshActivation()
            }
          }
        }

      ]
      this.popup.showAlert('Warning', { text: 'toast.no-internet-connection' }, buttons);
    }
  }

  public isOnline(): boolean {
    return this.online;
  }

}
