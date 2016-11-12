import {FormElement} from "./form-element";
import {BaseForm} from "./base-form";

export class Form extends BaseForm{
	created_at : string;
	updated_at : string;
	archive_date : string;
	list_id : number;
	title : string;
	success_message : string;
	submit_error_message : string;
	total_views : number;
	submit_button_text : string;
	elements : FormElement[];
}