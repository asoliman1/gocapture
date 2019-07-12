import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ThemeProvider} from "../../providers/theme/theme";
import {IDocument} from "../../model";

@Component({
  selector: 'document',
  templateUrl: 'document.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Document {
  @Input() document: IDocument;
  @Output() onOpen = new EventEmitter();
  @Output() onSelect = new EventEmitter();

  private selectedTheme: String;

  constructor(private themeProvider: ThemeProvider) {
    this.themeProvider.getActiveTheme().subscribe((theme) => this.selectedTheme = theme);
  }

  select() {
    this.onSelect.emit(null);
  }

  openDocument() {
    this.onOpen.emit(null);
  }

}
