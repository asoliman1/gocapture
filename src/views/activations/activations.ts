import { ACTIVATIONS_PARAMS } from './../../constants/activations-params';
import { FormCapture } from './../form-capture/form-capture';
import { Form } from './../../model/form';
import { ActivationViewPage } from './../../pages/activation-view/activation-view';
import { FormsProvider } from './../../providers/forms/forms';
import { RESTClient } from './../../services/rest-client';
import { Activation } from './../../model/activation';
import { ActivationsProvider } from './../../providers/activations/activations';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Searchbar } from 'ionic-angular';
import { concatStatic } from 'rxjs/operator/concat';
import { Popup } from '../../providers/popup/popup';
import { SearchActivationsPage } from '../search-activations/search-activations';
import { Observable } from "rxjs/Observable";
import { ThemeProvider } from '../../providers/theme/theme';


@Component({
  selector: 'page-activations',
  templateUrl: 'activations.html',
})
export class ActivationsPage {
  searchMode = false;

  searchTrigger = "hidden";

  @ViewChild("search") searchbar: Searchbar;

  loading: boolean;
  sortBy = ACTIVATIONS_PARAMS.SORT_BY.UPDATE_DATE;
  sortOrder = ACTIVATIONS_PARAMS.SORT_ORDER.DESC;
  activations: { activations: Activation[], form: Form }[] = [];
  filteredActivations: { activations: Activation[], form: Form }[] = [];
  isThereNoActivations: boolean = false;
  searchEventName: string;
  searchActivationName: string;
  cancelSubscription: boolean;
  getActivation: any;
  private selectedTheme;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private activationsProvider: ActivationsProvider,
    private formsProvider: FormsProvider,
    private restClient: RESTClient,
    private popup: Popup,
    private themeProvider: ThemeProvider,
  ) {
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
    this.getData(this.navParams.get("form"));
  }

  getData(form?: Form) {
    this.loading = true;
    if (form) {
      this.getFormActivations(form)
      this.searchEventName = form.name;
    }
    else this.getAllActivations();
  }

  getAllActivations() {
    this.restClient.getAllFormsWithActivations({ sort_by: this.sortBy, sort_order: this.sortOrder, group_by: 'event' }).subscribe((data) => {
      this.activations = [...this.activations, data];
      this.filteredActivations = [...this.filteredActivations, data];
      this.loading = false;
      this.isThereNoActivations = !this.hasActivations();
    }, err => {
      console.log(err)
      this.loading = false;
    })
  }

  hasActivations() {
    for (let index = 0; index < this.filteredActivations.length; index++) {
      const element = this.filteredActivations[index];
      if (element.activations.length) return true;
    }
    return false;
  }

  getFormActivations(form: Form) {
    this.restClient.getFormActivations(form, { sort_by: this.sortBy, sort_order: this.sortOrder }).subscribe((activations) => {
      this.activations.push({ activations, form })
      this.filteredActivations.push({ activations, form });
      this.isThereNoActivations = !this.hasActivations();
      this.loading = false;
    }, err => {
      this.loading = false;
    })
  }

  ionViewDidLoad() {
  }

  searchActivations() {
    this.popup.showPopover(SearchActivationsPage, {
      formName: this.searchEventName,
      activationName: this.searchActivationName
    }, false, this.selectedTheme + ' gc-popoverActivation').onDidDismiss((data) => {
      this.searchEventName = data.eventName;
      this.searchActivationName = data.activationName;
      if (!data.isCancel) this.onSearchDismiss(data.eventForm, data.activationName)
    })
  }
  onSearchDismiss(form: Form, actName: string) {
    this.activations = [];
    this.filteredActivations = [];
    this.loading = true;
    if (!form && !actName) {
      this.getAllActivations()
    }
    else if (form && actName){
      this.restClient.getFormActivations(form, { activation_name: actName }).subscribe((activations) => {
        console.log(activations)
        this.activations.push({ activations, form });
        this.filteredActivations = this.activations;
        this.isThereNoActivations = !this.hasActivations();
        this.loading = false;
      }, err => {
        this.loading = false;
      })
    }

    else if (form && !actName) {
      this.getFormActivations(form);
    }

    else this.restClient.getAllFormsWithActivations({ activation_name: actName, group_by: 'event' }).subscribe((data) => {
      this.activations = [...this.activations, data];
      this.filteredActivations = [...this.filteredActivations, data];
      this.isThereNoActivations = !this.hasActivations();
      this.loading = false;
    }, err => {
      this.loading = false;
    })
  }

  getItems(event) {
    let val = event.target.value;
    let regexp = new RegExp(val, "i");
    this.filteredActivations.forEach((e, i) => {
      e.activations = this.activations[i].activations.filter(act => {
        return !val || regexp.test(act.name);
      });
    });

  }

}
