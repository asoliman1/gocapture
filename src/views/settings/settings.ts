import { SyncClient } from './../../services/sync-client';
import { OptionItem } from './../../model/option-item';
import { Component } from '@angular/core';
import { User } from "../../model";
import { DBClient } from "../../services/db-client";
import { BussinessClient } from "../../services/business-service";
import { AppVersion } from '@ionic-native/app-version';
import { Login } from "../login";
import { LogView } from "../log";
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { App, Platform } from "ionic-angular";
import { LogClient } from "../../services/log-client";
import { Popup } from "../../providers/popup/popup";
import { ThemeProvider } from "../../providers/theme/theme";
import { Observable } from "rxjs";
import { settingsKeys } from "../../constants/constants";
import { NumberPicker } from "../../services/number-picker";
import { BadgeRapidCapture } from '../../services/badge-rapid-capture';
import { ScannerType } from '../../components/form-view/elements/badge/Scanners/Scanner';
import { Geolocation } from '@ionic-native/geolocation';
import { Localization } from '../../model/localization';
import { TranslateConfigService } from '../../services/translate/translateConfigService';
import { LocalizationsPage } from '../localizations/localizations';
import { DateTimeOptions } from '../../model/date-time-options';

@Component({
  selector: 'settings',
  templateUrl: 'settings.html'
})

export class Settings {

  settings: any = {};
  user: User = <any>{};
  shouldSave: boolean = false;
  version: string;
  private selectedTheme;
  localization: Localization;
  keyboard = "numeric";
  dateValue = "standard";
  timeValue = "standard";
  dateTimeValue = "standard";
  dates = DateTimeOptions.datePicker; 
  times = DateTimeOptions.timePicker;
  datesTimes = DateTimeOptions.dateTimePicker;

  constructor(
    private db: DBClient,
    private client: BussinessClient,
    private modalCtrl: ModalController,
    private appVersion: AppVersion,
    public app: App,
    private logger: LogClient,
    private popup: Popup,
    private themeProvider: ThemeProvider,
    private numberPicker: NumberPicker,
    private badgeScanner: BadgeRapidCapture,
    public geolocation : Geolocation,
    private businessService : BussinessClient,
    private syncClient: SyncClient,
    private translateConfigService: TranslateConfigService,
    private platform : Platform) {

    this.appVersion.getVersionNumber().then((version) => {
      this.version = version;
    });
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
    this.settings.remindAboutUnsubmittedLeads = {};
  }

  ionViewWillEnter() {
    this.setConfig();
  }

  onChangevalue(){
    console.log("keyboard", this.settings.numbersKeyboard);
    console.log("date", this.dateValue);
    console.log("time", this.timeValue);
    console.log("date time", this.dateTimeValue);
  }

  

  setConfig() {
    this.db.getAllConfig().subscribe(settings => {

      if (!settings[settingsKeys.REMIND_ABOUT_UNSUBMITTED_LEADS]) {
        settings[settingsKeys.REMIND_ABOUT_UNSUBMITTED_LEADS] = { remind: false, interval: 0 };
      } else {
        settings[settingsKeys.REMIND_ABOUT_UNSUBMITTED_LEADS] = JSON.parse(settings['remindAboutUnsubmittedLeads']);
      }
      settings[settingsKeys.AUTO_UPLOAD] = settings[settingsKeys.AUTO_UPLOAD] ? JSON.parse(settings[settingsKeys.AUTO_UPLOAD]) : true;

      this.settings = settings;

      if (typeof settings[settingsKeys.ENABLE_LOGGING] == "undefined") {
        this.settings.enableLogging = true;
      }

      if (typeof settings[settingsKeys.AUTOSAVE_BC_CAPTURES] == "undefined") {
        this.settings.autosaveBCCaptures = true;
      }

      if (typeof settings[settingsKeys.SINGLE_TAP_SELECTION] == "undefined") {
        this.settings.singleTapSelection = true;
      }

      if (typeof settings[settingsKeys.NUMBERS_KEYBOARD] == "undefined") {
        this.settings.numbersKeyboard = "numeric";
      }
      if (typeof settings[settingsKeys.DATE_PICKER] == "undefined") {
        this.settings.datePicker = "standard";
      }
      if (typeof settings[settingsKeys.TIME_PICKER] == "undefined") {
        this.settings.timePicker = "standard";
      }
      if (typeof settings[settingsKeys.DATE_TIME_PICKER] == "undefined") {
        this.settings.dateTimePicker = "standard";
      }

      this.db.getRegistration().subscribe(user => {
        this.user = user;
        this.shouldSave = false;
        this.setLocalization();
      });
      
    });

  }

