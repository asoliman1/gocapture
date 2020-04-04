import { FormsProvider } from './../forms/forms';
import { Injectable } from '@angular/core';
import { RESTClient } from '../../services/rest-client';
import { Form } from '../../model';
import { ACTIVATIONS_PARAMS } from '../../constants/activations-params';
import { Activation } from '../../model/activation';

const storageKey = 'activations';

@Injectable()
export class ActivationsProvider {

  hasNewData: boolean;
  sortBy = ACTIVATIONS_PARAMS.SORT_BY.UPDATE_DATE;
  sortOrder = ACTIVATIONS_PARAMS.SORT_ORDER.DESC;
  isThereNoActivations: boolean = false;

  constructor(
    private restClient: RESTClient,
    private formsProvider:FormsProvider) {
  }


  getActivation(id: string) {
    return this.restClient.getActivationById(id)
    .switchMap((data: any) => 
      this.formsProvider.getForm(data.event)
      .map((e) => Activation.parseActivation(data, e))
    )
  }


}
