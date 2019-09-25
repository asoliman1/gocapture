
import { Injectable } from "@angular/core";
import { Form, FormSubmission, SubmissionStatus } from "../model";
import { SubmissionResponse } from "../model/protocol";


@Injectable()
export class SubmissionMapper {

  constructor() {

  }

  map(form: Form, item: SubmissionResponse): FormSubmission {
    let entry: FormSubmission = new FormSubmission();
    entry.id = item.activity_id;
    entry.activity_id = item.activity_id;
    entry.status = SubmissionStatus.Submitted;
    entry.prospect_id = parseInt(item.prospect_id + "");
    entry.hold_request_id = item.hold_request_id;
    entry.email = item.email;
    entry.form_id = parseInt(form.id);
    entry.station_id = item.station_id;
    entry.stations = item.stations;

    item.data.forEach((dataItem) => {
      if (!dataItem.value) {
        return;
      }
      let fieldName = "element_" + dataItem.element_id;
      let field = form.getFieldById(dataItem.element_id);

      switch (field.type) {
        case "simple_name":
        case "address":
          if (dataItem["value_splitted"]) {
            let values = dataItem["value_splitted"];
            entry.fields = { ...entry.fields, ...values };
          }
          break;
        case "image":
        case "business_card":
          try {
            let obj = JSON.parse(dataItem.value);
            if (typeof (obj) == "string") {
              obj = JSON.parse(obj);
            }
            entry.fields[fieldName] = obj;
            for (var key in <any>entry.fields[fieldName]) {
              entry.fields[fieldName][key] = entry.fields[fieldName][key].replace(/\\/g, "");
            }
          } catch (e) {
            console.log("Can't parse " + field.type + " for submission " + entry.activity_id)
          }
          break;
        case "audio":
          entry.fields[fieldName] = dataItem.value.replace(/\\/g, "");
          break;
        case "checkbox":
          entry.fields[fieldName] = dataItem.value.split(";");
          break;
        default:
          entry.fields[fieldName] = dataItem.value;
      }
    });
    entry.first_name = "";
    entry.last_name = "";
    entry.company = "";
    entry.phone = "";
    entry.sub_date = item.submission_date;
    entry.updateFields(form);

    return entry;
  }

}
