import { BaseResponse } from "./response";
import { FormSubmission } from "../form-submission";

export class FormSubmitResponse extends BaseResponse{
	public activity_id: number;
	public hold_request_id: number;
	public duplicate_action?: string;
	public submission?: FormSubmission;
	public is_new_submission: boolean;
}
