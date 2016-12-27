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

	getIdByUniqueFieldName(name : string) : string{
		let element : FormElement = null;
		for(let i = 0; i < this.elements.length; i++){
			element = this.elements[i];
			if(!element.mapping || element.mapping.length == 0){
				continue;
			}
			if(element.mapping.length == 1){
				if(element.mapping[0].ll_field_unique_identifier == name){
					return element["identifier"];
				}
				continue;
			}
			for(let j = 0; j < element.mapping.length; j++){
				if(element.mapping[j].ll_field_unique_identifier == name){
					return element.mapping[j]["identifier"];
				}
			}
		}
		return null;
	}
}