import { Activation } from './../../model/activation';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ActivationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ActivationsProvider {

  public activations : Activation[] = [];
  
  constructor(public http: HttpClient) {
    console.log('Hello ActivationsProvider Provider');
  }

}
