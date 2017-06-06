import { BaseResponse } from "./response";

export class FormSubmitResponse extends BaseResponse{
	public activity_id: number;
	public hold_request_id: number;
}