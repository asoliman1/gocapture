import { Component, Input, forwardRef } from '@angular/core';
import { FormElement } from "../../../../model";
import { SignatureModal} from "./signature.modal";
import { BaseElement } from "../base-element";
import { FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { File } from '@ionic-native/file';
import {Util} from "../../../../util/util";
import {ImageProcessor} from "../../../../services/image-processor";

declare var screen;

@Component({
	selector: 'signature',
	templateUrl: 'signature.html',
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Signature), multi: true }
	]
})
export class Signature extends BaseElement{

	@Input() element: FormElement;
	@Input() formGroup: FormGroup;
	@Input() readonly: boolean = false;

	constructor(private modalCtrl: ModalController,
              private screen: ScreenOrientation,
              public file: File,
              public util: Util,
              private fileService: File,
              private imageProc: ImageProcessor) {
		super();
	}

	imageUrl() {
	  if (this.currentVal.startsWith("data:image")) {
	    return this.currentVal;
    }
    let folder = this.file.dataDirectory + "leadliaison/images";
    let name = this.currentVal.substr(this.currentVal.lastIndexOf("/") + 1);
    let url = folder + "/" + name;
    return this.util.normalizeURL(url);
  }

	show() {
		if(this.readonly) {
			return;
		}
		let modal = this.modalCtrl.create(SignatureModal);
		modal.onDidDismiss(async (sigStr) => {
			this.screen.unlock();

			if (sigStr) {
			  try {
          let entry =  await this.saveData(sigStr);
          console.log("Signature was saved with success");
          this.onChange(entry.nativeURL);
        } catch (e) {
          console.error(e);
        }
			}
		});
		modal.present();
		this.screen.lock(this.screen.ORIENTATIONS.LANDSCAPE);
	}


  private saveData(data) {

    let newFolder = this.fileService.dataDirectory + "leadliaison/images";

    let newName = "sig" + new Date().getTime() + '.jpg';
    return this.fileService.writeFile(newFolder, newName, this.imageProc.dataURItoBlob(data));
  }
}
