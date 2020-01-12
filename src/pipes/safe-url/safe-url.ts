import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the SafeUrlPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'safeUrl',
})
export class SafeUrlPipe implements PipeTransform {
  
  constructor(private sanitized: DomSanitizer) {}

  transform(value: string, ...args) {
    return this.sanitized.bypassSecurityTrustResourceUrl(value);
  }
}
