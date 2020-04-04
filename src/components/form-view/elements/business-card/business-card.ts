import { formViewService } from './../../form-view-service';
import { Subscription } from 'rxjs/Subscription';
import { Device } from '@ionic-native/device';
import { Component, Input, forwardRef, NgZone, ViewChild, OnDestroy } from '@angular/core';
import { BaseElement } from "../base-element";
import { FormElement, Form, FormSubmission } from "../../../../model";
import { FormGroup, NG_VALUE_ACCESSOR, AbstractControl } from "@angular/forms";
import { Camera } from "@ionic-native/camera";

import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { Platform } from 'ionic-angular/platform/platform';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { File } from '@ionic-native/file';
import { Util } from "../../../../util/util";

import { ThemeProvider } from "../../../../providers/theme/theme";
import { Popup } from "../../../../providers/popup/popup";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { PhotoLibrary } from "@ionic-native/photo-library";
import { ImageViewer } from "./image-viewer";
import { settingsKeys } from "../../../../constants/constants";
import { ScreenOrientation } from "@ionic-native/screen-orientation";

declare var CameraPreview;
declare var screen;

@Component({
  selector: 'business-card',
  templateUrl: 'business-card.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BusinessCard), multi: true }
  ]
})
export class BusinessCard extends BaseElement implements OnDestroy {

  @ViewChild("frontImage")
  private frontImage: any;

  @ViewChild("backImage")
  private backImage: any;

  @Input() element: FormElement;
  @Input() formGroup: FormGroup;
  @Input() readonly: boolean = false;

  @Input() form: Form;
  @Input() submission: FormSubmission;

  front: string = "";
  back: string = "";
  ButtonBar : Subscription;

  backLoading: boolean = false;
  frontLoading: boolean = false;

  theVal: any;

  FRONT: number = 0;
  BACK: number = 1;

  private selectedTheme;

  //only for IOS
  private needCrop = true;

