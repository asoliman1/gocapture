import {BaseForm} from "./base-form";
import {Form} from "./form";

export class DispatchOrder extends BaseForm{
	device_id : number;
	prospect_id : number;
	fields_values : {[key: string]: string};
	date_created : string;
	date_last_modified : string;
	status : string;
	form: Form;
}