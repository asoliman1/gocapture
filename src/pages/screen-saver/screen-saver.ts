import { StatusBar } from '@ionic-native/status-bar';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Slides } from 'ionic-angular';
import { VIDEO_FORMATS } from '../../constants/video_formats';


@Component({
  selector: 'page-screen-saver',
  templateUrl: 'screen-saver.html',
})

// A.S GOC-333

export class ScreenSaverPage {

  eventStyle: any;
  @ViewChild(Slides) slides: Slides;
  currentIndex: number;
  loading: boolean;
  isVideo: boolean;
  videoReplay: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private StatusBar: StatusBar) {
    this.eventStyle = this.navParams.data.event_style;
    this.eventStyle.screensaver_media_items.push({ url: 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4', path: 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4' })
  }

  ngOnInit() {
    // this.handleSingleVideoReply();
  }

  handleSingleVideoReply() {
    this.isVideoUrl(1);
    if (this.eventStyle.screensaver_media_items.length === 1 && this.isVideo)
      this.videoReplay = true;
    else
      this.videoReplay = false;
  }

  async dismiss() {
    if (this.loading) return;
    this.loading = true;
    await this.viewCtrl.dismiss(this.currentIndex, '', { animate: true });
    this.loading = false;
  }

  slideChanged() {
    this.currentIndex = this.slides.getActiveIndex();
    this.isVideoUrl(this.currentIndex);
  }

  isVideoUrl(index: number) {
    let url: string = this.eventStyle.screensaver_media_items[index - 1].path;
    let ext = url.split('.').pop().toLowerCase();
    console.log(ext);
    if (ext == VIDEO_FORMATS[0]) {
      this.slides.stopAutoplay();
      this.isVideo = true;
    }else{
      this.isVideo = false;
    }
    console.log(this.isVideo)
  }

  videoEnd() {
    this.isVideo = false;
    this.slides.slideNext();
    this.slides.startAutoplay();
  }

  ionViewWillEnter() {
    this.StatusBar.hide()
  }

  ionViewWillLeave() {
    this.StatusBar.show()
  }


}
