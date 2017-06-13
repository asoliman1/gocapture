import { Component, Input, forwardRef } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from "ionic-angular";
import { ImageProcessor, Info } from "../../../../services/image-processor";
import { BaseElement } from "../base-element";
import { OcrSelector } from "../../../ocr-selector";
import { FormElement, Form, FormSubmission } from "../../../../model";
import { FormGroup, NG_VALUE_ACCESSOR, AbstractControl } from "@angular/forms";
import { Camera } from "@ionic-native/camera";
declare var cordova: any;
declare var screen;

@Component({
	selector: 'business-card',
	templateUrl: 'business-card.html',
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BusinessCard), multi: true }
	]
})
export class BusinessCard extends BaseElement {

	@Input() element: FormElement;
	@Input() formGroup: FormGroup;
	@Input() readonly: boolean = false;
	
	@Input() form: Form;	
	@Input() submission: FormSubmission;

	front: string = "assets/images/business-card-front.svg";
	back: string = "assets/images/business-card-back.svg";

	backLoading: boolean = false;
	frontLoading: boolean = false;

	FRONT: number = 0;
	BACK: number = 1;

	constructor(private actionCtrl: ActionSheetController,
				private alertCtrl: AlertController,
				private camera: Camera,
				private modalCtrl: ModalController,
				private imageProc: ImageProcessor) {
		super();
		this.currentVal = {
			front: this.front,
			back: this.back
		};
	}

	captureImage(type: number) {
		if(this.readonly){
			return;
		}
		if ((type == this.FRONT && this.currentVal.front != this.front) ||
				(type == this.BACK && this.currentVal.back != this.back)) {
			let sheet = this.actionCtrl.create({
				title: "",
				buttons: [
					{
						text: 'Remove',
          				role: 'destructive',
						handler: () => {
							if(type == this.FRONT){
								this.currentVal.front = this.front;
							}else{
								this.currentVal.back = this.back;
							}
						}
					},
					{
						text: 'Camera',
						handler: () => {
							this.doCapture(type, 1);
						}
					},
					{
						text: 'Choose from Library',
						handler: () => {
							this.doCapture(type, 2);
						}
					},
					{
						text: 'Cancel',
						role: 'cancel'
					}
				]
			});
			sheet.present();
		}else{
			this.doCapture(type);
		}
	}

	private doCapture(type: number, captureType: number = 1) {
		this.camera.getPicture({
			sourceType: captureType,
			correctOrientation: true,
			encodingType: this.camera.EncodingType.JPEG,
			targetWidth: 1280,
			targetHeight:1000
		}).then(imageData => {
			if(type == this.FRONT){
				this.frontLoading = true;
			}else{
				this.backLoading = true;
			}
			this.imageProc.ensureLandscape(imageData, this.element.is_scan_cards_and_prefill_form == 1).subscribe((info) => {
				let newFolder = cordova.file.dataDirectory + "leadliaison/images";
				let name = imageData.substr(imageData.lastIndexOf("/") + 1);
				let folder = imageData.substr(0, imageData.lastIndexOf("/"));
				this.file.moveFile(folder, name, newFolder, name).then((entry)=>{
					this.setValue(type, newFolder + "/" + name);
					info.dataUrl = newFolder + "/" + name;
					
					if(this.element.is_scan_cards_and_prefill_form == 1 && type == this.FRONT){
						this.recognizeText(info);
					}
				},
				(err) => {
					console.error(err);
				});
			});
		}).catch(err => {
			console.error(err);
		});
	}

	recognizeText(info: Info){
		let modal = this.modalCtrl.create(OcrSelector, {imageInfo:info, form: this.form, submission: this.submission});
		modal.onDidDismiss((changedValues) => {
			screen.orientation.unlock && screen.orientation.unlock();
			if(changedValues){
				var vals = {};
				for(let id in this.formGroup.controls){
					if(this.formGroup.controls[id]["controls"]){
						vals[id] = {};
						for(let subid in this.formGroup.controls[id]["controls"]){
							vals[id][subid] = this.formGroup.controls[id]["controls"][subid].value;
						}
					}else{
						vals[id] = this.formGroup.controls[id].value;
					}
				}
				let ctrl: AbstractControl = null;
				for(var id in changedValues){
					let match = /(\w+\_\d+)\_\d+/g.exec(id);
					if(match && match.length > 0){
						if(!vals[match[1]]){
							vals[match[1]] = {};
						}
						vals[match[1]][id] = changedValues[id];
						ctrl = this.formGroup.get(match[1]).get(id);
						ctrl.markAsTouched();
						ctrl.markAsDirty();
					}else{
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
		screen.orientation.lock && screen.orientation.lock("landscape");
	}

	setValue(type, newPath){
		if (type == this.FRONT) {
			this.currentVal.front = newPath;
		} else {
			this.currentVal.back = newPath;
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
		if(front){
			this.frontLoading = false;
		}else{
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
}