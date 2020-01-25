import { formViewService } from './../../form-view-service';
import { Subscription } from 'rxjs/Subscription';
import { Device } from '@ionic-native/device';
import { Component, Input, forwardRef, NgZone, ViewChild, OnDestroy } from '@angular/core';
import { ImageProcessor, Info } from "../../../../services/image-processor";
import { BaseElement } from "../base-element";
import { OcrSelector } from "../../../ocr-selector";
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
import { SettingsService } from "../../../../services/settings-service";
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
  private needCrop = false;

  constructor(private actionCtrl: ActionSheetController,
    private camera: Camera,
    private device: Device,
    private zone: NgZone,
    private platform: Platform,
    private modalCtrl: ModalController,
    private imageProc: ImageProcessor,
    public fileService: File,
    public util: Util,
    private themeProvider: ThemeProvider,
    private popup: Popup,
    private photoViewer: PhotoViewer,
    private photoLibrary: PhotoLibrary,
    private settingsService: SettingsService,
    private formViewService : formViewService,
    private screen: ScreenOrientation) {

    super();

    this.initImages();

    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);

    this.settingsService.getSetting(settingsKeys.AUTO_CROP).subscribe((data) => {
      if (data) {
        this.needCrop = JSON.parse(data)
      }
    })
  }

  // picture options
  private pictureOpts = {
    width: this.platform.width(),
    height: this.platform.height(),
    quality: 100
  };

  ngAfterContentInit() {
    this.theVal = {
      front: this.currentVal.front,
      back: this.currentVal.back
    };
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

          this.photoLibrary.requestAuthorization().then(() => {
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

    await this.screen.lock(this.screen.ORIENTATIONS.PORTRAIT);

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

      this.saveData({ dataUrl: imageData }, type, shouldRecognize, captureType);

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

  private saveData(data, type, shouldRecognize, captureType) {

    let newFolder = this.fileService.dataDirectory + "leadliaison/images";
    let newName = new Date().getTime() + '.jpg';
    let promise = this.fileService.writeFile(newFolder, newName, this.imageProc.dataURItoBlob(data.dataUrl));

    promise.then((entry) => {
      console.log('Image was saved with success');
      this.handleImageSaving(type, newFolder, newName, data, shouldRecognize, captureType);
    },
      (err) => {
        console.error(err);
        this.zone.run(() => {
          this.frontLoading = false;
          this.backLoading = false;
        });
      });
  }

  private handleImageSaving(type, folder, name, data, shouldRecognize, captureType) {
    this.zone.run(() => {
      this.setValue(type, folder + "/" + name);
      data.dataUrl = folder + "/" + name;
      this.frontLoading = false;
      this.backLoading = false;

      if (captureType == 1) {
        this.settingsService.getSetting(settingsKeys.AUTOSAVE_BC_CAPTURES).subscribe((result) => {
          if (String(result) == "true") {
            this.saveImageToGallery(type);
          }
        });
      }

      if (shouldRecognize && type == this.FRONT) {
        this.recognizeText(data);
      }
    });
  }

  private saveImageToGallery(type) {
    let imageFullPath = type == this.FRONT ? this.currentVal.front : this.currentVal.back;

    let imageName = imageFullPath.split('/').pop();
    let imagePath = this.imagesFolder() + "/" + imageName;

    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.saveImage(imagePath, 'Captello BC');
    });
  }

  recognizeText(info: Info) {
    let modal = this.modalCtrl.create(OcrSelector, { imageInfo: info, form: this.form, submission: this.submission });
    modal.onDidDismiss((changedValues) => {
      //this.currentVal.front = this.currentVal.front + "?" + parseInt(((1 + Math.random())*1000) + "");
      // this.screen.unlock && this.screen.unlock();
      if (changedValues) {
        var vals = {};
        for (let id in this.formGroup.controls) {
          if (this.formGroup.controls[id]["controls"]) {
            vals[id] = {};
            for (let subid in this.formGroup.controls[id]["controls"]) {
              vals[id][subid] = this.formGroup.controls[id]["controls"][subid].value;
            }
          } else {
            vals[id] = this.formGroup.controls[id].value;
          }
        }
        let ctrl: AbstractControl = null;
        for (var id in changedValues) {
          let match = /(\w+\_\d+)\_\d+/g.exec(id);
          if (match && match.length > 0) {
            if (!vals[match[1]]) {
              vals[match[1]] = {};
            }
            vals[match[1]][id] = changedValues[id];
            ctrl = this.formGroup.get(match[1]).get(id);
            ctrl.markAsTouched();
            ctrl.markAsDirty();
          } else {
            vals[id] = changedValues[id];
            ctrl = this.formGroup.get(id);
            ctrl.markAsTouched();
            ctrl.markAsDirty();
          }
        }
        this.formGroup.setValue(vals);
      }
    });
    modal.present();
    //screen.orientation.lock && screen.orientation.lock("landscape");
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

  flip(type) {
    let image = "";
    if (type == this.FRONT) {
      image = this.currentVal.front;
    } else {
      image = this.currentVal.back;
    }
    let z = this.zone;
    let t = this;
    this.imageProc.flip(this.normalizeURL(image)).subscribe(info => {
      let name = image.substr(image.lastIndexOf("/") + 1).replace(/\?.*/, "");
      let folder = image.substr(0, image.lastIndexOf("/"));
      this.fileService.writeFile(folder, name, this.imageProc.dataURItoBlob(info.dataUrl), { replace: true }).then((entry) => {
        z.run(() => {
          t.setValue(type, folder + "/" + name);
          if (type == this.FRONT) {
            this.theVal.front = this.adjustImagePath(this.currentVal.front);
          } else {
            this.theVal.back = this.adjustImagePath(this.currentVal.back);
          }
        });
      });
    });
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

    await this.screen.lock(this.screen.ORIENTATIONS.PORTRAIT);

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

        self.imageProc.crop(imageData, crop).subscribe(data => {

          let shouldRecognize = self.element.is_scan_cards_and_prefill_form == 1;

          let newFolder = self.file.dataDirectory + "leadliaison/images";
          let newName = new Date().getTime() + '.jpg';

          let blob = self.imageProc.dataURItoBlob(data.dataUrl);
          self.file.writeFile(newFolder, newName, blob).then((entry) => {
            console.log(JSON.stringify(entry));

            self.handleImageSaving(type, newFolder, newName, data, shouldRecognize, 1);
          },
            (err) => {
              console.error(err);
            });
        });
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
