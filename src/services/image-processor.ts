import { Observable, Observer } from "rxjs/Rx";
import { Injectable } from "@angular/core";

@Injectable()
export class ImageProcessor{
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	public ensureLandscape(url: string, preserveCanvas: boolean): Observable<Info> {
		return new Observable<Info>((obs: Observer<Info>) => {
			console.log("Ensure landscape started ");
			let start = new Date().getTime();
			var image: any = document.createElement("img");
			let t = this;
			image.onload = function (event: any) {
				if (preserveCanvas || image.naturalWidth >= image.naturalHeight) {
					obs.next({
						width: image.naturalWidth,
						height: image.naturalHeight,
						dataUrl: url,
						data: null,
						isDataUrl: false
					});
					console.log("Ensure landscape ended after " + (new Date().getTime() - start) + "ms")
					obs.complete();
					return;
				}
				t.setupCanvas(image.naturalHeight, image.naturalWidth)
				t.ctx.translate(t.canvas.width / 2, t.canvas.height / 2);
				t.ctx.rotate(Math.PI / 2);
				t.ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
				obs.next({
					width: t.canvas.width,
					height: t.canvas.height,
					dataUrl:t.canvas.toDataURL(),
					data: null,
					isDataUrl: true
				});
				console.log("Ensure landscape ended after " + (new Date().getTime() - start) + "ms")
				obs.complete();
				//if(!preserveCanvas){
					t.ctx.clearRect(0, 0, t.canvas.width, t.canvas.height);
				//}
			};
			image.src = url;
		});
	}

	public flip(url: string): Observable<Info> {
		return new Observable<Info>((obs: Observer<Info>) => {
			var image: any = document.createElement("img");
			let t = this;
			image.onload = function (event: any) {
				t.setupCanvas(image.naturalWidth, image.naturalHeight)
				t.ctx.translate(t.canvas.width / 2, t.canvas.height / 2);
				t.ctx.rotate(Math.PI);
				t.ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
				obs.next({
					width: t.canvas.width,
					height: t.canvas.height,
					dataUrl:t.canvas.toDataURL(),
					data: null,
					isDataUrl: true
				});
				obs.complete();
				t.ctx.clearRect(0, 0, t.canvas.width, t.canvas.height);
			};
			image.src = url.replace(/\?.*/, "?" + parseInt(((1 + Math.random())*1000) + ""));
		});
	}

