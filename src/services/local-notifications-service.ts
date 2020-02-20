import { TranslateService } from '@ngx-translate/core';
import { Injectable } from "@angular/core";
import { ELocalNotificationTriggerUnit, ILocalNotification, LocalNotifications } from "@ionic-native/local-notifications";
import { ISubscription } from "rxjs/Subscription";
import { SettingsService } from "./settings-service";
import { settingsKeys } from "../constants/constants";

@Injectable()
export class LocalNotificationsService {

  actionSub: ISubscription;

  constructor(
    private localNotifications: LocalNotifications,
    private settingsService: SettingsService,
    private translate : TranslateService
    ) {
    this.checkPermissions();
  }

  cancelAll() {
    this.localNotifications.cancelAll();
  }

  async scheduleUnsubmittedLeadsNotification() {
    let hasPermission = await this.localNotifications.hasPermission();

    if (!hasPermission) {
      return;
    }

    this.settingsService.getSetting(settingsKeys.REMIND_ABOUT_UNSUBMITTED_LEADS).subscribe((result) => {
      if (!result || result.length == 0) {
        return;
      }
      let remindObj = JSON.parse(result);
      if (remindObj && remindObj['remind']) {
        this.localNotifications.cancelAll().then(result => {
          let options: ILocalNotification = {
            id: 1,
            smallIcon: 'res://drawable/icon_notif.png',
            text: this.translate.instant('notifications.submit-reminder'),
            launch: true,
            priority: 2,
            foreground: false
          };

          options["trigger"] = { in: remindObj['interval'], unit: ELocalNotificationTriggerUnit.HOUR };

          this.localNotifications.schedule(options);

        });
      }
    });
  }

  private onNotification() {
    //
  }

	private async checkPermissions() {
    try {
      return await this.localNotifications.hasPermission();
    } catch (err) {
      console.log("[Checking localNotification permissions]");
      console.log(err);
    }
  }

}
