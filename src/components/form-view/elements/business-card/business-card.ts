import { Component, Input, forwardRef } from '@angular/core';
import { Observable, Observer, BehaviorSubject, Subscription } from "rxjs/Rx"
import { BaseElement } from "../base-element";
import { FormElement } from "../../../../model";
import { FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Camera, File } from "ionic-native";
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

	front: string = "assets/images/business-card-front.svg";
	back: string = "assets/images/business-card-back.svg";

	FRONT: number = 0;
	BACK: number = 1;

	constructor() {
		super();
		this.currentValue = {
			front: this.front,
			back: this.back
		};
	}

	captureImage(type: number) {
		Camera.getPicture({
			sourceType: 1
		}).then(imageData => {
			this.ensureLandscape(imageData).subscribe((data) => {
				if (data != imageData) {
					let name = imageData.substr(imageData.lastIndexOf("/") + 1);
					let folder = imageData.substr(0, imageData.lastIndexOf("/"));
					console.log(name, folder);
					File.writeFile(folder, name, this.dataURItoBlob(data), {replace: true}).then(() => {
						doMove(imageData);
					},
					(err) => {
						console.error(err);
					});
				}else{
					doMove(imageData);
				}
			});
			var doMove = (imageData) => {
				this.moveFile(imageData, cordova.file.dataDirectory + "leadliaison/images").subscribe((newPath) => {
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
				})
			};
			
		}).catch(err => {

		});
	}

	onImageLoaded(event) {
		/*if (event.currentTarget.naturalWidth < event.currentTarget.naturalHeight) {
			event.currentTarget.className = "rotateright";
		} else {
			event.currentTarget.className = "";
		}*/
	}

	ensureLandscape(url: string): Observable<string> {
		return new Observable<string>((obs: Observer<string>) => {
			var image = document.createElement("img");
			image.onload = function (event: any) {
				if (image.naturalWidth >= image.naturalHeight) {
					obs.next(url);
					obs.complete();
					return;
				}
				var canvas = document.createElement("canvas");
				canvas.width = image.naturalHeight;
				canvas.height = image.naturalWidth;
				var ctx = canvas.getContext('2d');
				ctx.translate(canvas.width/2, canvas.height/2);
				ctx.rotate(Math.PI / 2);
				ctx.drawImage(image, -image.naturalWidth/2, -image.naturalHeight/2);
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