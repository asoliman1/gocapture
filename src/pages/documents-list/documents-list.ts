import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {documentCategoriesMock, Form} from "../../model";
import {IDocumentCategory, IDocument} from "../../model";


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
    this.documentCategories = documentCategoriesMock;
  }

  openDocuments(categoryId: number) {
    const category = this.documentCategories.find((cat) => cat.id === categoryId);

    if (category) {
      this.modal.create("Documents", { documentSource: category }).present();
    }
  }

}
