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


@Component({
  selector: 'page-activations',
  templateUrl: 'activations.html',
})
export class ActivationsPage {
  searchMode = false;

  searchTrigger = "hidden";

  @ViewChild("search") searchbar: Searchbar;

  activations : Activation[] = [];
  loading : boolean;
  sortBy  = ACTIVATIONS_PARAMS.SORT_BY.UPDATE_DATE;
  sortOrder = ACTIVATIONS_PARAMS.SORT_ORDER.DESC;
  filteredActivations : Activation[] = [];
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams , 
    private activationsProvider:ActivationsProvider,
    private formsProvider : FormsProvider,
    private restClient: RESTClient) {
      this.getData(this.navParams.get("form"));
  }

  getData(form ? : Form){
    this.loading = true;
    if(form) this.getFormActivations(form)
    else this.getAllActivations();
  }

  getAllActivations(){
    this.activations = [];
    this.restClient.getAllActivations(this.formsProvider.forms,{sort_by : this.sortBy,sort_order : this.sortOrder}).subscribe((data)=>{
      this.activations = [...this.activations, ...data.activations];
      this.filteredActivations = [...this.filteredActivations, ...data.activations];
      this.loading = false;
    },err =>{
      this.loading = false;
    })
  }

  getFormActivations(form : Form){
    this.activations = [];
    this.restClient.getFormActivations(form,{sort_by : this.sortBy,sort_order : this.sortOrder}).subscribe((data)=>{
      this.activations = data;
      this.filteredActivations = data;
      this.loading = false;
    },err =>{
      this.loading = false;
    })
  }

  ionViewDidLoad() {
  }

  toggleSearch() {
    this.searchMode = !this.searchMode;
    this.filteredActivations = this.activations;
    this.searchTrigger = this.searchMode ? "visible" : "hidden";
    if (this.searchMode) {
      setTimeout(() => {
        if (this.searchbar)
          this.searchbar.setFocus();
      }, 100);
    }
  }

  getItems(event) {
    let val = event.target.value;
    let regexp = new RegExp(val, "i");
    this.filteredActivations = this.activations.filter(act => {
      return !val || regexp.test(act.name);
    });
  }

  navigate(act : Activation){
    if(act.activation_capture_form_after)
    this.navCtrl.push(ActivationViewPage,{activation:{...act}});
    else this.navCtrl.push(FormCapture,{activation:act,form:act.event});
  }

}
