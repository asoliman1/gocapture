import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {ThemeProvider} from "../../providers/theme/theme";
import {IDocument} from "../../model";
import {File} from "@ionic-native/file";

@Component({
  selector: 'document',
  templateUrl: 'document.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Document implements OnChanges {
  @Input() document: IDocument;
  @Output() onOpen = new EventEmitter();
  @Output() onSelect = new EventEmitter();

  private selectedTheme: String;
  private thumbnail: string;

  constructor(
    private themeProvider: ThemeProvider,
    private fileService: File
  ) {
    this.themeProvider.getActiveTheme().subscribe((theme) => this.selectedTheme = theme);
  }

  ngOnChanges() {
    const defaultThumbnail = this.fileService.applicationDirectory + 'www/assets/images/doc-placeholder.png';
    this.thumbnail = this.document.file_path ? this.document.file_path : defaultThumbnail;
  }

  select() {
    this.onSelect.emit(null);
  }

  openDocument() {
    this.onOpen.emit(null);
  }

}
