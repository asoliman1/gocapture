import { Address } from "./address";

export class BaseForm {
	id: string;
	form_id: number;
	name: string;
	description: string;
	total_submissions: number;
	total_hold: number;
	total_sent: number;
	//ready, submitting, blocked
	total_unsent: number;
	// A.S GOC-326
	event_address : Address;

}
