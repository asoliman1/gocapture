import {Response} from "./response";
export class RecordsResponse<T> extends Response{
	count: number;
	total_count: number;
	records: T[];
}