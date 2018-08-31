import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions} from "@ionic-native/camera-preview";
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import {Popup} from "../../providers/popup/popup";
import { Platform } from 'ionic-angular/platform/platform';

/**
 * Generated class for the BusinessCardOverlayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-business-card-overlay',
  templateUrl: 'business-card-overlay.html',
})
export class BusinessCardOverlayPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private cameraPreview: CameraPreview,
              private viewController: ViewController, private screenOrientation: ScreenOrientation, private popup: Popup,
              private platform: Platform) {
  }

  ionViewDidLoad() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  ionViewDidEnter() {

    if (this.platform.is('android')) {
      this.cameraPreviewOpts["storeToFile"] = true;
    }
    this.startCamera();
  }

  private startCamera() {
    this.cameraPreview.startCamera(this.cameraPreviewOpts).then(
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err);
        this.popup.showAlert('Error', err, 'Ok');
      });
  }

  ionViewWillLeave() {
    this.screenOrientation.unlock();
    this.cameraPreview.stopCamera();
  }

  cameraPreviewOpts: CameraPreviewOptions = {
    x: 12,
    y: 150,
    width: window.screen.width - 24,
    height: (window.screen.width - 24) / 1.75,
    camera: 'rear',
    tapPhoto: false,
    previewDrag: false,
    toBack: false,
    alpha: 1,
  };

  // picture options
  pictureOpts: CameraPreviewPictureOptions = {
    width: 640,
    height: 640,
    quality: 100
  };

  onClose() {
    this.viewController.dismiss();
  }

  onTakePicture() {
    this.cameraPreview.takePicture(this.pictureOpts).then((imageData) => {
      this.viewController.dismiss(imageData);
    }, (err) => {
      console.log(err);
      this.popup.showAlert('Error', err, 'Ok');
    });
  }
}
