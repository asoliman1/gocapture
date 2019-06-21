import { Injectable } from "@angular/core";
import {FormElement} from "../model";
import {RapidCapture} from "./rapid-capture-service";
import {ImageProcessor} from "./image-processor";
import {File} from "@ionic-native/file";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {Platform} from "ionic-angular";
import {Camera} from "@ionic-native/camera";

@Injectable()

export class BCRapidCapture implements RapidCapture {
	constructor(private imageProc: ImageProcessor,
              public fileService: File,
              private platform: Platform,
              private camera: Camera) {
	  //
	}

  capture(element: FormElement): Promise<string[]> {

    return new Promise<string[]>((resolve, reject) => {
      let width = Math.min(this.platform.width(), this.platform.height());

      let options = {
        sourceType: 1,
        correctOrientation: true,
        saveToPhotoAlbum: false,
        encodingType: this.camera.EncodingType.JPEG,
        targetWidth: 1000,
        targetHeight:1000,
        destinationType: this.destinationType(),
        shouldDisplayOverlay: true,
        previewPositionX: 12,
        previewPositionY: 150,
        previewWidth: width - 24,
        previewHeight: (width - 24) / 1.75,
        quality: 100,
        needCrop: true,
        isRapidScan: true
      };

      (<any>navigator).camera.getPicture((imageData) => {
        this.handleRapidScanSubmit(imageData).then((paths) => {
          resolve(paths);
        });
      }, (error) => {
        console.error(error);
        reject(error);
      }, options);
    });
  }

  private handleRapidScanSubmit(data): Promise<string[]> {
    let promises = [];
    for (let item of data) {
      let imageItemData = 'data:image/jpg;base64,' + item;
      promises.push(this.saveFileLocally({dataUrl: imageItemData}));
    }
    return Promise.all(promises);
  }

  private saveFileLocally(data) {
    let newFolder = this.fileService.dataDirectory + "leadliaison/images";
    let newName = new Date().getTime() + '.jpg';
    return this.fileService.writeFile(newFolder, newName, this.imageProc.dataURItoBlob(data.dataUrl));
  }

  private destinationType() {
    return this.platform.is("android") ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.DATA_URL;
  }

}
