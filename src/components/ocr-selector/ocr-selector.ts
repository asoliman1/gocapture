import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { NavParams, ActionSheetController, AlertController, ViewController, Content } from "ionic-angular";
import { Form, FormSubmission } from "../../model";

@Component({
	selector: 'ocr-selector',
	templateUrl: 'ocr-selector.html',
	animations: [
		trigger('isVisibleChanged', [
			state('true', style({ opacity: 1, "z-index": 1})),
			state('false', style({ opacity: 0, "z-index": -1 })),
			transition('* => *', animate('350ms'))
		])
	]
})
export class OcrSelector {

	@ViewChild(Content) 
	content: Content;

	private info: { width: number, height: number, data: string };

	private form: Form;

	image: string;

	@ViewChild('card') elementView: ElementRef;

	wordElements: Word[] = [];
	loading: boolean = true;
	isLoading = this.loading + "";
	changedValues:any = {};

	private restrictedTypes: string[] = [
		"page_break",
		"section",
		"image",
		"business_card",
		"signature"
	]

	constructor(params: NavParams,
		private viewCtrl: ViewController,
		private zone: NgZone,
		private actionSheetCtrl: ActionSheetController,
		private alertCtrl: AlertController) {
		this.info = params.get("imageInfo");
		this.form = params.get("form") || { "id": 42, "form_id": 42, "description": "This is your form description. Click here to edit.", "title": "Untitled Form", "list_id": 0, "name": "Device Form - Collector", "archive_date": "2017-05-22T12:41:00+00:00", "created_at": "2016-02-22T10:45:21+00:00", "updated_at": "2016-02-22T15:54:11+00:00", "success_message": "Success! Your submission has been saved!", "submit_error_message": "Form not submitted.", "submit_button_text": "Submit", "elements": [{ "id": 1, "title": "Name", "field_error_message": "", "size": "small", "is_required": false, "is_always_display": false, "is_conditional": false, "is_not_prefilled": false, "is_hidden": false, "is_readonly": false, "type": "simple_name", "position": 0, "default_value": "", "total_child": 1, "options": [], "mapping": [{ "ll_field_id": "17", "ll_field_unique_identifier": "LastName", "ll_field_type": "Standard", "ll_field_data_type": "string", "identifier": "element_1_1" }, { "ll_field_id": "16", "ll_field_unique_identifier": "FirstName", "ll_field_type": "Standard", "ll_field_data_type": "string", "identifier": "element_1_2" }], "identifier": "element_1" }, { "id": 2, "title": "Email", "field_error_message": "", "size": "medium", "is_required": false, "is_always_display": false, "is_conditional": false, "is_not_prefilled": false, "is_hidden": false, "is_readonly": false, "type": "email", "position": 1, "default_value": "", "total_child": 0, "options": [], "mapping": [{ "ll_field_id": "21", "ll_field_unique_identifier": "Email", "ll_field_type": "Standard", "ll_field_data_type": "string" }], "identifier": "element_2" }, { "id": 3, "title": "Company", "field_error_message": "", "size": "medium", "is_required": false, "is_always_display": false, "is_conditional": false, "is_not_prefilled": false, "is_hidden": false, "is_readonly": false, "type": "text", "position": 2, "default_value": "", "total_child": 0, "options": [], "mapping": [{ "ll_field_id": "22", "ll_field_unique_identifier": "Company", "ll_field_type": "Standard", "ll_field_data_type": "string" }], "identifier": "element_3" }], "total_submissions": 1, "total_hold": 0 };
		this.image = this.info.data;
		
	}

	ionViewDidEnter() {
		let z = this.zone;
		let t = this;
		setTimeout(() => {
			if (window["TesseractPlugin"]) {
				TesseractPlugin.recognizeWords(t.info.data.split("base64,")[1], "eng", function (data) {
					z.run(() => {
						t.positionWords(<any>JSON.parse(<any>data));
						t.loading = false;
						t.isLoading = t.loading + "";
					});
					console.log(data);
				}, function (reason) {
					console.error(reason);
				});
			} else {
				t.positionWords({"recognizedText":"Kayla Egan ‘ Q TAS\n\nBusiness Development Manager ENVIRONMENTAL\n\nkagan@taslp.com\n\n3929 California Parkway E\n\nFort Worth, TX 761 19\n\nO 817.535.7222 Emergency Response\n7 F 817.535.8187 1.888.654.0111\n\nC 817.253.1855 www.taslp.com","words":[{"word":"Kayla","box":"122 467 211 69","confidence":80.52796173095703},{"word":"Egan","box":"351 465 189 68","confidence":68.43997955322266},{"word":"‘","box":"823 465 3 2","confidence":62.74388885498047},{"word":"Q","box":"929 351 316 253","confidence":62.69871139526367},{"word":"TAS","box":"1310 338 464 166","confidence":69.00736236572266},{"word":"Business","box":"122 555 189 39","confidence":87.80379486083984},{"word":"Development","box":"324 552 306 47","confidence":88.68340301513672},{"word":"Manager","box":"644 549 206 48","confidence":86.97967529296875},{"word":"ENVIRONMENTAL","box":"1209 547 648 60","confidence":73.26774597167969},{"word":"kagan@taslp.com","box":"122 616 403 52","confidence":86.98858642578125},{"word":"3929","box":"137 887 122 43","confidence":85.84361267089844},{"word":"California","box":"280 885 269 45","confidence":82.29283142089844},{"word":"Parkway","box":"566 883 241 55","confidence":83.30488586425781},{"word":"E","box":"824 881 35 43","confidence":89.27845764160156},{"word":"Fort","box":"136 967 106 43","confidence":86.860107421875},{"word":"Worth,","box":"258 967 183 50","confidence":89.03996276855469},{"word":"TX","box":"461 966 74 43","confidence":89.64755249023438},{"word":"761","box":"553 964 90 44","confidence":90.46473693847656},{"word":"19","box":"658 963 55 44","confidence":92.0013427734375},{"word":"O","box":"138 1047 42 43","confidence":92.50652313232422},{"word":"817.535.7222","box":"199 1046 354 44","confidence":84.44401550292969},{"word":"Emergency","box":"1227 1036 349 56","confidence":80.78169250488281},{"word":"Response","box":"1592 1033 284 54","confidence":87.1631851196289},{"word":"7","box":"19 1185 3 1","confidence":10.920455932617188},{"word":"F","box":"136 1127 32 43","confidence":88.34750366210938},{"word":"817.535.8187","box":"199 1127 354 44","confidence":92.27437591552734},{"word":"1.888.654.0111","box":"1450 1112 425 50","confidence":86.51805877685547},{"word":"C","box":"138 1207 40 43","confidence":93.28943634033203},{"word":"817.253.1855","box":"197 1207 356 45","confidence":84.16748046875},{"word":"www.taslp.com","box":"1351 1195 532 62","confidence":86.11317443847656}]});
				setTimeout(() => {
					z.run(() => {
						t.loading = false;
						t.isLoading = t.loading + "";
					});
				}, 1000);
			}
		}, 1);
	}

