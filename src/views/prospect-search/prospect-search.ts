import { Component, NgZone } from '@angular/core';
import { Form } from "../../model";
import { BussinessClient } from "../../services/business-service";
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import {OptionItem} from "../../model/option-item";
import {SearchPage} from "../search/search";
import {ThemeProvider} from "../../providers/theme/theme";
import {SettingsService} from "../../services/settings-service";

@Component({
  selector: 'prospect-search',
  templateUrl: 'prospect-search.html'
})
export class ProspectSearch extends SearchPage {
  static formId = "";

  loading = true;

  form: Form;

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public client: BussinessClient,
    public zone: NgZone,
    public themeProvider: ThemeProvider,
    public settingsService: SettingsService) {
    super(navParams, viewCtrl, themeProvider, settingsService);

    //
  }

  ionViewWillEnter() {
    this.form = this.navParams.get("form");
    this.loading = true;
    this.client.getContacts(this.form)
      .subscribe(contacts => {
        this.zone.run(()=>{
          this.loading = false;
          let sortedItems = [];
          contacts.forEach((contact, index) => {
            let optionItem = new OptionItem({
              id: index.toString(),
              title: this.getTitle(contact.fields.FirstName,contact.fields.LastName),
              subtitle: contact.fields.Email,
              search: contact['search'],
              value: contact
            });
            sortedItems.push(optionItem);
          });

          sortedItems.sort((item1, item2) => {
            let textA = item1.title.toLowerCase();
            let textB = item2.title.toLowerCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });

          this.items = sortedItems;
          this.content.resize();
          ProspectSearch.formId = this.form.form_id+"";
          this.onInput({target: {value: ""}})
        });
      });
  }

  getTitle(firstName : string,LastName : string){
    return LastName ? `${firstName} ${LastName}` : firstName;
  }

}
