import {
  Component,
  trigger,
  state,
  style,
  transition,
  animate, ViewChild, NgZone
} from '@angular/core';

import { Subscription } from "rxjs";

import { NavController, NavParams, InfiniteScroll, ActionSheetController } from 'ionic-angular';
import { BussinessClient, SyncClient } from "../../services";
import { IonPullUpComponent, IonPullUpFooterState } from "../../components/ion-pullup";
import { Form, SyncStatus } from "../../model";
import { FormCapture} from "../form-capture";
import { FormSummary} from "../form-summary";
import { FormReview} from "../form-review";


@Component({
  selector: 'forms',
  templateUrl: 'forms.html',
  animations: [
    // Define an animation that adjusts the opactiy when a new item is created
    //  in the DOM. We use the 'visible' string as the hard-coded value in the 
    //  trigger.
    //
    // When an item is added we wait for 300ms, and then increase the opacity to 1
    //  over a 200ms time interval. When the item is removed we don't delay anything
    //  and use a 200ms interval.
    //
    trigger('visibleTrigger', [
      state('visible', style({ opacity: '1', height: '5.8rem' })),
      state('hidden', style({ opacity: '0', height: '0' })),
      transition('visible => hidden', [animate('300ms 200ms')]),
      transition('hidden => visible', [animate('300ms 100ms')])
    ]),
    trigger('loadingTrigger', [
      state('visible', style({ transform: 'translateY(256px)' })),
      state('hidden', style({ transform: 'translateY(300px)'})),
      transition('visible => hidden', [animate('300ms 200ms')]),
      transition('hidden => visible', [animate('300ms 100ms')])
    ])
  ]
})
export class Forms {

  searchMode = false;

  searchTrigger = "hidden";

  loadingTrigger = "hidden";

  statuses: SyncStatus[] = [];

  @ViewChild("search") searchbar;

  @ViewChild('pullup') pullup: IonPullUpComponent;

  forms: Form[] = [];

  uploading: boolean = false;

  sub : Subscription;

  currentSyncForm : string;

  constructor(private navCtrl: NavController, 
              private navParams: NavParams, 
              private client: BussinessClient,
              private zone: NgZone,
              private actionCtrl: ActionSheetController,
              private syncClient: SyncClient) {
    this.doInfinite();
  }

  doRefresh(refresher){
    this.client.getForms().subscribe(forms => {
      this.forms = forms;
      if(refresher){
        refresher.complete();
      }
    });
  }

  toggleSearch() {
    this.searchMode = !this.searchMode;
    this.searchTrigger = this.searchMode ? "visible" : "hidden";
  }

  doInfinite(infiniteScroll?: InfiniteScroll) {
    this.client.getForms().subscribe(forms => {
      this.forms = this.forms.concat(forms);
      if(infiniteScroll){
        infiniteScroll.complete();
      }
    });
  }

  presentActionSheet(form: Form) {
    let actionSheet = this.actionCtrl.create({
      title: form.name,
      buttons: [
        {
          text: 'Capture',
          icon: "magnet",
          handler: () => {
            console.log('capture clicked');
            this.navCtrl.push(FormCapture, {form: form});
          }
        },{
          text: 'Review Submissions',
          icon: "eye",
          handler: () => {
            console.log('review clicked');
            this.navCtrl.push(FormReview, {form: form});
          }
        },{
          text: 'Share',
          icon: "share",
          handler: () => {
            console.log('share clicked');
          }
        },{
          text: 'Summary',
          icon: "megaphone",
          handler: () => {
            console.log('summary clicked');
            this.navCtrl.push(FormSummary, {form: form});
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  footerExpanded(){

  }

  footerCollapsed(){

  }

  ionViewDidEnter(){
    if(this.syncClient.isSyncing){
      this.pullup.collapse();
      this.statuses = this.syncClient.getLastSync();
      this.currentSyncForm = this.getCurrentUploadingForm();
    }
    this.sub = this.syncClient.onSync.subscribe(stats =>{
      if(stats == null){
        return;
      }
      this.statuses = stats;
      this.currentSyncForm = this.getCurrentUploadingForm();
      if(this.pullup.state == IonPullUpFooterState.Minimized){
        this.pullup.collapse();
      }
    },
    (err) =>{

    }, 
    () =>{
      //complete
      this.pullup.minimize();
    });
    this.syncClient.sync();
  }

  ionViewDidLeave(){
    this.sub.unsubscribe();
    this.sub = null;
  }

  getCurrentUploadingForm(){
    if(this.statuses){
      for(let i = 0; i < this.statuses.length; i++){
        if(this.statuses[i].loading){
          return this.statuses[i].formName;
        }
      }
    }
    return "";
  }

  getIcon(loading, complete) : string{
    if(loading){
      return "refresh";
    }
    if(complete){
      return "checkmark";
    }
    return "flag";
  }

  getColor(loading, complete) : string{
    if(loading){
      return "primary";
    }
    if(complete){
      return "secondary";
    }
    return "light";
  }

  getStateLabel(loading, complete) : string{
    if(loading){
      return "Uploading";
    }
    if(complete){
      return "Sync-ed";
    }
    return "Pending";
  }
}
