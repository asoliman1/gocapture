import {BaseResponse} from "./response";

export class FileUploadResponse extends BaseResponse{
	files: FileResponse[] = [];
}

export class FileResponse{
	url: string;
	token: string;
}