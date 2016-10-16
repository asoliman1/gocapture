import {
  Component,
  trigger,
  state,
  style,
  transition,
  animate, ViewChild, NgZone
} from '@angular/core';

import { NavController, NavParams, InfiniteScroll } from 'ionic-angular';
import { RESTClient } from "../../services";
import { Form } from "../../model";

@Component({
  selector: 'dispatches',
  templateUrl: 'dispatches.html',
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
    ])
  ]
})
export class Dispatches {

  searchMode = false;

  searchTrigger = "hidden";

  @ViewChild("search") searchbar;

  dispatches: Form[] = [];

  constructor(private navCtrl: NavController, 
              private navParams: NavParams, 
              private client: RESTClient, 
              private zone: NgZone) {
    this.doInfinite();
  }

  doRefresh(refresher){
    this.client.getForms().subscribe(forms => {
      this.dispatches = forms.records;
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
      this.dispatches = this.dispatches.concat(forms.records);
      if(infiniteScroll){
        infiniteScroll.complete();
      }
    });
  }
}