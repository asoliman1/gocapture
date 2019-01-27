import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeIntervalPipe',
})
export class TimeIntervalPipe implements PipeTransform {

  transform(time: number) {
    if (time > 0) {
      let seconds = Math.floor(time / 1000);
      let minutes = Math.floor(seconds / 60);
      minutes %= 60;
      seconds %= 60;
      return this.pad2(minutes) + ":" + this.pad2(seconds);
    }
    return '00:00';
  }

  pad2(number) {
    return (number < 10 ? '0' : '') + number
  }


}
