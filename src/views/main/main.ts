import { RESTClient } from './../../services/rest-client';
import { NavParams, NavController, IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormsProvider } from '../../providers/forms/forms';
import { ActivationsProvider } from '../../providers/activations/activations';
import { ActivationViewPage } from '../../pages/activation-view/activation-view';
import { FormCapture } from '../form-capture/form-capture';
@IonicPage({
	segment: 'main/:token/:type/:id',
	name: 'Main'
})
@Component({
	selector: 'main',
	templateUrl: 'main.html'
})
export class Main {
	loading : boolean;

	constructor(private navParams: NavParams,
		private restClient: RESTClient,
		private formsProvider: FormsProvider,
		private activationProvider: ActivationsProvider,
		private navCtrl: NavController) {
		this.navigateToPage(this.navParams.data)
	}


	private navigateToPage(data: urlParams) {
		if (data.token) this.setToken(data.token);
		if ((data.type == 'form' || data.type == 'activation') && data.id)
			this['get' + data.type](data.id);
	}

	private async getform(id: string) {
		this.loading = true;
		let form = await this.formsProvider.getForm(id).toPromise();
		this.loading = false;
		this.navCtrl.push(FormCapture, { form , id});
	}

	private async getactivation(id: string) {
		let act = await this.activationProvider.getActivation(id).toPromise();
		console.log(act)
		if (act.activation_capture_form_after) this.navCtrl.push(ActivationViewPage, { act });
		else this.navCtrl.push(FormCapture, { form: act.event, act });
	}

	private setToken(token: string) {
		this.restClient.setToken(token);
	}

}

class urlParams {
	type: string;
	token: string;
	id: string;
}
