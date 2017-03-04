import { Pipe } from "@angular/core";
import { Form } from "../model";

@Pipe({
	name: "formControl"
})
export class FormControlPipe {
	transform(array: Array<Form>, args: string): Array<Form> {
		let arr = array.filter(value => {
			return !value.archive_date || new Date(value.archive_date) > new Date();
		}).sort((a, b) => {
			let dateA = new Date(a.updated_at);
			let dateB = new Date(b.updated_at);
			if (dateA < dateB) {
				return 1;
			} else if (dateA > dateB) {
				return -1;
			} else {
				return 0;
			}
		});
		return arr;
	}
}