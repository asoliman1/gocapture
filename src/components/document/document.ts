import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {ThemeProvider} from "../../providers/theme/theme";
import {IDocument} from "../../model";
import {File} from "@ionic-native/file";
import {Platform} from "ionic-angular";

@Component({
  selector: 'document',
  templateUrl: 'document.html',
})
export class Document implements OnChanges {
  @Input() document: IDocument;
  @Output() onOpen = new EventEmitter();
  @Output() onSelect = new EventEmitter();

  private selectedTheme: String;
  private thumbnail: string;

  constructor(
    private themeProvider: ThemeProvider,
    private fileService: File,
    private platform: Platform
  ) {
    this.themeProvider.getActiveTheme().subscribe((theme) => this.selectedTheme = theme);
  }

  ngOnChanges() {
    this.prepareThumbnail();
  }

  prepareThumbnail() {
    if (!this.document.preview_urls) {
      return;
    }

    const preview_urls = typeof this.document.preview_urls === 'string' ? JSON.parse(this.document.preview_urls) : this.document.preview_urls;
    if (this.platform.is('mobile')) {
      this.thumbnail = preview_urls['small'];
    } else if (this.platform.is('tablet')) {
      this.thumbnail = preview_urls['medium'];
    } else if (this.platform.is('windows')) {
      this.thumbnail = preview_urls['large'];
    } else {
      this.thumbnail = preview_urls['normal'];
    }
  }

  select() {
    this.onSelect.emit(null);
  }

  openDocument() {
    this.onOpen.emit(null);
  }

}
