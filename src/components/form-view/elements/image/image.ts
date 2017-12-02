import { Component, Input, forwardRef } from '@angular/core';
import { FormElement } from "../../../../model";
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseElement } from "../base-element";
import { ActionSheetController } from "ionic-angular";
import { Camera } from '@ionic-native/camera';
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
		this.currentVal = [];
		/*setTimeout(()=>{
			this.currentVal = ["http://www.w3schools.com/css/img_fjords.jpg", "http://www.w3schools.com/css/img_fjords.jpg", "http://www.w3schools.com/css/img_fjords.jpg"];
		}, 1000);*/
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

		let onImageReceived = (imageData) => {
			//console.log(imageData);
			if (!this.currentVal) {
				this.currentVal = [];
			}
			let t = this;
			if(imageData.indexOf("content://") == 0 && window["FilePath"]){
				window["FilePath"].resolveNativePath(imageData, (path) => {
					t.moveFile(path, cordova.file.dataDirectory + "leadliaison/images").subscribe((newPath) => {
						t.currentVal.unshift(newPath);
						t.propagateChange(t.currentVal);
					}, (err) => {
						console.error(err);
					})
				}, (err)=> {
					console.error(err);
				});
			}else{
				this.moveFile(imageData, cordova.file.dataDirectory + "leadliaison/images").subscribe((newPath) => {
					this.currentVal.unshift(newPath);
					this.propagateChange(this.currentVal);
				}, (err) => {
					console.error(err);
				})
			}
		};
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
							targetHeight:1000
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
							sourceType: 0,
							encodingType: this.camera.EncodingType.JPEG,
							targetWidth: 1280,
							targetHeight:1000,
							destinationType: 2
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
			this.currentVal = [];
		}else{
			this.currentVal = obj;
		}
	}
}