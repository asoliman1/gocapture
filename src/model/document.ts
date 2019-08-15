export interface IDocument {
  id: number;
  setId: number;
  name: string;
  vanity_url: string;
  file_type?: string;
  file_path?: string;
  file_extension?: string;
  selected?: boolean;
  preview_urls?: string;
}
