import { Form } from "./form";

export class FormSubmission{
	id: number = null;
	form_id: number = null;
	status: SubmissionStatus = null;
	prospect_id: number = null;
	email: string = "";
	company: string = "";
	phone: string = "";
	first_name: string = "";
	last_name: string = "";
	activity_id: number = null;
	fields : {[key: string]: string | string[]} = {};

	public isSubmitted(): boolean{
		return this.status == SubmissionStatus.Submitted;
	}

	public updateFields(form: Form){
		form.elements.forEach(element => {
			switch(element.type){
				case "simple_name":
					this.first_name = <any>this.fields[element["identifier"] + "_1"] || "";
					this.last_name = <any>this.fields[element["identifier"] + "_2"] || "";
					break;
				case "email":
					this.email = <any>this.fields[element["identifier"]] || "";
					break;
			}
		});
		var id = form instanceof Form ? form.getIdByUniqueFieldName("WorkPhone") :  Form.getIdByUniqueFieldName("WorkPhone", form);
		if(id){
			this.phone = <any>this.fields[id] || "";
		}
		id = form instanceof Form ? form.getIdByUniqueFieldName("Company") :  Form.getIdByUniqueFieldName("Company", form);
		if(id){
			this.company = <any>this.fields[id] || "";
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