import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";


@Pipe({name: 'convertFileSrc'})
export class ConvertFileSrcPipe implements PipeTransform {
  private win: any = window;

  constructor(private domSanitizer: DomSanitizer) {
  }

  transform(value: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.win.Ionic.WebView.convertFileSrc(value)
    );
  }

}
