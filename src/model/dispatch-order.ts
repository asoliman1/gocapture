export class DispatchOrder{
	id : number;
	name : string;
	description : string;
	form_id : number;
	device_id : number;
	prospect_id : number;
	fields_values : {[key: string]: string};
	date_created : string;
	date_last_modified : string;
	status : string;
}