  updateUser(result : any) {
    this.user.localizations = result.localizations;
    this.user.localization = result.localization;
    this.db.saveRegistration(this.user).subscribe();
  }
  
  onLocalization() {
    let localizationPage = this.modalCtrl.create(LocalizationsPage, { items: this.localizations(), shouldShowSearch: false });
    localizationPage.onDidDismiss((localization: Localization) => {
      if (localization) {
        this.popup.showLoading({text:'alerts.loading.processing'});
        this.client.updateAccountSettings({'localization': localization.id})
          .subscribe((result) => {
            this.updateUser(result);
            this.platform.setDir(localization.id == 'ar' ? 'rtl' : 'ltr',true);
            this.translateConfigService.setLanguage(localization.id);
            this.syncClient.download(null).subscribe();
            this.localization = localization;
            this.popup.dismissAll();
          }, (error) => {
            this.popup.dismissAll();
          })
      }
    });
    localizationPage.present();
  }

  setLocalization() {
    //console.log(this.user.localization,this.translateConfigService.defaultLanguage())
    if (this.user.localization && this.user.localizations) {
      this.localization = this.user.localizations.find((localization) => localization.id == this.user.localization );
    } else {
      this.localization = this.user.localizations.find((localization) => this.translateConfigService.defaultLanguage() == localization.id);
    }
  }

  localizations() {
    let items = [];
    if (this.user.localizations) {
      this.user.localizations.forEach((localization, index) => {
        let optionItem = this.localizationToOptionItem(localization, index);
        items.push(optionItem);
        if (this.user.localization && (this.user.localization == localization.id)) {
          optionItem.isSelected = true;
        }
      });
    } else {
      let optionItem = this.localizationToOptionItem(this.localization, 0);
      optionItem.isSelected = false;
      items.push(optionItem);
    }
    return items;
  }

  localizationToOptionItem(localization: Localization, index: number): OptionItem {
    return new OptionItem({
      id: index.toString(),
      title: localization.name,
      subtitle: null,
      search:localization.name,
      value: localization
    });
  }


  getName(user: User) {
    let name = "";
    if (user) {
      if (user.first_name) {
        name += user.first_name;
      }
      if (user.last_name) {
        if (name.length > 0) {
          name += " ";
        }
        name += user.last_name;
      }
    }
    return name;
  }

  showLogs() {
    let modal = this.modalCtrl.create(LogView);
    modal.present();
  }

  onChange() {
    this.shouldSave = true;
    setTimeout(async () => {
     await this.saveSettings();
    }, 1)
  }

  onUnsubmittedLeadsReminderChange() {
    if (this.settings.remindAboutUnsubmittedLeads.remind) {

      let hours = [];
      for (let i = 1; i < 24; i++) {
        hours.push({ value: i, label: i + ' h' });
      }

      let selectedIndex = 1;

      this.numberPicker.show('Remind me about leads', hours, [{ index: 0, value: hours[selectedIndex]["label"] }], 'label').then(result => {
        let selectedOption = result[0];
        let selectedIndex = parseInt(selectedOption.index);
        this.settings.remindAboutUnsubmittedLeads.interval = hours[selectedIndex].value;
        this.saveSettings().then(result => {
          this.client.scheduleUnsubmittedLeadsNotification();
        });
      }, error => {
        this.settings.remindAboutUnsubmittedLeads = { remind: false, interval: 0 };
        this.saveSettings().then(result => {
          this.client.cancelUnsubmittedLeadsNotification();
        });
      });
    } else {
      this.settings.remindAboutUnsubmittedLeads = { remind: false, interval: 0 };
      this.saveSettings().then(result => {
        this.client.cancelUnsubmittedLeadsNotification();
      });

    }
  }


  onChangeEnableLogging() {
    this.logger.enableLogging(this.settings.enableLogging);
    this.onChange();
  }

