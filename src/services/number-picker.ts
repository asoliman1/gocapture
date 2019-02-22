import { Injectable } from "@angular/core";
import { WheelSelector } from '@ionic-native/wheel-selector';


@Injectable()
export class NumberPicker {


  constructor(private selector: WheelSelector) {
    //
  }

  show(title, options: any[], key) {

   return this.selector.show({
      title: title,
      items: [options],
      displayKey: key
   })
  }
}

