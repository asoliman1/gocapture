import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { Form } from '../../model/form';
import { FormsProvider } from '../../providers/forms/forms';
import { RESTClient } from '../../services/rest-client';
import { OptionItem } from '../../model/option-item';

/**
 * Generated class for the SearchActivationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search-activations',
  templateUrl: 'search-activations.html',
})
export class SearchActivationsPage {
  forms: Form[] = [];
  formName: string;
  formNames: OptionItem[];
  activationName: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,private modal: ModalController,
     public viewController: ViewController, public formsProvider: FormsProvider, private zone: NgZone,  private restClient: RESTClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchActivationsPage');
    this.updateForms();
    this.formName = this.navParams.get("formName");
    console.log("form name", this.formName);
    this.activationName = this.navParams.get("activationName")
  }

  showOptions() {
      let search = this.modal.create('SearchPage', {items: this.getOptions()});
      search.onDidDismiss(data => {
        console.log(data)
        this.formName = data;
        console.log("formName from modal", this.formName)
      });
      search.present();
  }

  getOptions() {
    let items = [];
    this.forms.forEach((item) => {
      let optionItem = new OptionItem({
        id: item.id.toString(),
        title: item.name,
        subtitle: null,
        search: item.name,
        value: item.name});
      optionItem.isSelected = this.formName == item.name;
      items.push(optionItem);
    });
    this.formNames = items;
    return items;
  }

  updateForms() {
    console.log("update forms")
    this.zone.run(() => {
      this.forms = this.formsProvider.forms;
    })
  }

  getFormName(){
    console.log(this.formName)
    console.log(this.activationName)
  }

  onCancel() {
    this.viewController.dismiss({ isCancel: true })
  }
  onSearch() {
   let theForm= this.forms.filter((f)=> f.name == this.formName)
   //console.log(theForm)
    this.viewController.dismiss({ isCancel: false, eventForm: theForm[0], activationName: this.activationName, eventName: this.formName })
  }
}
