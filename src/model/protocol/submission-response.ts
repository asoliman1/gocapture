import { Station } from "../station";
import { FormSubmissionType } from "../form-submission";

export class SubmissionResponse {
	activity_id: number;
	prospect_id: number;
	email: string;
	submission_date: string;
	hold_request_id: number;
	data: [SubmissionDataResponse];
	station_id: string;
	stations: [Station];
	captured_by_user_name: string;
	submission_type: FormSubmissionType;
	barcodeID: string;
}

export class SubmissionDataResponse {
	element_id: number;
	element_title: string;
	value: string;
}
