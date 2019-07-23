import {IDocument} from "./document";

export interface IDocumentCategory {
  id: number;
  name: string;
  documents: IDocument[];
}

const documents: IDocument[] = [
  {name: "ELM Datasheet", url: 'assets/documents/Form_delega_Isee_parificato.pdf'},
  {name: "Barcode vs Badge", url: 'assets/documents/domande.pdf'},
  {name: "ELM Datasheet", url: 'assets/documents/Form_delega_Isee_parificato.pdf'},
  {name: "Barcode vs Badge", url: 'assets/documents/domande.pdf'}
];

export const documentCategoriesMock = [
  {id: 1, name: "ELM Documents", documents},
  {id: 2, name: "LMA Documents", documents},
  {id: 3, name: "Category 3", documents},
  {id: 4, name: "Category 4", documents}
];
