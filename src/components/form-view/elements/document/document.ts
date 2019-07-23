import { Component, Input } from '@angular/core';
import { BaseGroupElement} from "../base-group-element";
import {documentCategoriesMock} from "../../../../model";
import {ModalController} from "ionic-angular";
import {DocumentShareMode} from "../../../../views/documents/documents";

@Component({
  selector: 'document',
  templateUrl: 'document.html'
})
export class Document extends BaseGroupElement {

  @Input() element: any = {};
  @Input() shareMode: DocumentShareMode;

  constructor(private modalCtrl: ModalController) {
    super();
  }

  ngOnChanges() {
    this.element = {
      ...this.element,
      // TODO: remove this once the data is correctly fetched from the server.
      documentSource: documentCategoriesMock[0]
    }
  }

  openDocuments() {
    console.log("OPENING DOCUMENTS PAGE...", this.element, this.shareMode);
    this.modalCtrl
      .create("Documents", { documentSource: this.element.documentSource, shareMode: this.shareMode })
      .present();
  }
}
