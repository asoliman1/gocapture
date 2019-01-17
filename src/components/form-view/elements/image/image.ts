import { Component, Input, forwardRef, NgZone } from '@angular/core';
import { FormElement } from "../../../../model";
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseElement } from "../base-element";
import { Camera } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { normalizeURL } from 'ionic-angular/util/util';
import { Platform } from 'ionic-angular/platform/platform';
import {Util} from "../../../../util/util";
import {ImageProcessor} from "../../../../services/image-processor";
import {ThemeProvider} from "../../../../providers/theme/theme";
declare var cordova: any;

@Component({
	selector: 'image',
	templateUrl: 'image.html',
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Image), multi: true }
	]
})
export class Image extends BaseElement {
	@Input() element: FormElement;
	@Input() formGroup: FormGroup;
	@Input() readonly: boolean = false;

	images = {
		true: "trash",
		false: "images"
	};

	colors = {
		true: "danger",
		false: "dark"
	};

	selectionEnabled: any = false;
	selection: any[] = [];

	max = 5;

  private selectedTheme;

	constructor(private fb: FormBuilder,
				private actionCtrl: ActionSheetController,
				private camera: Camera,
				private platform: Platform,
				private zone: NgZone,
        public util: Util,
        private imageProc: ImageProcessor,
        private themeProvider: ThemeProvider) {
		super();
		this.currentVal = [];
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
	}

	chooseType() {
		if(this.readonly){
			return;
		}
		if(this.selectionEnabled){
			for(let i = this.selection.length - 1; i > -1; i--){
				if(this.selection[i]){
					(<any[]>this.currentVal).splice(i, 1);
				}
			}
			this.propagateChange(this.currentVal);
			this.selection = [];
			this.selectionEnabled = false;
			return;
		}

		if (this.currentVal.length >= this.max) {
			return;
		}

    let camera = this.camera;
		let sheet = this.actionCtrl.create({
			title: "",
			buttons: [
				{
					text: 'Use Camera',
					handler: () => {
						camera.getPicture({
							sourceType: 1,
							encodingType: this.camera.EncodingType.JPEG,
							targetWidth: 1280,
							targetHeight:1000,
              destinationType: this.destinationType()
						}).then((imageData) => {
						  this.onImageReceived(imageData);
            })
							.catch(err => {
								console.error(err);
							});
					}
				},
				{
					text: 'Choose from Album',
					handler: () => {
						camera.getPicture({
							sourceType: 0,
							encodingType: this.camera.EncodingType.JPEG,
							targetWidth: 1280,
							targetHeight:1000,
							destinationType: this.destinationType()
						}).then((imageData) => {
              this.onImageReceived(imageData);
            })
							.catch(err => {
								console.error(err);
							});
					}
				},
				{
					text: 'Cancel',
					role: 'cancel'
				}
			],
      cssClass: this.selectedTheme.toString()
		});
		sheet.present();
	}

	toggleSelection(index : number){
		if(this.readonly){
			return;
		}
		this.selection[index] = !this.selection[index];
		this.selectionEnabled = false;
		for(let i = 0; i < this.selection.length; i++){
			if(!!this.selection[i]){
				this.selectionEnabled = true;
				break;
			}
		}
	}

	writeValue(obj: any):void{
		if(!obj){
			this.currentVal = [];
		}else{
			this.currentVal = obj;
		}
	}

	public  normalizeURL(url: string): string{
		return this.util.normalizeURL(url);
	}

  private imageUrl(path) {

    let folder = this.file.dataDirectory + "leadliaison/images";
    let name = path.substr(path.lastIndexOf("/") + 1);
    let url = folder + "/" + name;
    return this.normalizeURL(url);
  }

  private destinationType() {
	  return this.platform.is("android") ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.DATA_URL;
  }

  private onImageReceived(imageData) {
    if (!this.currentVal) {
      this.currentVal = [];
    }

    let t = this;

    if (this.platform.is('android')) {

      this.util.moveFile(imageData, cordova.file.dataDirectory + "leadliaison/images", true).subscribe((newPath) => {

        t.zone.run(()=>{
          t.currentVal.unshift(newPath);
          t.propagateChange(t.currentVal);
        });
      }, (err) => {
        console.error(err);
      })
    } else {
      imageData = 'data:image/jpeg;base64,' + imageData;

      let newFolder = this.file.dataDirectory + "leadliaison/images";
      let newName = new Date().getTime() + '.jpeg';

      t.writeFile(newFolder, newName, this.imageProc.dataURItoBlob(imageData)).subscribe((newPath) => {
        if (t.checkFileExistAtPath(newPath)) {
          console.log('File at path - ' + newPath + ' exists');
          t.zone.run(()=>{
            t.currentVal.unshift(newPath);
            t.propagateChange(t.currentVal);
          });
        } else {
          console.error('File doesn\'t exist at path - ' + newPath);
        }
      }, (err) => {
        console.error(err);
      });
    }
  }
}
