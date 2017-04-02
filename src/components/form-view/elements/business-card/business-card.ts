import { Component, Input, forwardRef } from '@angular/core';
import { ActionSheetController, AlertController } from "ionic-angular";
import { Observable, Observer } from "rxjs/Rx"
import { BaseElement } from "../base-element";
import { FormElement } from "../../../../model";
import { FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Camera } from "@ionic-native/camera";
import { File } from "@ionic-native/file";
declare var cordova: any;

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

	front: string = "assets/images/business-card-front.svg";
	back: string = "assets/images/business-card-back.svg";

	backLoading: boolean = false;
	frontLoading: boolean = false;

	FRONT: number = 0;
	BACK: number = 1;

	constructor(private actionCtrl: ActionSheetController,
				private alertCtrl: AlertController,
				private camera: Camera) {
		super();
		this.currentValue = {
			front: this.front,
			back: this.back
		};
	}

	captureImage(type: number) {
		if(this.readonly){
			return;
		}
		if ((type == this.FRONT && this.currentValue.front != this.front) ||
				(type == this.BACK && this.currentValue.back != this.back)) {
			let sheet = this.actionCtrl.create({
				title: "",
				buttons: [
					{
						text: 'Remove',
          				role: 'destructive',
						handler: () => {
							if(type == this.FRONT){
								this.currentValue.front = this.front;
							}else{
								this.currentValue.back = this.back;
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
			let ctrl = this.alertCtrl;
			this.ensureLandscape(imageData).subscribe((data) => {
				let newFolder = cordova.file.dataDirectory + "leadliaison/images";
				if (data != imageData) {
					let name = imageData.substr(imageData.lastIndexOf("/") + 1);
					let folder = imageData.substr(0, imageData.lastIndexOf("/"));
					this.file.writeFile(newFolder, name, this.dataURItoBlob(data), { replace: true }).then(() => {
						this.setValue(type, newFolder + "/" + name);
					},
						(err) => {
							console.error(err);
						});
				} else {
					doMove(imageData);
				}
				setTimeout(()=>{
					window["TesseractPlugin"] && TesseractPlugin.recognizeText(data.split("base64,")[1], "eng", function(recognizedText) {
						let alert = ctrl.create({
							title: "Tesseract OCR",
							message: "<pre>" + recognizedText + "</pre>"
						});
						alert.present();
					}, function(reason) {
						console.error( reason);
					});
				}, 250);
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

	setValue(type, newPath){
		if (type == this.FRONT) {
			this.currentValue.front = newPath;
		} else {
			this.currentValue.back = newPath;
		}
		var v = {
			front: null,
			back: null
		};
		if (this.currentValue.front && this.currentValue.front != this.front) {
			v.front = this.currentValue.front;
		}
		if (this.currentValue.back && this.currentValue.back != this.back) {
			v.back = this.currentValue.back;
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

	ensureLandscape(url: string): Observable<string> {
		return new Observable<string>((obs: Observer<string>) => {
			var image: any = document.createElement("img");
			image.onload = function (event: any) {
				if (image.naturalWidth >= image.naturalHeight) {
					var canvas: any = document.createElement("canvas");
					canvas.width = image.naturalWidth;
					canvas.height = image.naturalHeight;
					var ctx = canvas.getContext('2d');
					ctx.translate(canvas.width / 2, canvas.height / 2);
					ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
					obs.next(canvas.toDataURL());
					obs.complete();
					return;
				}
				var canvas : any = document.createElement("canvas");
				canvas.width = image.naturalHeight;
				canvas.height = image.naturalWidth;
				var ctx = canvas.getContext('2d');
				ctx.translate(canvas.width / 2, canvas.height / 2);
				ctx.rotate(Math.PI / 2);
				ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
				obs.next(canvas.toDataURL());
				obs.complete();
			};
			image.src = url;
		});
	}

	dataURItoBlob(dataURI: string): Blob {
		var arr = dataURI.split(',');
		var byteString = atob(arr[1]);
		var mimeString = arr[0].split(':')[1].split(';')[0]

		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		var blob = new Blob([ab], { type: mimeString });
		return blob;
	}

	writeValue(obj: any): void {
		if (!obj) {
			this.currentValue = {
				front: this.front,
				back: this.back
			};
		} else {
			this.currentValue = obj;
			if (!this.currentValue.front) {
				this.currentValue.front = this.front;
			}
			if (!this.currentValue.back) {
				this.currentValue.back = this.back;
			}
		}
	}
}