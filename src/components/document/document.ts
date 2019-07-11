import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {IDocument} from "../../pages/documents-list/documents-list";

@Component({
  selector: 'document',
  templateUrl: 'document.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Document {
  @Input() document: IDocument;
  @Output() onOpen = new EventEmitter();

  constructor() {}

  openDocument() {
    this.onOpen.emit();
  }

}
