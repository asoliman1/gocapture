import { BaseResponse } from "./response";

export class FileDownloadResponse extends BaseResponse {
  id: number;
  name: string;
  file_type: string;
  file_size: number;
  is_image: boolean;
  thumbnail_url: string;
  location: string;
  created_at: string;
  updated_at: string;
  download_url: string;
}
