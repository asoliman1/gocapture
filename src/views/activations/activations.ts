import { Form } from './../../model/form';
import { Activation } from './../../model/activation';
import { ActivationsProvider } from './../../providers/activations/activations';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Searchbar } from 'ionic-angular';
import { Popup } from '../../providers/popup/popup';
import { SearchActivationsPage } from '../search-activations/search-activations';
import { ThemeProvider } from '../../providers/theme/theme';

@Component({
  selector: 'page-activations',
  templateUrl: 'activations.html',
})
export class ActivationsPage {
  private selectedTheme;
  searchMode = false;
  searchTrigger = "hidden";
  @ViewChild("search") searchbar: Searchbar;
  loading: boolean;
  activations: { activations: Activation[], form: Form }[] = [];
  filteredActivations: { activations: Activation[], form: Form }[] = [];
  noActivations: boolean = false;
  searchEventName: string;
  searchActivationName: string;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public activationsProvider: ActivationsProvider,
    private popup: Popup,
    private themeProvider: ThemeProvider,
  ) {
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
    this.getData(this.navParams.get("form"));
  }

  getData(form?: Form) {
    if (form) {
      this.getFormActivations(form);
      this.searchEventName = form.name;
    }
    else this.getAllActivations();
  }

  getAllActivations(name?: string) {
    this.loading = true;
    this.activationsProvider.getAllActivations(name).subscribe((data) => {
      this.activations = [...this.activations, data];
      this.filteredActivations = [...this.filteredActivations, data];
      this.loading = false;
      this.noActivations = !this.hasActivations();
    }, err => {
      this.loading = false;
    })
  }

  getFormActivations(form: Form, name?: string) {
    this.loading = true;
    this.activationsProvider.getFormActivations(form, name).subscribe((activations) => {
      this.activations.push({ activations, form });
      this.filteredActivations = this.activations;
      this.noActivations = !this.hasActivations();
      this.loading = false;
    }, err => {
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

  searchActivations(ev) {
    this.popup.showPopover(SearchActivationsPage, {
      formName: this.searchEventName,
      activationName: this.searchActivationName
    }, false, ev, this.selectedTheme + ' gc-popoverActivation').onDidDismiss((data) => {
      this.searchEventName = data.eventName;
      this.searchActivationName = data.activationName;
      if (!data.isCancel) this.onSearchDismiss(data.eventForm, data.activationName)
    })
  }

  onSearchDismiss(form: Form, actName: string) {
    this.activations = [];
    this.filteredActivations = [];
    if (!form) this.getAllActivations(actName)
    else this.getFormActivations(form, actName);
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
