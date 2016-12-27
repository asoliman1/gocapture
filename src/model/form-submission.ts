export class FormSubmission{
	id: number;
	form_id: number;
	status: SubmissionStatus;
	prospect_id: number;
	email: string = "";
	company: string = "";
	phone: string = "";
	first_name: string = "";
	last_name: string = "";
	fields : {[key: string]: string | string[]} = {};
}

export enum SubmissionStatus{
	Submitted = 1,
	OnHold = 2,
	Blocked = 3,
	ToSubmit = 4,
	Submitting = 5
}