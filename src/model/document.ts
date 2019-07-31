export interface IDocument {
  id: number;
  name: string;
  file_type?: string;
  thumbnail_path?: string;
  file_path?: string;
  file_extension?: string;
  selected?: boolean;
}
