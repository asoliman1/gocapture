import {IDocument} from "./document";

export interface IDocumentSet {
  id: number;
  formId: number;
  name: string;
  documents: IDocument[];
}
