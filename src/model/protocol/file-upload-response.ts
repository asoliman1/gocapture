export class FileUploadResponse{
	files: FileResponse[] = [];
}

export class FileResponse{
	url: string;
	token: string;
}