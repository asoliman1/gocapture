import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions} from "@ionic-native/camera-preview";
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import {Popup} from "../../providers/popup/popup";
import { Platform } from 'ionic-angular/platform/platform';
import {ImageProcessor} from "../../services/image-processor";

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private cameraPreview: CameraPreview,
              private viewController: ViewController,
              private screenOrientation: ScreenOrientation,
              private popup: Popup,
              private platform: Platform,
              private imageProcessor: ImageProcessor) {
  }

  ionViewDidLoad() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  ionViewDidEnter() {

    // if (this.platform.is('android')) {
    //   this.cameraPreviewOpts["storeToFile"] = true;
    // }
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
    width: window.screen.width,
    height: window.screen.height,
    quality: 100
  };

  onClose() {
    this.viewController.dismiss();
  }

  onTakePicture() {
    this.cameraPreview.takePicture(this.pictureOpts).then((imageData) => {

      imageData = 'data:image/jpeg;base64,' + imageData;

      this.viewController.dismiss({dataUrl: imageData});

      /*
      if (this.platform.is("ios")) {
        this.viewController.dismiss({dataUrl: imageData});
      } else {
        let crop = {
          x: this.cameraPreviewOpts.x,
          y: this.cameraPreviewOpts.y,
          width: this.cameraPreviewOpts.width,
          height: this.cameraPreviewOpts.height};
        this.imageProcessor.crop(imageData, crop).subscribe(data => {
          this.viewController.dismiss(data);
        })
      }
      */
    }, (err) => {
      console.log(err);
      this.popup.showAlert('Error', err, 'Ok');
    });
  }
}
