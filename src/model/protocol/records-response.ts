import {BaseResponse} from "./response";
export class RecordsResponse<T> extends BaseResponse{
	count: number;
	total_count: number;
	records: T[];
}
