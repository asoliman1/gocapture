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
  selector: 'localizations',
  templateUrl: 'localizations.html'
})

export class LocalizationsPage extends SearchPage {
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

}