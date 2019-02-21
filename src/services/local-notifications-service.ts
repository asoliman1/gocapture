import { Injectable } from "@angular/core";
import {ILocalNotification, LocalNotifications} from "@ionic-native/local-notifications";
import {ISubscription} from "rxjs/Subscription";

@Injectable()
export class LocalNotificationsService {

  actionSub: ISubscription;

	constructor(private localNotifications: LocalNotifications) {
	  this.checkPermissions();
	}

	clearAll () {
	  this.localNotifications.clearAll();
  }

  async scheduleUnsubmittedLeadsNotification() {
	  let hasPermission = await this.localNotifications.hasPermission();

	  if (!hasPermission) {
	    return
    }

    this.localNotifications.clearAll().then(result => {

      let options: ILocalNotification = {
        id: 1,
        text: 'You have leads that have not been submitted. Please open the GoCapture! app and submit them.',
        launch: false,
        trigger: {at: new Date(new Date().getTime() + 1000 * 60)},
        priority: 2,
        foreground: false
      };

      this.localNotifications.schedule(options);

      if (this.actionSub) {
        this.actionSub.unsubscribe();
      }

      this.actionSub = this.localNotifications.on('click').subscribe((success) => {
        //
      });
    });
  }

	private onNotification() {
	  //
	}

	private async checkPermissions() {
    return await this.localNotifications.hasPermission();
  }

}
