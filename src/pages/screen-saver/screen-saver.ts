import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Slides } from 'ionic-angular';


@Component({
  selector: 'page-screen-saver',
  templateUrl: 'screen-saver.html',
})

// A.S GOC-333

export class ScreenSaverPage {

  eventStyle: any;
  @ViewChild(Slides) slides: Slides;
  currentIndex: number;
  loading : boolean;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private viewCtrl: ViewController,
  ) {
    this.eventStyle = this.navParams.data.event_style;
  }


  async dismiss()  {
    if(this.loading) return; 
    this.loading = true;
    await this.viewCtrl.dismiss(this.currentIndex, '', { animate: true });
    this.loading = false;
  }

  slideChanged() {
    this.currentIndex = this.slides.getActiveIndex();
  }

}