  constructor(private actionCtrl: ActionSheetController,
    private camera: Camera,
    private device: Device,
    private zone: NgZone,
    private platform: Platform,
    private modalCtrl: ModalController,
    public fileService: File,
    public util: Util,
    private themeProvider: ThemeProvider,
    private popup: Popup,
    private photoViewer: PhotoViewer,
    private photoLibrary: PhotoLibrary,
    private formViewService : formViewService,
    private screen: ScreenOrientation) {

    super();

    this.initImages();

    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);

  }

  // picture options
  private pictureOpts = {
    width: this.platform.width(),
    height: this.platform.height(),
    quality: 100
  };

  ngAfterContentInit() {
    this.theVal = {
      front: this.util.imageUrl( this.currentVal.front ),
      back: this.util.imageUrl( this.currentVal.back )
    };
    console.log(this.theVal)
  }

  ngOnDestroy(): void {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
    this.ButtonBar.unsubscribe();

  }

  ngOnInit() {
    this.ButtonBar = this.formViewService.onButtonEmit.subscribe((data)=>{
      if(data == 'scan_business_card') this.captureImage(this.FRONT);
      else if(data == 'reset') this.initImages();
    })
  }

  initImages(){
    this.theVal = {
      front: this.front,
      back: this.back
    };

    this.currentVal = {
      front: this.front,
      back: this.back
    };
  }

  captureImage(type: number) {
    let buttons = [];
    if ((type == this.FRONT && this.currentVal.front != this.front) ||
      (type == this.BACK && this.currentVal.back != this.back)) {

      if (this.readonly) {
        buttons = this.actionsForReadonlyCards(type);
      } else {
        buttons = this.actionsForCards(type);
      }

      this.popup.showActionSheet("",buttons);
    } else {
      if (this.readonly) {
        return;
      }
      if (this.platform.is('ios')) {
        this.doCapture(type);
      } else {
        // this.showBusinessCardOverlay(type);
        this.startCamera(type)
      }
    }
  }

  actionsForReadonlyCards(type) {
    return [
      {
        text: 'alerts.business-card.view-image',
        handler: () => {
          this.viewImage(type);
        }
      },
      {
        text: 'alerts.business-card.save-to-library',
        handler: () => {
          let imageFullPath = type == this.FRONT ? this.currentVal.front : this.currentVal.back;

          let imageName = imageFullPath.split('/').pop();
          let imagePath = this.imagesFolder() + "/" + imageName;

          this.photoLibrary.requestAuthorization({read:true,write:true}).then(() => {
            this.photoLibrary.saveImage(imagePath, 'GoCapture BC').then(result => {
              this.popup.showAlert('alerts.info', {text:'alerts.business-card.saved-image'}, [{
                text: 'general.ok',
                role: 'cancel'
              }],
                this.selectedTheme);
            });
          });
        }
      },
      {
        text: 'general.cancel',
        role: 'cancel'
      }
    ]
  }

  actionsForCards(type) {
    return [
      {
        text: 'alerts.business-card.view-image',
        handler: () => {
          this.viewImage(type);
        }
      },
      {
        text: 'alerts.business-card.retake',
        handler: () => {
          if (this.platform.is('ios')) {
            this.doCapture(type, 1);
          } else {
            this.startCamera(type);
          }
        }
      },
      {
        text: 'alerts.business-card.choose-from-library',
        handler: () => {
          this.doCapture(type, 2);
        }
      },
      {
        text: 'alerts.remove',
        role: 'destructive',
        handler: () => {
          this.zone.run(() => {
            this.setValue(type, type == this.FRONT ? this.front : this.back);
          });
        }
      },
      {
        text: 'general.cancel',
        role: 'cancel'
      }
    ]
  }

  private async doCapture(type: number, captureType: number = 1) {

    // await this.screen.lock(this.screen.ORIENTATIONS.PORTRAIT);

    let width = Math.min(this.platform.width(), this.platform.height());

    let options = {
      sourceType: this.device.isVirtual && this.platform.is("ios") ? 2 : captureType,
      correctOrientation: true,
      saveToPhotoAlbum: false,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 1000,
      targetHeight: 1000,
      destinationType: this.destinationType(),
      shouldDisplayOverlay: true,
      previewPositionX: 12,
      previewPositionY: 150,
      previewWidth: width - 24,
      previewHeight: (width - 24) / 1.75,
      quality: 100,
      needCrop: this.platform.is("ios") ? this.needCrop : true
    };

    this.frontLoading = type == this.FRONT;
    this.backLoading = type != this.FRONT;

    this.onProcessingEvent.emit('true');

    (<any>navigator).camera.getPicture((imageData) => {

      this.onProcessingEvent.emit('false');

      console.log('Picture was taken');

      imageData = 'data:image/jpg;base64,' + imageData;

      let shouldRecognize = this.element.is_scan_cards_and_prefill_form == 1;


      this.screen.unlock();
    }, (error) => {
      this.onProcessingEvent.emit('false');
      this.screen.unlock();
      this.popup.showAlert("alerts.error", error, [{ text: 'general.ok', role: 'general.cancel' }], this.selectedTheme);
      console.error(error);
      this.zone.run(() => {
        this.frontLoading = false;
        this.backLoading = false;
      });
    }, options);
  }



  private handleImageSaving(type, folder, name, data, shouldRecognize, captureType) {
    this.zone.run(() => {
      this.setValue(type, folder + "/" + name);
      data.dataUrl = folder + "/" + name;
      this.frontLoading = false;
      this.backLoading = false;

      if (captureType == 1) {
            this.saveImageToGallery(type);
        // });
      }

      if (shouldRecognize && type == this.FRONT) {
      }
    });
  }

  private saveImageToGallery(type) {
    let imageFullPath = type == this.FRONT ? this.currentVal.front : this.currentVal.back;

    let imageName = imageFullPath.split('/').pop();
    let imagePath = this.imagesFolder() + "/" + imageName;

    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.saveImage(imagePath, 'GoCapture BC');
    });
  }


  setValue(type, newPath) {
    if (type == this.FRONT) {
      this.currentVal.front = newPath;
      this.theVal.front = this.util.adjustImagePath(this.currentVal.front);
    } else {
      this.currentVal.back = newPath;
      this.theVal.back = this.util.adjustImagePath(this.currentVal.back);
    }
    var v = {
      front: null,
      back: null
    };
    if (this.currentVal.front && this.currentVal.front != this.front) {
      v.front = this.currentVal.front;
    }
    if (this.currentVal.back && this.currentVal.back != this.back) {
      v.back = this.currentVal.back;
    }
    this.propagateChange(v);
  }

  onImageLoaded(event, front) {
    if (front) {
      this.frontLoading = false;
    } else {
      this.backLoading = false;
    }
  }



  writeValue(obj: any): void {
    if (!obj) {
      this.currentVal = {
        front: this.front,
        back: this.back
      };
    } else {
      this.currentVal = JSON.parse(JSON.stringify(obj));
      if (!this.currentVal.front) {
        this.currentVal.front = this.front;
      }
      if (!this.currentVal.back) {
        this.currentVal.back = this.back;
      }
    }
  }

  private viewImage(type) {
    //const imageViewer = this.imageViewerCtrl.create((type == this.FRONT ? this.frontImage : this.backImage).nativeElement);
    //imageViewer.present();
    let imageFullPath = type == this.FRONT ? this.currentVal.front : this.currentVal.back;

    let imageName = imageFullPath.split('/').pop();
    let imagePath = this.imagesFolder() + "/" + imageName;

    if (this.platform.is("windows")) {
      this.modalCtrl.create(ImageViewer, { image: imagePath }).present();
    } else {
      this.photoViewer.show(imagePath);
    }
  }

  private normalizeURL(url: string): string {
    return this.util.normalizeURL(url);
  }

  private adjustImagePath(path) {
    return path.replace(/\?.*/, "") + "#" + parseInt(((1 + Math.random()) * 1000) + "")
  }

  private destinationType() {
    return this.platform.is("android") ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.DATA_URL;
  }

  public async startCamera(type: number) {

    // await this.screen.lock(this.screen.ORIENTATIONS.PORTRAIT);

    let width = Math.min(screen.width, screen.height);
    let height = Math.max(screen.width, screen.height);

    let cameraPreviewOpts = {
      x: 0,
      y: 0,
      width: width,
      height: height,
      camera: 'rear',
      tapPhoto: false,
      previewDrag: false,
      toBack: false,
      alpha: 1,
      tapFocus: true
    };

    let self = this;

    this.frontLoading = type == this.FRONT;
    this.backLoading = type != this.FRONT;
    this.onProcessingEvent.emit('true');

    CameraPreview.startCamera(cameraPreviewOpts, (result) => {

      let imageData = result["picture"];

      if (imageData) {
        self.screen.unlock();
        self.onProcessingEvent.emit('false');

        imageData = 'data:image/jpg;base64,' + imageData;

        let crop = {
          x: 0,
          y: 150,
          width: cameraPreviewOpts.width,
          height: cameraPreviewOpts.width / 1.75
        };


      } else if (result["cameraBack"]) {
        self.frontLoading = false;
        self.backLoading = false;
        self.screen.unlock();
        self.onProcessingEvent.emit('false');
      }
    }, function (error) {
      self.onProcessingEvent.emit('false');
      self.screen.unlock();
      console.log(error);
      self.popup.showAlert('alerts.error', error, [{role:'cancel',text:'general.cancel'}]);
      self.frontLoading = false;
      self.backLoading = false;
    });
  }

  private imagesFolder(): string {
    return this.fileService.dataDirectory + "leadliaison/images";
  }

}
