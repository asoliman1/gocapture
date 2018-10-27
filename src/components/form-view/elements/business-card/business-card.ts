import { Device } from '@ionic-native/device';
import { Component, Input, forwardRef, NgZone, ViewChild } from '@angular/core';
import { ImageProcessor, Info } from "../../../../services/image-processor";
import { BaseElement } from "../base-element";
import { OcrSelector } from "../../../ocr-selector";
import { FormElement, Form, FormSubmission } from "../../../../model";
import { FormGroup, NG_VALUE_ACCESSOR, AbstractControl } from "@angular/forms";
import { Camera } from "@ionic-native/camera";

import { ImageViewer } from "./image-viewer";
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { Platform } from 'ionic-angular/platform/platform';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { File } from '@ionic-native/file';
import { Util } from "../../../../util/util";
import { DomSanitizer } from '@angular/platform-browser';

declare var screen;

@Component({
	selector: 'business-card',
	templateUrl: 'business-card.html',
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BusinessCard), multi: true }
	]
})
export class BusinessCard extends BaseElement {

	@ViewChild("frontImage")
	private frontImage: any;

	@ViewChild("backImage")
	private backImage: any;

	@Input() element: FormElement;
	@Input() formGroup: FormGroup;
	@Input() readonly: boolean = false;

	@Input() form: Form;
	@Input() submission: FormSubmission;

	front: string = "assets/images/business-card-front.svg";
	back: string = "assets/images/business-card-back.svg";

	backLoading: boolean = false;
	frontLoading: boolean = false;

	theVal: any;

	FRONT: number = 0;
	BACK: number = 1;

	constructor(private actionCtrl: ActionSheetController,
		private camera: Camera,
		private device: Device,
		private zone: NgZone,
		private platform: Platform,
		private modalCtrl: ModalController,
		private imageProc: ImageProcessor,
		public file: File,
		public util: Util,
		private dom: DomSanitizer) {
		super();
		this.currentVal = {
			front: this.front,
			back: this.back
		};

		this.theVal = {
			front: this.front,
			back: this.back
		};
	}

	ngAfterContentInit() {
		this.theVal = {
			front: this.util.imageUrl(this.currentVal.front),
			back: this.util.imageUrl(this.currentVal.back)
		};
	}

	captureImage(type: number) {
		if (this.readonly) {
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
							this.zone.run(() => {
								this.setValue(type, type == this.FRONT ? this.front : this.back);

							});

						}
					},
					{
						text: 'View image',
						handler: () => {
							this.viewImage(type);
						}
					},
					{
						text: 'Flip image',
						handler: () => {
							this.flip(type);
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
		} else {
			this.doCapture(type);
		}
	}




	private doCapture(type: number, captureType: number = 1) {
		//screen.orientation.lock && screen.orientation.lock("landscape");
		this.camera.getPicture({
			sourceType: this.device.isVirtual && this.platform.is("ios") ? 2 : captureType,
			correctOrientation: true,
			saveToPhotoAlbum: false,
			encodingType: this.camera.EncodingType.JPEG,
			targetWidth: 1280,
			targetHeight: 1000,
			destinationType: this.destinationType()
		}).then(imageData => {

			this.frontLoading = type == this.FRONT;
			this.backLoading = type != this.FRONT;

			if (this.platform.is('ios') || (!this.platform.is("android") && !this.platform.is("browser"))) {
				imageData = 'data:image/jpeg;base64,' + imageData;
			}

			let shouldRecognize = this.element.is_scan_cards_and_prefill_form == 1;

			this.imageProc.ensureLandscape(imageData, !shouldRecognize)
				.subscribe((info) => {
					let newFolder = this.file.dataDirectory + "leadliaison/images";
					let newName = new Date().getTime() + '.jpeg';
					let promise: Promise<any>;

					if (imageData.substr(0, 5) == "data:") {
						promise = this.file.writeFile(newFolder, newName, this.imageProc.dataURItoBlob(info.dataUrl));
					} else {
						let folder = imageData.substr(0, imageData.lastIndexOf("/"));
						let name = imageData.substr(imageData.lastIndexOf("/") + 1);
						promise = this.file.moveFile(folder, name, newFolder, newName);
					}

					promise.then((entry) => {
						this.zone.run(() => {
							this.setValue(type, newFolder + "/" + newName);
							info.dataUrl = newFolder + "/" + newName;
							this.frontLoading = false;
							this.backLoading = false;
							if (shouldRecognize && type == this.FRONT) {
								this.recognizeText(info);
							}/*else{
                 screen.orientation.unlock && screen.orientation.unlock();
                 }*/
						});
					},
						(err) => {
							console.error(err);
							//screen.orientation.unlock && screen.orientation.unlock();
						});
				});
		}).catch(err => {
			console.error(err);
			//screen.orientation.unlock && screen.orientation.unlock();
		});
	}

