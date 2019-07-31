import {IDocument} from "./document";

export interface IDocumentSet {
  id: number;
  name: string;
  documents: IDocument[];
}

