import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {ThemeProvider} from "../../providers/theme/theme";
import {IDocument} from "../../model";
import {Platform} from "ionic-angular";

@Component({
  selector: 'document',
  templateUrl: 'document.html',
})
export class Document implements OnChanges {
  @Input() document: IDocument;
  @Output() onOpen = new EventEmitter();
  @Output() onSelect = new EventEmitter();

  public selectedTheme: String;
  public thumbnail: string;
  fallbackUrl : string;
  public isWindows: boolean;

  constructor(
    private themeProvider: ThemeProvider,
    private platform: Platform
  ) {
    this.isWindows = !this.platform.is('mobile');
    this.themeProvider.getActiveTheme().subscribe((theme) => {
      this.selectedTheme = theme;
      this.fallbackUrl = `assets/images/doc-placeholder-${theme.replace('-theme','')}.png`
    });
  }

  ngOnChanges() {
    this.prepareThumbnail();
  }

  prepareThumbnail() {
    if (!this.document.preview_urls) {
      return;
    }

    const preview_urls = typeof this.document.preview_urls === 'string' ? JSON.parse(this.document.preview_urls) : this.document.preview_urls;
    if (this.platform.is('tablet')) {
      this.thumbnail = preview_urls['medium'];
    } else if (this.platform.is('mobile')) {
      this.thumbnail = preview_urls['small'];
    } else {
      this.thumbnail = preview_urls['large'];
    }
  }

  select() {
    this.onSelect.emit(null);
  }

  openDocument() {
    this.onOpen.emit(null);
  }

  onWindowsImageLoadError(event) {
    console.log("Failed to load document image on windows");
    console.log(event);
    this.thumbnail = this.fallbackUrl;
  }
}
