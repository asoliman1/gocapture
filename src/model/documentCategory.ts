import {IDocument} from "./document";

export interface IDocumentCategory {
  id: number;
  name: string;
  documents: IDocument[];
}

const documents: IDocument[] = [
  {name: "ELM Datasheet"},
  {name: "Barcode vs Badge"},
  {name: "ELM Datasheet"},
  {name: "Barcode vs Badge"}
];

export const documentCategoriesMock = [
  {id: 1, name: "ELM Documents", documents},
  {id: 2, name: "LMA Documents", documents},
  {id: 3, name: "Category 3", documents},
  {id: 4, name: "Category 4", documents}
];
