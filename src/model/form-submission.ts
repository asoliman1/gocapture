export class FormSubmission{
	form_id: number;
	prospect_id: number;
	email: string;
	first_name: string;
	last_name: string;
	fields : {[key: string]: string};
}