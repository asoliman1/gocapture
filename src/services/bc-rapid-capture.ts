import { Injectable } from "@angular/core";
import {FormElement} from "../model";
import {RapidCapture} from "./rapid-capture-service";

@Injectable()

export class BCRapidCapture implements RapidCapture {
	constructor() {
	  //
	}

  capture(element: FormElement): Promise<string[]> {
    return undefined;
  }

}
