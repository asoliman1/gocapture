import { StatusBar } from '@ionic-native/status-bar';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Slides } from 'ionic-angular';
import { EventStyle } from '../../model/event-style';
import { ThemeProvider } from '../../providers/theme/theme';


@Component({
  selector: 'page-screen-saver',
  templateUrl: 'screen-saver.html',
})

// A.S GOC-333

export class ScreenSaverPage {
 


  eventStyle: EventStyle;
  @ViewChild(Slides) slides: Slides;
  currentIndex: number;
  themeColor: string;
  loading : boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private themeProvider: ThemeProvider, private StatusBar: StatusBar) {
    this.eventStyle = this.navParams.data.event_style;
    this.themeProvider.getActiveTheme().subscribe(val => this.themeColor = val.replace('-theme', ''));
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

  ionViewWillEnter() {
    this.StatusBar.hide()
  }

  ionViewWillLeave() {
    this.StatusBar.show()
  }


}
