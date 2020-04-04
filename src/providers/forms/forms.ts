import { RESTClient } from './../../services/rest-client';
import { Injectable } from '@angular/core';

@Injectable()
export class FormsProvider {

  constructor(
   private restClient:RESTClient,
  ) {}

  getForm(id : string){
   return this.restClient.getFormById(id);
  }

}
