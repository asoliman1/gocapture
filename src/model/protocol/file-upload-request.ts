export class FileUploadRequest{
	files: FileInfo[] = [];
}

export class FileInfo{
	size: number;
	data: string;
	name: string;
	mime_type: string;
}