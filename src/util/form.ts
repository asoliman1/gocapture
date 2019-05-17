import { FormElement, Form } from '../model';

export class FormUtils {

	public static getLabelByIdentifier(identifier: string, form: Form): string{
		let nameMap = {
			"FirstName": "First Name",
			"LastName": "Last Name"
		}
		for(let index in form.elements){
			let element = form.elements[index];
			if(element.mapping && element.mapping.length > 1){		
				for(let id in element.mapping){		
					let mapping = element.mapping[id];	
					if(mapping["identifier"] == identifier){
						return nameMap[mapping.ll_field_unique_identifier] || mapping.ll_field_unique_identifier;
					}
				}
			}else{
				if(element["identifier"] == identifier){
					return element.title;
				}
			}
		}
		return '';
	}
}
