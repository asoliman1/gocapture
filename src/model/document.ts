export interface IDocument {
  id: number;
  setId: number;
  name: string;
  vanity_url: string;
  file_type?: string;
  thumbnail_path?: string;
  file_path?: string;
  file_extension?: string;
  selected?: boolean;
}
