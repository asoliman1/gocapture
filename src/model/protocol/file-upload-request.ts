export class FileUploadRequest{
	files: FileInfo[] = [];
}

export class FileInfo{
	size: number;
	data: string;
	name: string;
	mimeType: string;
}