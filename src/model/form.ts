import {FormElement} from "./form-element";

export class Form{
	id : string;
	form_id : number;
	name : string;
	created_at : string;
	updated_at : string;
	archive_date : string;
	list_id : number;
	title : string;
	description : string;
	success_message : string;
	submit_error_message : string;
	total_views : number;
	total_submissions : number;
	submit_button_text : string;
	elements : FormElement[];
}