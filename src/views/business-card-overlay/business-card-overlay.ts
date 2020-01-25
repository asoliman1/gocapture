import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from "@ionic-native/camera-preview";
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Popup } from "../../providers/popup/popup";
import { Platform } from 'ionic-angular/platform/platform';
import { ImageProcessor } from "../../services/image-processor";

/**
 * Generated class for the BusinessCardOverlayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-business-card-overlay',
	templateUrl: 'business-card-overlay.html',
})
export class BusinessCardOverlayPage {

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		private cameraPreview: CameraPreview,
		private viewController: ViewController,
		private screenOrientation: ScreenOrientation,
		private popup: Popup,
		private platform: Platform,
		private imageProcessor: ImageProcessor) {
	}

	ionViewDidLoad() {
		this.screenOrientation.lock && this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
	}

	ionViewDidEnter() {

		// if (this.platform.is('android')) {
		//   this.cameraPreviewOpts["storeToFile"] = true;
		// }
		//this.startCamera();
		var video = <any>document.querySelector('video');

			function successCallback(stream) {
				// Set the source of the video element with the stream from the camera
				if (video.mozSrcObject !== undefined) {
					video.mozSrcObject = stream;
				} else {
					video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
				}
				video.play();
			}

			function errorCallback(error) {
				console.error('An error occurred: [CODE ' + error.code + ']');
				// Display a friendly "sorry" message to the user
			}

			navigator.getUserMedia = navigator.getUserMedia || (<any>navigator).webkitGetUserMedia || (<any>navigator).mozGetUserMedia || (<any>navigator).msGetUserMedia;
			window.URL = window.URL || (<any>window).webkitURL || (<any>window).mozURL || (<any>window).msURL;

			// Call the getUserMedia method with our callback functions
			if (navigator.getUserMedia) {
				navigator.getUserMedia({ video: true }, successCallback, errorCallback);
			} else {
				console.log('Native web camera streaming (getUserMedia) not supported in this browser.');
				// Display a friendly "sorry" message to the user
			}
	}

	private startCamera() {
		this.cameraPreview.startCamera(this.cameraPreviewOpts).then(
			(res) => {
				console.log(res)
			},
			(err) => {
				console.log(err);
				this.popup.showAlert('alerts.error', err, [{
					text:'general.ok',
					role:'cancel'
				}]);
			});
	}

	ionViewWillLeave() {
		this.screenOrientation.unlock &&this.screenOrientation.unlock();
		this.cameraPreview.stopCamera();
	}

	cameraPreviewOpts: CameraPreviewOptions = {
		x: 12,
		y: 150,
		width: this.platform.width() - 24,
		height: (this.platform.width() - 24) / 1.75,
		camera: 'rear',
		tapPhoto: false,
		previewDrag: false,
		toBack: false,
		alpha: 1,
	};

	// picture options
	pictureOpts: CameraPreviewPictureOptions = {
		width: this.platform.width() * 2,
		height: this.platform.width() * 2,
		quality: 100
	};

	onClose() {
		this.viewController.dismiss();
	}

	onTakePicture() {
		this.cameraPreview.takePicture(this.pictureOpts).then((imageData) => {

			imageData = 'data:image/jpeg;base64,' + imageData;

			let crop = {
				x: this.cameraPreviewOpts.x,
				y: this.cameraPreviewOpts.y,
				width: this.cameraPreviewOpts.width,
				height: this.cameraPreviewOpts.height
			};
			this.imageProcessor.crop(imageData, crop).subscribe(data => {
				this.viewController.dismiss(data);
			})

		}, (err) => {
			console.log(err);
			this.popup.showAlert('alerts.error', err, [{
				text:'general.ok',
				role:'cancel'
			}]);});
	}
}
