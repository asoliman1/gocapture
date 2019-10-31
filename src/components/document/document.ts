import { DocumentsService } from './../../services/documents-service';
import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {ThemeProvider} from "../../providers/theme/theme";
import {IDocument} from "../../model";
import {Platform} from "ionic-angular";
import { Colors } from '../../constants/colors';

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
  color : any;

  constructor(
    private platform: Platform,
    private documentsService : DocumentsService,
    private ThemeProvider : ThemeProvider
  ) {
    this.ThemeProvider.getActiveTheme().subscribe((data)=>{
      const colorKey = data.split('-');
      this.color = Colors[colorKey[0]] || Colors[colorKey[1]] ;
    })
  }

  ngOnChanges() {
    this.prepareThumbnail();
  }
  
  ngOnInit() {
    this.fallbackUrl = `assets/images/extentions/${this.document.file_extension}.svg`;
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

  checkLoadingDoc(){
   if(this.documentsService.currentDownloadingDocs.find((e)=> e == this.document.id)) return true;
   return false;
  }

}
