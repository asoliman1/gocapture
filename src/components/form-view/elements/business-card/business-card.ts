import { Component, Input, forwardRef } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from "ionic-angular";
import { ImageProcessor, Info } from "../../../../services/image-processor";
import { BaseElement } from "../base-element";
import { OcrSelector } from "../../../ocr-selector";
import { FormElement, Form, FormSubmission } from "../../../../model";
import { FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
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
						text: 'Choose from Camera',
						handler: () => {
							this.doCapture(type);
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

	private doCapture(type: number) {
		this.camera.getPicture({
			sourceType: 1
		}).then(imageData => {
			if(type == this.FRONT){
				this.frontLoading = true;
			}else{
				this.backLoading = true;
			}
			this.imageProc.ensureLandscape(imageData, this.element.is_scan_cards_and_prefill_form == 1).subscribe((info) => {
				let newFolder = cordova.file.dataDirectory + "leadliaison/images";
				if (info.dataUrl != imageData) {
					let name = imageData.substr(imageData.lastIndexOf("/") + 1);
					this.file.writeFile(newFolder, name, this.imageProc.dataURItoBlob(info.dataUrl), { replace: true }).then(() => {
						this.setValue(type, newFolder + "/" + name);
					},
						(err) => {
							console.error(err);
						});
				} else {
					doMove(imageData);
				}
				if(this.element.is_scan_cards_and_prefill_form == 1){
					this.recognizeText(info);
				}
			});
			var doMove = (imageData) => {
				this.moveFile(imageData, cordova.file.dataDirectory + "leadliaison/images").subscribe((newPath) => {
					this.setValue(type, newPath);
				})
			};

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
				for(var id in changedValues){
					let match = /(\w+\_\d+)\_\d+/g.exec(id);
					if(match && match.length > 0){
						if(!vals[match[1]]){
							vals[match[1]] = {};
						}
						vals[match[1]][id] = changedValues[id];
					}else{
						vals[id] = changedValues[id];
					}
				}
				this.formGroup.setValue(vals);
			}
		});
		modal.present();
		screen.orientation.lock && screen.orientation.lock('landscape');		
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