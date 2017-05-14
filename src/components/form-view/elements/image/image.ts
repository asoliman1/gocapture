import { Component, Input, Output, forwardRef } from '@angular/core';
import { Form, FormElement } from "../../../../model";
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseElement } from "../base-element";
import { ActionSheetController } from "ionic-angular";
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
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

	constructor(private fb: FormBuilder,
		private actionCtrl: ActionSheetController,
		private camera: Camera) {
		super();
		this.currentValue = [];
		/*setTimeout(()=>{
			this.currentValue = ["http://www.w3schools.com/css/img_fjords.jpg", "http://www.w3schools.com/css/img_fjords.jpg", "http://www.w3schools.com/css/img_fjords.jpg"];
		}, 1000);*/
	}

	chooseType() {
		if(this.readonly){
			return;
		}
		if(this.selectionEnabled){
			for(let i = this.selection.length - 1; i > -1; i--){
				if(this.selection[i]){
					(<any[]>this.currentValue).splice(i, 1);
				}
			}
			this.propagateChange(this.currentValue);
			this.selection = [];
			this.selectionEnabled = false;
			return;
		}

		if (this.currentValue.length >= this.max) {
			return;
		}

		let onImageReceived = (imageData) => {
			//console.log(imageData);
			if (!this.currentValue) {
				this.currentValue = [];
			}
			this.moveFile(imageData, cordova.file.dataDirectory + "leadliaison/images").subscribe((newPath) => {
				this.currentValue.unshift(newPath);
				this.propagateChange(this.currentValue);
			})
		};
		let camera = this.camera;
		let sheet = this.actionCtrl.create({
			title: "",
			buttons: [
				{
					text: 'Use Camera',
					handler: () => {
						camera.getPicture({
							sourceType: 1
						}).then(onImageReceived)
							.catch(err => {
								//hmmm, what to do
								console.error(err);
							});
					}
				},
				{
					text: 'Choose from Album',
					handler: () => {
						camera.getPicture({
							sourceType: 0
						}).then(onImageReceived)
							.catch(err => {
								//hmmm, what to do
								console.error(err);
							});
					}
				},
				{
					text: 'Cancel',
					role: 'cancel'
				}
			]
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
			this.currentValue = [];
		}else{
			this.currentValue = obj;
		}
	}
}