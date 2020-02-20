import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Platform } from "ionic-angular/platform/platform";


@Pipe({name: 'convertFileSrc'})
export class ConvertFileSrcPipe implements PipeTransform {
  private win: any = window;

  constructor(private domSanitizer: DomSanitizer,private platform:Platform) {
  }

  transform(value: string) {
    if(this.platform.is('mobile')) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.win.Ionic.WebView.convertFileSrc(value)
      );
    }

    return this.domSanitizer.bypassSecurityTrustResourceUrl(value);
  }

}