	public dataURItoBlob(dataURI: string): Blob {
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

	public recognize(data: string): Observable<RecognitionResult>{
		return new Observable<RecognitionResult>((obs: Observer<RecognitionResult>) => {
			if (window["TesseractPlugin"]) {
				console.log("Recognize started");
				let start = new Date().getTime();
				/*TesseractPlugin.recognizeWords(this.processCurrentImage().split("base64,")[1], "eng", function (data) {
					obs.next(<RecognitionResult>JSON.parse(<any>data));
					obs.complete();
				}, function (reason) {
					obs.error(reason);
				});*/
				TesseractPlugin.recognizeWordsFromPath(data, "eng", function (data) {
					console.log("Recognize ended after " + (new Date().getTime() - start) + "ms")
					obs.next(<RecognitionResult>JSON.parse(<any>data));
					obs.complete();
				}, function (reason) {
					console.log("Recognize ended in error after " + (new Date().getTime() - start) + "ms")
					obs.error(reason);
				});

			} else {
				setTimeout(() => {
					obs.next({"recognizedText":"Kayla Egan ‘ Q TAS\n\nBusiness Development Manager ENVIRONMENTAL\n\nkagan@taslp.com\n\n3929 California Parkway E\n\nFort Worth, TX 761 19\n\nO 817.535.7222 Emergency Response\n7 F 817.535.8187 1.888.654.0111\n\nC 817.253.1855 www.taslp.com","words":[{"word":"Kayla","box":"122 467 211 69","confidence":80.52796173095703},{"word":"Egan","box":"351 465 189 68","confidence":68.43997955322266},{"word":"‘","box":"823 465 3 2","confidence":62.74388885498047},{"word":"Q","box":"929 351 316 253","confidence":62.69871139526367},{"word":"TAS","box":"1310 338 464 166","confidence":69.00736236572266},{"word":"Business","box":"122 555 189 39","confidence":87.80379486083984},{"word":"Development","box":"324 552 306 47","confidence":88.68340301513672},{"word":"Manager","box":"644 549 206 48","confidence":86.97967529296875},{"word":"ENVIRONMENTAL","box":"1209 547 648 60","confidence":73.26774597167969},{"word":"kagan@taslp.com","box":"122 616 403 52","confidence":86.98858642578125},{"word":"3929","box":"137 887 122 43","confidence":85.84361267089844},{"word":"California","box":"280 885 269 45","confidence":82.29283142089844},{"word":"Parkway","box":"566 883 241 55","confidence":83.30488586425781},{"word":"E","box":"824 881 35 43","confidence":89.27845764160156},{"word":"Fort","box":"136 967 106 43","confidence":86.860107421875},{"word":"Worth,","box":"258 967 183 50","confidence":89.03996276855469},{"word":"TX","box":"461 966 74 43","confidence":89.64755249023438},{"word":"761","box":"553 964 90 44","confidence":90.46473693847656},{"word":"19","box":"658 963 55 44","confidence":92.0013427734375},{"word":"O","box":"138 1047 42 43","confidence":92.50652313232422},{"word":"817.535.7222","box":"199 1046 354 44","confidence":84.44401550292969},{"word":"Emergency","box":"1227 1036 349 56","confidence":80.78169250488281},{"word":"Response","box":"1592 1033 284 54","confidence":87.1631851196289},{"word":"7","box":"19 1185 3 1","confidence":10.920455932617188},{"word":"F","box":"136 1127 32 43","confidence":88.34750366210938},{"word":"817.535.8187","box":"199 1127 354 44","confidence":92.27437591552734},{"word":"1.888.654.0111","box":"1450 1112 425 50","confidence":86.51805877685547},{"word":"C","box":"138 1207 40 43","confidence":93.28943634033203},{"word":"817.253.1855","box":"197 1207 356 45","confidence":84.16748046875},{"word":"www.taslp.com","box":"1351 1195 532 62","confidence":86.11317443847656}]});
					obs.complete();
				}, 500);
			}
		});
	}

	private processCurrentImage(): string{
		let pix = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		for (var i = 0; i < pix.data.length; i+= 4) {
			let contrastF = 1.36;
			let saturate = -1;
			//up the contrast
			//pix.data[i] = contrastF * (pix.data[i] - 128) + 128;
			//pix.data[i + 1] = contrastF * (pix.data[i + 1] - 128) + 128;
			//pix.data[i + 2] = contrastF * (pix.data[i + 2] - 128) + 128;
			//desaturate
			let max = Math.max(pix.data[i], pix.data[i + 1], pix.data[i + 2]);
			pix.data[i] += max !== pix.data[i] ? (max - pix.data[i]) * saturate : 0;
			pix.data[i + 1] += max !== pix.data[i + 1] ? (max - pix.data[i + 1]) * saturate : 0;
			pix.data[i + 2] += max !== pix.data[i + 2] ? (max - pix.data[i + 2]) * saturate : 0;
		}
		this.ctx.putImageData(pix, 0, 0);
		let base64 = this.canvas.toDataURL();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		return base64;
	}

	private setupCanvas(width: number, height: number){
		this.canvas = null;
		if(!this.canvas){
			this.canvas = document.createElement("canvas");
			this.ctx = this.canvas.getContext('2d');
		}
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx.clearRect(0, 0, width, height);
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
}

export class Info{
	width:number;
	height:number;
	dataUrl:string;
	data: ImageData;
	isDataUrl: boolean = false;
}

export class RecognitionResult{
	recognizedText: string;
	words: RecognizedWord[];
}

export class RecognizedWord{
	word: string;
	box: string;
	confidence: number;
}
