import { Component, Input, forwardRef, NgZone, ViewChild } from '@angular/core';
import { ViewController, NavParams } from "ionic-angular";

declare var cordova: any;
declare var screen;

@Component({
	selector: 'image-viewer',
	templateUrl: 'image-viewer.html',
})
export class ImageViewer {

	image: string;

	constructor(private viewCtrl: ViewController,
				private navParams: NavParams) {
		
	}

	ionViewWillEnter(){
		this.image = this.navParams.get("image");
	}

	cancel() {
		this.viewCtrl.dismiss(null);
	}
}