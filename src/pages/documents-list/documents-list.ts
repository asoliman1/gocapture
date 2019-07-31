import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {Form, IDocumentSet} from "../../model";


@IonicPage()
@Component({
  selector: 'page-documents-list',
  templateUrl: 'documents-list.html',
})
export class DocumentsListPage {

  form: Form;
  documentSets: IDocumentSet[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private modal: ModalController) {
    this.form = this.navParams.get('form');
    this.init();
  }

  private init() {
    console.log(this.form);
    this.documentSets = this.form.elements
      .filter((el) => el.type === 'documents')
      .map((el) => el.documents_set);
  }

  openDocuments(documentSet: IDocumentSet) {
    console.log('Opening documents....', documentSet);
    this.modal.create("Documents", { documentSet }).present();
  }

}
