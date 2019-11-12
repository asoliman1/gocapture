import { Geoposition } from '@ionic-native/geolocation';
import { Form } from "./form";
import { Station } from "./station";

export class FormSubmission {
	id: number = null;
	form_id: number = null;
	status: SubmissionStatus = null;
	prospect_id: number = null;
	email: string = "";
	company: string = "";
	phone: string = "";
	first_name: string = "";
	last_name: string = "";
	full_name: string = "";
	activity_id: number = null;
	hold_request_id: number = null;
	hold_submission: number = 0;
	hold_submission_reason: string = "";
	invalid_fields: number = 0;
	fields: { [key: string]: string | string[] } = {};
	sub_date: string;
	last_sync_date: string;
	hidden_elements: string[];
	is_filled_from_list: boolean = false;
	is_rapid_scan: number = 0;
	captured_by_user_name: string = "";
	station_id: string;
	barcode_processed: BarcodeStatus = 0;
	submission_type: FormSubmissionType = FormSubmissionType.normal;
	stations: Station[];
	location : Geoposition;
	isDownloading : boolean;
	isUploading : boolean;
	
	public isSubmitted(): boolean {
		return this.status == SubmissionStatus.Submitted;
	}

	public updateFields(form: Form) {
		form.elements.forEach(element => {
			switch (element.type) {
				case "simple_name":
					this.first_name = <any>this.fields[element["identifier"] + "_1"] || "";
					this.last_name = <any>this.fields[element["identifier"] + "_2"] || "";
					this.full_name = this.first_name + ' ' + this.last_name;
					break;
				case "email":
					this.email = <any>this.fields[element["identifier"]] || "";
					break;
			}
		});
		var id = form instanceof Form ? form.getIdByUniqueFieldName("WorkPhone") : Form.getIdByUniqueFieldName("WorkPhone", form);
		if (id) {
			this.phone = <any>this.fields[id] || "";
		}
		id = form instanceof Form ? form.getIdByUniqueFieldName("Company") : Form.getIdByUniqueFieldName("Company", form);
		if (id) {
			this.company = <any>this.fields[id] || "";
		}
	}
}

export enum BarcodeStatus {
	None = 0,
	Processed = 1,
	Queued = 2,
	PostShowReconsilation = 3
}

export enum SubmissionStatus {
	Submitted = 1,
	OnHold = 2,
	Blocked = 3,
	ToSubmit = 4,
	Submitting = 5,
	InvalidFields = 6,
	Error = 7
}

export enum FormSubmissionType {
	normal = 'normal',
	barcode = 'barcode',
	list = 'list',
	transcription = 'transcription'
}

