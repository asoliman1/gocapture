import {Injectable} from "@angular/core";
import {ELocalNotificationTriggerUnit, ILocalNotification, LocalNotifications} from "@ionic-native/local-notifications";
import {ISubscription} from "rxjs/Subscription";
import {SettingsService} from "./settings-service";
import {settingsKeys} from "../constants/constants";
import {Platform} from "ionic-angular";

@Injectable()
export class LocalNotificationsService {

  actionSub: ISubscription;

	constructor(private localNotifications: LocalNotifications,
              private settingsService: SettingsService,
              private platform: Platform) {
	  this.checkPermissions();
	}

	cancelAll () {
	  this.localNotifications.cancelAll();
  }

  async scheduleUnsubmittedLeadsNotification() {
	  let hasPermission = await this.localNotifications.hasPermission();

	  if (!hasPermission) {
	    return;
    }

	  this.settingsService.getSetting(settingsKeys.REMIND_ABOUT_UNSUBMITTED_LEADS).subscribe(result => {
	    let remindObj = JSON.parse(result);
	    if (remindObj && remindObj['remind']) {
        this.localNotifications.cancelAll().then(result => {
          let options: ILocalNotification = {
            id: 1,
            text: 'You have leads that have not been submitted. Please open the GoCapture! app and submit them.',
            launch: true,
            priority: 2,
            foreground: false
          };

          options["trigger"] = {in: remindObj['interval'], unit: ELocalNotificationTriggerUnit.HOUR};

          this.localNotifications.schedule(options);

          // if (this.actionSub) {
          //   this.actionSub.unsubscribe();
          // }
          //
          // this.actionSub = this.localNotifications.on('click').subscribe((success) => {
          //   //
          // });
        });
      }
    });
  }

	private onNotification() {
	  //
	}

	private async checkPermissions() {
    return await this.localNotifications.hasPermission();
  }

}
