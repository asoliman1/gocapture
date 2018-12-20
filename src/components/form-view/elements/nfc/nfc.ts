import { Component, Input, forwardRef } from '@angular/core';
import { Form, FormElement, FormSubmission, BarcodeStatus } from "../../../../model";
import { FormGroup, NG_VALUE_ACCESSOR, AbstractControl } from "@angular/forms";
import { BaseElement } from "../base-element";

import {Ndef, NFC} from "@ionic-native/nfc";

@Component({
	selector: 'nfc',
	templateUrl: 'nfc.html',
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Nfc), multi: true }
	]
})
export class Nfc  {

	statusMessage: string = "NFC";

	constructor(private nfc: NFC, private ndef: Ndef) {
	  //
	}

	ngOnInit(){

	}

	scan() {
	  if (this.nfc.enabled()) {
      this.nfc.addNdefListener(() => {
        console.log('successfully attached ndef listener');
      }, (err) => {
        console.log('error attaching ndef listener', err);
      }).subscribe((event) => {
        let payload = event.tag.ndefMessage[0].payload;
        let tagContent = this.nfc.bytesToString(payload).substring(3);

        console.log('received ndef message. the tag contains: ', tagContent);
      });
    }
	}

}
