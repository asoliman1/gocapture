import { Component, Input, forwardRef, NgZone, ViewChild } from '@angular/core';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import {Util} from "../../../../util/util";
import {ThemeProvider} from "../../../../providers/theme/theme";

declare var cordova: any;
declare var screen;

@Component({
	selector: 'image-viewer',
	templateUrl: 'image-viewer.html',
})
export class ImageViewer {

	image: string;
  selectedTheme: String;

	constructor(private viewCtrl: ViewController,
				private navParams: NavParams,
              public util: Util,
              public themeProvider: ThemeProvider) {
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);

	}

	ionViewWillEnter(){
		this.image = this.normalizeURL(this.navParams.get("image"));
	}

	cancel() {
		this.viewCtrl.dismiss(null);
	}

  private normalizeURL(url: string): string {
    return this.util.normalizeURL(url);
  }
}
