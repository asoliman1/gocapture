import {BaseResponse} from "./response";
export class DataResponse<T> extends BaseResponse {
	data: T;
}
