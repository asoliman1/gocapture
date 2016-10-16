export class BaseResponse{
	status: '200' | "400" | "500";
	message: string;
}