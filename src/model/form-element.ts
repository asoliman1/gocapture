export class FormElement{
	id : number;
	title : string;
	guidelines : string;
	field_error_message : string;
	size : string;
	is_required : boolean;
	is_always_display : boolean;
	is_conditional : boolean;
	is_not_prefilled : boolean;
	is_scan_cards_and_prefill_form: 0 | 1;
	is_hidden : boolean;
	is_readonly : boolean;
	type : string;
	position : number;
	default_value : string;
	total_child : number;
	options : any[];
	mapping : ElementMapping[];
}

export class ElementMapping{
	ll_field_id: string;
	ll_field_unique_identifier: string;
	ll_field_type: string;
	ll_field_data_type: string;
}