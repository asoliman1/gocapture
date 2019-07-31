import { Component, Input } from '@angular/core';
import { BaseGroupElement} from "../base-group-element";
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
    console.log(this.element);
  }

  openDocuments() {
    console.log("OPENING DOCUMENTS PAGE...", this.element, this.shareMode);
    this.modalCtrl
      .create("Documents", { document_set: this.element.document_set, shareMode: this.shareMode })
      .present();
  }
}
