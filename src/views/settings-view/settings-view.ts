import { Component } from '@angular/core';
import { User } from "../../model";
import { DBClient } from "../../services/db-client";
import { BussinessClient } from "../../services/business-service";
import { AppVersion } from '@ionic-native/app-version';
import { Login } from "../login";
import { LogView } from "../log";
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { App } from "ionic-angular";
import { LogClient } from "../../services/log-client";
import { Popup } from "../../providers/popup/popup";
import { ThemeProvider } from "../../providers/theme/theme";
import { Observable } from "rxjs";
import { settingsKeys } from "../../constants/constants";
import { NumberPicker } from "../../services/number-picker";
import { BadgeRapidCapture } from '../../services/badge-rapid-capture';
import { ScannerType } from '../../components/form-view/elements/badge/Scanners/Scanner';
import { Geolocation } from '@ionic-native/geolocation';
import { TranslateService } from "@ngx-translate/core";
import { LocalizationsPage } from "../localizations";
import { OptionItem } from "../../model/option-item";
import { Localization } from "../../model/localization";
import { TranslateConfigService } from "../../services/translate/translateConfigService";

declare var screen;

@Component({
  selector: 'settings-view',
  templateUrl: 'settings-view.html'
})

export class SettingsView {

  settings: any = {};
  user: User = <any>{};
  shouldSave: boolean = false;
  version: string;
  private selectedTheme;
  localization: Localization;

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
    private translate: TranslateService,
    private translateConfigService: TranslateConfigService,
    private progressHud: Popup) {

    this.appVersion.getVersionNumber().then((version) => {
      this.version = version;
    });

    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
    this.settings.remindAboutUnsubmittedLeads = {};
  }

  ionViewWillEnter() {
    this.setConfig();
  }

  setConfig() {
    this.db.getAllConfig().subscribe(settings => {

      if (!settings[settingsKeys.REMIND_ABOUT_UNSUBMITTED_LEADS]) {
        settings[settingsKeys.REMIND_ABOUT_UNSUBMITTED_LEADS] = { remind: false, interval: 0 };
      } else {
        settings[settingsKeys.REMIND_ABOUT_UNSUBMITTED_LEADS] = JSON.parse(settings['remindAboutUnsubmittedLeads']);
      }

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

      this.db.getRegistration().subscribe(user => {
        this.user = user;
        this.shouldSave = false;
      });
    });

    this.setLocalization();

    this.fetchAccountSettings();
  }

  getLocation(){
    this.client.setLocation();
  }

  fetchAccountSettings() {
    this.client.getAccountSettings().subscribe((user) => {
      this.user = user;
      this.db.saveRegistration(user);
      this.setLocalization();
    })
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
    setTimeout(() => {
      this.saveSettings();
    }, 1)
  }

  onUnsubmittedLeadsReminderChange() {
    if (this.settings.remindAboutUnsubmittedLeads.remind) {

      let hours = [];
      for (let i = 1; i < 24; i++) {
        hours.push({ value: i, label: i + ' h' });
      }

      let selectedIndex = 1;

      this.numberPicker.show(this.translate.instant('general.remind-about-leads'), hours, [{ index: 0, value: hours[selectedIndex]["label"] }], 'label').then(result => {
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

      Observable.zip(autoUpload,
        enableLogging,
        kioskModePassword,
        autosaveBCCaptures,
        remindAboutUnsubmittedLeads,
        singleTapSelection,
        autoCrop).subscribe(() => {
        this.shouldSave = false;
        resolve(true);
      }, error => {
        reject(error);
      });
    });
  }

  sync() {
    this.client.getUpdates().subscribe(() => { });
  }

  // A.S GOC-300
  testBadgeScanner() {
    this.popup.showActionSheet(this.translate.instant('general.select-badge-type'), [
      {
        text: 'Barcode', handler: () => {
          this.badgeScanner.testCapture(ScannerType.Barcode);
        }
      }, {
        text: 'NFC', handler: () => {
          this.badgeScanner.testCapture(ScannerType.Nfc);
        }
      }, { text: this.translate.instant('general.cancel'), role: 'cancel' }
    ], this.selectedTheme)
  }

  unauthenticate() {
    const buttons = [
      {
        text: this.translate.instant('general.cancel'),
        handler: () => {
        }
      },
      {
        text: 'Unauthenticate',
        handler: () => {
          if(this.businessService.isOnline() ){
            // A.S
            this.popup.showLoading('Unauthenticating...');
            this.client.unregister(this.user).subscribe(() => {
              this.popup.dismiss('loading');
              this.themeProvider.setActiveTheme();
              setTimeout(() => {
                this.app.getRootNav().setRoot(Login, { unauthenticated: true });
              }, 300);
            },(error)=>{
              console.log(error);
              this.popup.dismiss('loading');
            })
          }
          else this.popup.showToast(this.translate.instant('toast.no-internet-connection'),"top","warning") // A.S GOC-324
        }
      }
    ];
    this.popup.showAlert(this.translate.instant('settings.unauthenticate.title'),
      this.translate.instant('settings.unauthenticate.message'), buttons, this.selectedTheme);
  }

  onLocalization() {
    let localizationPage = this.modalCtrl.create(LocalizationsPage, { items: this.localizations() });
    localizationPage.onDidDismiss((localization: Localization) => {
      if (localization) {
        this.popup.showLoading('Processing...');
        this.client.updateAccountSettings({'localization': localization.id})
          .subscribe((result) => {
            this.translateConfigService.setLanguage(localization.id);
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
    if (this.user.localization && this.user.localizations) {
      this.localization = this.user.localizations.filter((localization) => {
        return localization.id == this.user.localization
      })[0];
    } else {
      this.localization = new Localization();
      this.localization.id = 'en';
      this.localization.name = 'English';
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
}
