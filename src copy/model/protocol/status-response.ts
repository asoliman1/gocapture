import { User } from './../user';
import {BaseResponse} from "./response";

export class StatusResponse<T> extends BaseResponse{
	check_status: T;
	data : User
}