	recognizeText(info: Info) {
		let modal = this.modalCtrl.create(OcrSelector, { imageInfo: info, form: this.form, submission: this.submission });
		modal.onDidDismiss((changedValues) => {
			//this.currentVal.front = this.currentVal.front + "?" + parseInt(((1 + Math.random())*1000) + "");
			screen.orientation.unlock && screen.orientation.unlock();
			if (changedValues) {
				var vals = {};
				for (let id in this.formGroup.controls) {
					if (this.formGroup.controls[id]["controls"]) {
						vals[id] = {};
						for (let subid in this.formGroup.controls[id]["controls"]) {
							vals[id][subid] = this.formGroup.controls[id]["controls"][subid].value;
						}
					} else {
						vals[id] = this.formGroup.controls[id].value;
					}
				}
				let ctrl: AbstractControl = null;
				for (var id in changedValues) {
					let match = /(\w+\_\d+)\_\d+/g.exec(id);
					if (match && match.length > 0) {
						if (!vals[match[1]]) {
							vals[match[1]] = {};
						}
						vals[match[1]][id] = changedValues[id];
						ctrl = this.formGroup.get(match[1]).get(id);
						ctrl.markAsTouched();
						ctrl.markAsDirty();
					} else {
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
		//screen.orientation.lock && screen.orientation.lock("landscape");
	}

	setValue(type, newPath) {
		if (type == this.FRONT) {
			this.currentVal.front = newPath;
			this.theVal.front = this.adjustImagePath(this.currentVal.front);
		} else {
			this.currentVal.back = newPath;
			this.theVal.back = this.adjustImagePath(this.currentVal.back);
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
		if (front) {
			this.frontLoading = false;
		} else {
			this.backLoading = false;
		}
	}

	flip(type) {
		let image = "";
		if (type == this.FRONT) {
			image = this.currentVal.front;
		} else {
			image = this.currentVal.back;
		}
		let z = this.zone;
		let t = this;
		this.imageProc.flip(this.normalizeURL(image)).subscribe(info => {
			let name = image.substr(image.lastIndexOf("/") + 1).replace(/\?.*/, "");
			let folder = image.substr(0, image.lastIndexOf("/"));
			this.file.writeFile(folder, name, this.imageProc.dataURItoBlob(info.dataUrl), { replace: true }).then((entry) => {
				z.run(() => {
					t.setValue(type, folder + "/" + name);
					if (type == this.FRONT) {
						this.theVal.front = this.adjustImagePath(this.currentVal.front);
					} else {
						this.theVal.back = this.adjustImagePath(this.currentVal.back);
					}
				});
			});
		});
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

	private viewImage(type) {
		//const imageViewer = this.imageViewerCtrl.create((type == this.FRONT ? this.frontImage : this.backImage).nativeElement);
		//imageViewer.present();
		let image = type == this.FRONT ? this.currentVal.front : this.currentVal.back;
		this.modalCtrl.create(ImageViewer, { image: image }).present();
	}

	private normalizeURL(url: string): any {
		return this.dom.bypassSecurityTrustUrl(this.util.normalizeURL(url));
	}

	private adjustImagePath(path) {
		return path.replace(/\?.*/, "") + "#" + parseInt(((1 + Math.random()) * 1000) + "")
	}

	private destinationType() {
		return this.platform.is("android") ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.DATA_URL;
	}
}
