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
	is_filled_from_barcode: boolean;
	type : string;
	position : number;
	default_value : string;
	total_child : number;
	options : Option[];
	mapping : ElementMapping[];
	barcode_provider_id: string;
	barcode_provider_name: string;
	identifier?: string;
	placeholder: string = "";
}

export class Option{
	option: string;
	option_label: string;
	position: number;
	is_default: number;

}

export class ElementMapping{
	ll_field_id: string;
	ll_field_unique_identifier: string;
	ll_field_type: string;
	ll_field_data_type: string;
}

export const FormElementType = {
	email: "email",
	page_break: "page_break",
	section: "section",
	url: "url",
	text: "text",			
	select: "select",
	radio: "radio",
	simple_name: "simple_name",
	textarea: "textarea",
	time: "time",
	address: "address",
	money: "money",
	number: "number",
	date: "date",
	phone: "phone",
	checkbox: "checkbox",
	image: "image",
	business_card: "business_card",
	signature: "signature",
	barcode: "barcode"
}