	positionWords(data: {
		recognizedText: string;
		words: {
			word: string;
			box: string;
			confidence: number;
		}[]
	}) {
		var wRatio =1; 100/this.info.width; //this.elementView.nativeElement.width / this.info.width;
		var hRatio =1; 100/this.info.height; //this.elementView.nativeElement.height / this.info.height;
		var ratio = this.elementView.nativeElement.width / this.info.width;
		let list: Word[] = [];
		let w: Word;
		let uom = "px";
		data.words.forEach(element => {
			w = new Word();
			w.word = element.word;
			w.confidence = element.confidence;
			var coords = element.box.split(" ");
			w.left = parseFloat(coords[0]) * ratio + uom;
			w.top = parseFloat(coords[1]) * ratio + uom;
			w.width = parseFloat(coords[2]) * ratio + uom;
			w.height = parseFloat(coords[3]) * ratio + uom;
			list.push(w);
		});
		this.wordElements = list;
	}

	wordClicked(word: Word) {
		let actionSheet = this.actionSheetCtrl.create({
			title: word.word,
			cssClass: "word-actions",
			subTitle: word.assigned ? "Assigned to field " + word.assigned.label : "Not assigned to a field",
			buttons: [
				{
					text: 'Edit',
					icon: "create",
					handler: () => {
						let alert = this.alertCtrl.create({
							title: '<i class="pull-left icon icon-md ion-md-create"></i>  ' + word.word,
							cssClass: "edit-word",
							inputs: [
								{
									name: 'word',
									placeholder: 'word',
									value: word.word
								}
							],
							buttons: [
								{
									text: 'Cancel',
									role: 'cancel',
									handler: data => {
										console.log('Cancel clicked');
									}
								},
								{
									text: 'Update',
									handler: data => {
										word.word = data.word;
										actionSheet.setTitle(word.word);
									}
								}
							]
						});
						alert.present();
						return false;
					}
				}, {
					text: word.assigned ? 'Assign to another field' : 'Assign to field',
					icon: "eye",
					handler: () => {
						//console.log('review clicked');
						let inputs = [];
						this.form.elements.forEach(element => {
							if(this.restrictedTypes.indexOf(element.type) > -1){
								return;
							}
							if(element.mapping && element.mapping.length > 1){								
								element.mapping.forEach(mapping => {
									inputs.push({
									type: 'radio',
									label: mapping.ll_field_unique_identifier,
									value: mapping["identifier"]
								});
								})
							}else{
								inputs.push({
									type: 'radio',
									label: element.title,
									value: element["identifier"]
								});
							}
						});
						console.log(inputs);
						inputs[0].checked = true;
						let alert = this.alertCtrl.create({
							title: '<i class="pull-left icon icon-md ion-md-eye"></i>  ' + word.word,
							//subTitle: "Assign to field",
							cssClass: "assign-field",
							inputs: inputs,
							buttons: [
								{
									text: 'Cancel',
									role: 'cancel',
									handler: data => {
										console.log('Cancel clicked');
									}
								},
								{
									text: 'Update',
									handler: data => {
										if (data) {
											var title = "";
											for (let i = 0; i < this.form.elements.length; i++) {
												if (this.form.elements[i]["identifier"] == data) {
													title = this.form.elements[i].title;
													break;
												}
											}
											this.changedValues[data] = word.word;
											word.assigned = new Assigned(data, title);
										}
									}
								}
							]
						});
						alert.present();
					}
				}, {
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
						//console.log('Cancel clicked');
					}
				}
			]
		});
		actionSheet.present();
	}

	cancel() {
		this.viewCtrl.dismiss(null);
	}

	done() {
		this.viewCtrl.dismiss(this.changedValues);
	}
}

class Word {
	word: string;
	width: string|number;
	height: string|number;
	top: string|number;
	left: string|number;
	confidence: number;
	assigned: Assigned;
}

class Assigned {
	field: string;
	label: string;

	constructor(field: string, label: string) {
		this.label = label;
		this.field = field;
	}
}