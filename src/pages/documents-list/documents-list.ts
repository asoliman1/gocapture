import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {Form} from "../../model";

export interface IDocument {
  name: string;
  url?: string;
  size?: number;
  type?: string;
  selected?: boolean;
}

export interface IDocumentCategory {
  id: number;
  name: string;
  documents: IDocument[];
}

@IonicPage()
@Component({
  selector: 'page-documents-list',
  templateUrl: 'documents-list.html',
})
export class DocumentsListPage {

  form: Form;
  documentCategories: IDocumentCategory[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private modal: ModalController) {
    this.form = this.navParams.get('form');
    this.mockupDocuments();
  }

  /**
   * Mockup, remove when the form will return back the documents list
   */
  private mockupDocuments() {
    const documents: IDocument[] = [
      {name: "ELM Datasheet"},
      {name: "Barcode vs Badge"},
      {name: "ELM Datasheet"},
      {name: "Barcode vs Badge"}
    ];

    this.documentCategories = [
      {id: 1, name: "ELM Documents", documents},
      {id: 2, name: "LMA Documents", documents},
      {id: 3, name: "Category 3", documents},
      {id: 4, name: "Category 4", documents}
    ]
  }

  openDocuments(categoryId: number) {
    const category = this.documentCategories.find((cat) => cat.id === categoryId);

    if (category) {
      this.modal.create("Documents", { documentSource: category }).present();
    }
  }

}
