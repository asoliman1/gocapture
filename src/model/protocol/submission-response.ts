export class SubmissionResponse{
	activity_id: number;
	prospect_id: number;
	email: string;
	submission_date: string;
	hold_request_id: number;
	data: [SubmissionDataResponse];
}

export class SubmissionDataResponse{
	element_id: number;
	element_title: string;
	value: string;
}