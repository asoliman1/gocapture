export class SubmissionResponse{
	activity_id: number;
	prospect_id: number;
	email: string;
	submission_date: string;
	data: [SubmissionDataResponse];
}

export class SubmissionDataResponse{
	element_id: number;
	element_title: string;
	value: string;
}