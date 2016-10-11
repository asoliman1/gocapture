import {Response} from "./response";
export class DataResponse<T> extends Response{
	data: T;
}