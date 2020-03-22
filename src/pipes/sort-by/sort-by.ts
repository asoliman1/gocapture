import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SortByPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'sortBy',
  pure: false
})
export class SortByPipe implements PipeTransform {

  transform(value: any, ...args) {
    let ascending = args[1] || 1;
    if (value) {
      let data = value.sort((a: any, b: any) => {
        let date1 = new Date(a[args[0]]);
        let date2 = new Date(b[args[0]]);
        if (date1 > date2) {
          return 1 * ascending;
        } else if (date1 < date2) {
          return -1 * ascending;
        } else {
          return 0;
        }
      });
      return data;
    }

  }
}
