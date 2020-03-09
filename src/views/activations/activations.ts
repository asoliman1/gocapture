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


@Component({
  selector: 'page-activations',
  templateUrl: 'activations.html',
})
export class ActivationsPage {
  searchMode = false;

  searchTrigger = "hidden";

  @ViewChild("search") searchbar: Searchbar;

  loading : boolean;
  sortBy  = ACTIVATIONS_PARAMS.SORT_BY.UPDATE_DATE;
  sortOrder = ACTIVATIONS_PARAMS.SORT_ORDER.DESC;
  activations : { activations : Activation[] , form : Form }[] = [];
  filteredActivations : { activations : Activation[] , form : Form }[] = [] ;
  isThereNoActivations: boolean = false;
  
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
    this.restClient.getAllActivations(this.formsProvider.forms,{sort_by : this.sortBy,sort_order : this.sortOrder}).subscribe((data)=>{
      this.activations = [...this.activations, data];
      this.filteredActivations = [...this.filteredActivations, data];
      this.loading = false;
      console.log("filteredActivations",this.filteredActivations[0].activations.length)
      if(this.filteredActivations[0].activations.length > 0) this.isThereNoActivations = false
      else this.isThereNoActivations = true
    },err =>{
      console.log(err)
      this.loading = false;
    })
  }

  getFormActivations(form : Form){
    this.restClient.getFormActivations(form,{sort_by : this.sortBy,sort_order : this.sortOrder}).subscribe((activations)=>{
      this.activations.push({activations , form})
      this.filteredActivations.push({activations , form});
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
    this.filteredActivations.forEach((e,i)=>{
      e.activations = this.activations[i].activations.filter(act => {
      return !val || regexp.test(act.name);
    });
  });

  }

}
