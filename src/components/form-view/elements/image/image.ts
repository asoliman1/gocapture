import { Component, Input, forwardRef, NgZone } from '@angular/core';
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
				private camera: Camera,
				private zone: NgZone) {
		super();
		this.currentVal = [];
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
			if (!this.currentVal) {
				this.currentVal = [];
			}
			let t = this;
			//TODO find a more generic way of handling file move/copy
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
			}else if(imageData.indexOf("assets-library://") == 0){
				let t = this;
				window["resolveLocalFileSystemURL"](imageData, (fileEntry) => {
					fileEntry.file((file) => {
						var reader = new FileReader();
						reader.onloadend = (event) => {
							console.log((<any>event.target).result);
							let blob = new Blob([(<any>event.target).result], {type: file.type});
							t.writeFile(cordova.file.dataDirectory + "leadliaison/images", file.name, blob).subscribe((newPath) => {
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
						};
						console.log('Reading file: ' + file.name);
						reader.readAsArrayBuffer(file);
					});
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
