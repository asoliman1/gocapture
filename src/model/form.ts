import { FormElement } from "./form-element";
import { BarcodeStatus } from "./form-submission";
import { BaseForm } from "./base-form";
import { AbstractControl } from "@angular/forms";
import { Station } from "./station";
import { EventStyle } from "./event-style";
import { Activation } from "./activation";

export class Form extends BaseForm {
	created_at: string;
	updated_at: string;
	archive_date: string;
	members_last_sync_date: string;
	list_id: number;
	title: string;
	success_message: string;
	submit_error_message: string;
	total_views: number;
	submit_button_text: string;
	is_mobile_kiosk_mode: boolean;
	is_mobile_quick_capture_mode: boolean;
	elements: FormElement[];
	barcode_processed?: BarcodeStatus;
	instructions_content: string;
	is_enforce_instructions_initially: boolean;
	event_stations: Station[];
	is_enable_rapid_scan_mode: boolean;
	event_style: EventStyle; // A.S GOC-326
	isSyncing: boolean;
	available_for_users: any[];
	activations : Activation[];
	lastSync: {
		submissions ?: Date;
		contacts ?: Date;
		activations ? : Date;
	}
	search_list_background_color : string;
	search_list_text_color : string;
	show_reject_prompt: boolean;
	duplicate_action: string;
	unique_identifier_barcode: boolean;
	unique_identifier_name: boolean;
	unique_identifier_email: boolean;
	ignore_submissions_from_activations: boolean;

	public static getIdByUniqueFieldName(name: string, form: any): string {
		let element: FormElement = null;
		for (let i = 0; i < form.elements.length; i++) {

			element = form.elements[i];
			if (!element.mapping || element.mapping.length == 0) {
				continue;
			}
			if (element.mapping.length == 1) {
				if (element.mapping[0].ll_field_unique_identifier == name) {
					return element["identifier"];
				}
				continue;
			}
			for (let j = 0; j < element.mapping.length; j++) {
				if (element.mapping[j].ll_field_unique_identifier == name) {
					return element.mapping[j]["identifier"];
				}
			}
		}
		return null;
	}

	public static getIdByFieldType(type: string, form: any): string {
		let element: FormElement = null;
		for (let i = 0; i < form.elements.length; i++) {
			element = form.elements[i];
			if (element.type == type) {
				return element["identifier"];
			}
		}
		return null;
	}

	public static fillFormGroupData(data, formGroup) {

		let vals = {};
		let controls = formGroup.controls;
		for (let id in controls) {

			if (controls[id]["controls"]) {
				vals[id] = {};
				for (let subid in controls[id]["controls"]) {
					vals[id][subid] = controls[id]["controls"][subid].value;
				}
			} else {
				vals[id] = controls[id].value;
			}
		}

		data.forEach(entry => {
			let id = entry.id;
			console.log(`element id - ${id}`);
			if (!id) {
				return;
			}

			let match = /(\w+\_\d+)\_\d+/g.exec(id);
			let ctrl: AbstractControl = null;

			if (match && match.length > 0) {
				if (!vals[match[1]]) {
					vals[match[1]] = {};
				}
				// vals[match[1]][id] = entry.value;
				ctrl = formGroup.get(match[1]).get(id);
			} else {
				// vals[id] = entry.value;
				ctrl = formGroup.get(id);
			}
			if (ctrl) {
				ctrl.setValue(entry.value);
				ctrl.markAsTouched();
				ctrl.markAsDirty();
				ctrl.updateValueAndValidity();
			}
		});
		// formGroup.setValue(vals);
	}

	public getUrlFields(): string[] {
		let res = [];
		let types = ["business_card", "image", "signature", "audio"];
		let element: FormElement = null;
		for (let i = 0; i < this.elements.length; i++) {
			element = this.elements[i];
			if (types.indexOf(element.type) > -1) {
				res.push(element["identifier"]);
			}
		}
		return res;
	}

	public getIdByUniqueFieldName(name: string): string {
		return Form.getIdByUniqueFieldName(name, this);
	}

	public getIdByFieldType(type: string): string {
		return Form.getIdByFieldType(type, this);
	}

	public getFieldById(id: number): FormElement {
		if (id > 0) {
			for (let i = 0; i < this.elements.length; i++) {
				if (this.elements[i].id == id) {
					return this.elements[i];
				}
			}
		}
		return null;
	}

	public getFieldByIdentifier(id: string): FormElement {
		if (id) {
			for (let i = 0; i < this.elements.length; i++) {
				if (this.elements[i].identifier == id) {
					return this.elements[i];
				}
			}
		}
		return null;
	}

	public computeIdentifiers() {
		this.elements.forEach((element) => {
			if (element["identifier"]) {
				return;
			}
			var identifier = "element_" + element.id;
			element["identifier"] = identifier;
			if (element.mapping.length > 1) {
				element.mapping.forEach((entry, index) => {
					entry["identifier"] = identifier + "_" + (index + 1);
				});
			}
		});
	}

	public getHiddenElementsPerVisibilityRules(): string[] {
		let hiddenElements = this.elements.filter(element => {
			return element["visible_conditions"] && !element.isMatchingRules;
		});

		let elementsIds = [];
		for (let element of hiddenElements) {
			elementsIds = elementsIds.concat(`element_${element["id"]}`);
		}
		return elementsIds;
	}

	public getHiddenElementsPerVisibilityRulesForActivation(): string[]{
		let hiddenElements = this.elements.filter(element => {
			return !element.available_in_activations;
		});

		let elementsIds = [];
		for (let element of hiddenElements) {
			elementsIds = elementsIds.concat(`element_${element["id"]}`);
		}
		return elementsIds;
	}

	public getHiddenElementsPerVisibilityRulesForForm(): string[]{
		let hiddenElements = this.elements.filter(element => {
			return !element.available_in_event_form;
		});

		let elementsIds = [];
		for (let element of hiddenElements) {
			elementsIds = elementsIds.concat(`element_${element["id"]}`);
		}
		return elementsIds;
	}


}