  async saveSettings() {

    return new Promise((resolve, reject) => {
      let autoUpload = this.db.saveConfig(settingsKeys.AUTO_UPLOAD, this.settings.autoUpload);
      let enableLogging = this.db.saveConfig(settingsKeys.ENABLE_LOGGING, this.settings.enableLogging);
      let kioskModePassword = this.db.saveConfig(settingsKeys.KIOSK_MODE_PASSWORD, this.settings.kioskModePassword);
      let autosaveBCCaptures = this.db.saveConfig(settingsKeys.AUTOSAVE_BC_CAPTURES, this.settings.autosaveBCCaptures);
      let remindAboutUnsubmittedLeads = this.db.saveConfig(settingsKeys.REMIND_ABOUT_UNSUBMITTED_LEADS, JSON.stringify(this.settings.remindAboutUnsubmittedLeads));
      let singleTapSelection = this.db.saveConfig(settingsKeys.SINGLE_TAP_SELECTION, this.settings.singleTapSelection);
      let autoCrop = this.db.saveConfig(settingsKeys.AUTO_CROP, this.settings.autoCrop);
      let numbersKeyboard = this.db.saveConfig(settingsKeys.NUMBERS_KEYBOARD, this.settings.numbersKeyboard);
      let datePicker = this.db.saveConfig(settingsKeys.DATE_PICKER, this.settings.datePicker);
      let timePicker = this.db.saveConfig(settingsKeys.TIME_PICKER, this.settings.timePicker);
      let dateTimePicker = this.db.saveConfig(settingsKeys.DATE_TIME_PICKER, this.settings.dateTimePicker);

      Observable.zip(autoUpload,
        enableLogging,
        kioskModePassword,
        autosaveBCCaptures,
        remindAboutUnsubmittedLeads,
        singleTapSelection,
        autoCrop,
        numbersKeyboard,
        datePicker,
        timePicker,
        dateTimePicker).subscribe(() => {
        this.shouldSave = false;
        resolve(true);
      }, error => {
        reject(error);
      });
    });
  }

  // A.S GOC-300
  testBadgeScanner() {
    this.popup.showActionSheet('alerts.settings.select-barcode', [
      {
        text: 'Barcode', handler: () => {
          this.badgeScanner.testCapture(ScannerType.Barcode);
        }
      }, {
        text: 'NFC', handler: () => {
          this.badgeScanner.testCapture(ScannerType.Nfc);
        }
      }, { text: 'general.cancel', role: 'cancel' }
    ], this.selectedTheme)
  }

  unauthenticate() {
    const buttons = [
      {
        text: 'general.cancel',
        handler: () => {
        }
      },
      {
        text: 'general.unauthenticate',
        handler: () => {
          if(this.businessService.isOnline() ){
            // A.S
            this.popup.showLoading({text:'alerts.loading.unauthenticating'})
            this.client.unregister(this.user).subscribe(() => {
              this.popup.dismiss('loading');
              this.themeProvider.rmTheme();
              setTimeout(() => {
                this.app.getRootNav().setRoot(Login, { unauthenticated: true });
              }, 300);
            },(error)=>{
              console.log(error);
              this.popup.dismiss('loading');
            })
          }
          else this.popup.showToast({text:'toast.no-internet-connection'},"top","warning") // A.S GOC-324
        }
      }
    ];
    this.popup.showAlert("alerts.settings.unauthenticate.title", {text:"alerts.settings.unauthenticate.message"}, buttons, this.selectedTheme);
  }


  showOptions(pickerType: string) {
    let search = this.modalCtrl.create('SearchPage', {items: this.getOptions(pickerType)});
    search.onDidDismiss(data => {
      if(data){
      if(pickerType== "date") this.settings.datePicker = data;
      if (pickerType== "time") this.settings.timeValue = data;
      if(pickerType == "dateTime") this.settings.dateTimeValue = data;
      }
    });
    search.present();
}

  getOptions(pickerType: string){
    let items = [];
    let pickerData: any ;
    if(pickerType== "date") pickerData = DateTimeOptions.datePicker;
    else if (pickerType== "time") pickerData = DateTimeOptions.timePicker;
    else pickerData = DateTimeOptions.dateTimePicker;
    pickerData.forEach((item) => {
      let optionItem = new OptionItem({
        id: item.id.toString(),
        title: item.label,
        subtitle: null,
        search: item.label,
        value: item.value});
        if(pickerType== "date") optionItem.isSelected = this.settings.datePicker == item.label;
        else if(pickerType== "time") optionItem.isSelected = this.settings.timePicker == item.label;
        else  optionItem.isSelected = this.settings.dateTimePicker == item.label;
      items.push(optionItem);
    });
    return items;
}

}
