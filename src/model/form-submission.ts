import { Form } from "./form";

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

	public updateFields(form: Form){
		form.elements.forEach(element => {
			switch(element.type){
				case "simple_name":
					if(!this.first_name){
						this.first_name = <any>this.fields[element["identifier"] + "_2"];
						this.last_name = <any>this.fields[element["identifier"] + "_1"];
					}
					break;
				case "email":
					if(!this.email){
						this.email = <any>this.fields[element["identifier"]];
					}
					break;
			}
		});
		var id = form.getIdByUniqueFieldName("WorkPhone");
		if(id){
			this.phone = <any>this.fields[id];
		}
		id = form.getIdByUniqueFieldName("Company");
		if(id){
			this.company = <any>this.fields[id];
		}
	}
}

export enum SubmissionStatus{
	Submitted = 1,
	OnHold = 2,
	Blocked = 3,
	ToSubmit = 4,
	Submitting = 5
}