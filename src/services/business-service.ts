import { FormsProvider } from './../providers/forms/forms';
import { Util } from './../util/util';
import { AppPreferences } from '@ionic-native/app-preferences';
import { Popup } from './../providers/popup/popup';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from "rxjs/Subscription";
import { Config } from '../config';
import {
  DeviceFormMembership,
  Form,
  FormSubmission,
  SubmissionStatus,
  User
} from '../model';
import { AuthenticationRequest } from '../model/protocol';
import { DBClient } from './db-client';
import { RESTClient } from './rest-client';
import { SyncClient } from './sync-client';
import { PushClient } from "./push-client";
import { Network } from '@ionic-native/network';
import { StatusResponse } from "../model/protocol/status-response";
import { LocalNotificationsService } from "./local-notifications-service";
import { settingsKeys } from '../constants/constants';
import { SettingsService } from './settings-service';
import { Geolocation } from '@ionic-native/geolocation';
import { SubmissionsProvider } from '../providers/submissions/submissions';
declare var cordova: any;

@Injectable()
/**
 * The client to rule them all. The BussinessClient connects all the separate cients and creates
 * usable action flows. For example, authentication is a complex flow consisting of the actual auth
 * profile photos download, saving the registration response to the local database and starting up
 * the initial sync.
 *
 */
export class BussinessClient {

  protected networkSource: BehaviorSubject<"ON" | "OFF">;
  /**
   * Error event
   */
  network: Observable<"ON" | "OFF">;

  private networkOn: Subscription;
  private networkOff: Subscription;

  private online: boolean = true;

  private registration: User;

  private setup: boolean = false;

  private errorSource: BehaviorSubject<any>;

  private pushSubs: Subscription[] = [];
  /**
   * Error event
   */
  error: Observable<any>;



  constructor(
    private db: DBClient,
    private rest: RESTClient,
    private sync: SyncClient,
    private push: PushClient,
    private net: Network,
    private localNotificationsService: LocalNotificationsService,
    private appPreferences: AppPreferences,
    private util: Util,
    private formsProvider: FormsProvider,
    private submissionsProvider : SubmissionsProvider,
    private settingsService: SettingsService,
    private geolocation: Geolocation,
    private popup: Popup) {

    this.networkSource = new BehaviorSubject<"ON" | "OFF">(null);
    this.network = this.networkSource.asObservable();

    this.networkOff = this.net.onDisconnect().subscribe(() => {
      console.log("network was disconnected :-(");
      this.setOnline(false);
    });

    this.networkOn = this.net.onConnect().subscribe(() => {
      console.log("network was connected");
      this.setOnline(true);
    });

    this.errorSource = new BehaviorSubject<any>(null);
    this.error = this.errorSource.asObservable();

  }

  public isOnline(): boolean {
    return this.online;
  }

  private setOnline(val: boolean) {
    this.online = val;
    this.networkSource.next(val ? "ON" : "OFF");
    this.rest.setOnline(val);
    this.doAutoSync();
  }

  public doAutoSync() {
    if (this.isOnline()) {
      this.db.isWorkDbInited() && this.db.getConfig("autoUpload").flatMap((val) => {
        if (val + "" == "true") {
          return this.doSync();
        }
        this.scheduleUnsubmittedLeadsNotification();
        return Observable.empty();
      }).subscribe(() => {
        console.log("Sync up done");
        this.scheduleUnsubmittedLeadsNotification();
      }, (error) => {
        console.error(error);
      });
    } else {
      this.popup.showToast('No internet connection available.', "top", "warning")
    }
  }


  public scheduleUnsubmittedLeadsNotification() {
    this.getToSubmitLeads().subscribe(leads => {
      if (leads && leads.length > 0) {
        this.localNotificationsService.scheduleUnsubmittedLeadsNotification();
      }
    });
  }

  public cancelUnsubmittedLeadsNotification() {
    this.localNotificationsService.cancelAll();
  }

  public setupNotifications() {
    if (!this.setup) {
      this.setup = true;
      this.pushSubs.push(this.push.error.subscribe((err) => {
        // console.error("notification", err);
        // console.error(JSON.stringify(err));
      }));

      this.pushSubs.push(this.push.notification.subscribe((note) => {

        if (!note) {
          return;
        }

        this.handlePush(note);

      }));

      this.pushSubs.push(this.push.registration.subscribe((regId) => {
        if (!regId) {
          return;
        }
        this.db.updateRegistration(regId).subscribe((ok) => {
          this.rest.registerDeviceToPush(regId, true).subscribe((done) => {
            if (done) {
              this.registration.pushRegistered = 1;
              this.db.saveRegistration(this.registration).subscribe(() => {
                //done
              });
            }
          });
        });
      }));
      this.push.initialize();
    }
  }

  public getRegistration(registerForPush?: boolean): Observable<User> {
    return new Observable<User>((obs: Observer<User>) => {
      this.db.getRegistration().subscribe((user) => {
        if (user) {
          this.registration = user;
          this.db.setupWorkDb(user.db);
          this.formsProvider.setForms();
          this.rest.token = user.access_token;
          obs.next(user);
          obs.complete();
        } else {
          obs.next(user);
          obs.complete();
        }
      })
    });
  }

  // A.S
  setLocation(timeout = 2000) {
    setTimeout(() => {
      console.log('Getting location')
      this.util.setPluginPrefs()
      this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 5000 }).then(position => {
        let location = this.setLocationParams(position);
        // console.log('Current location data : ' + location);
        this.settingsService.setSetting(settingsKeys.LOCATION, location).subscribe()
      }).catch((err) => {
        console.log('Error getting location')
        console.log(err);
        this.settingsService.setSetting(settingsKeys.LOCATION, '').subscribe()
      });
    }, timeout);

  }


  setLocationParams(position) {
    let location: any = {};
    let coords: any = {};
    coords.latitude = position.coords.latitude;
    coords.longitude = position.coords.longitude;
    coords.altitude = position.coords.altitude;
    coords.accuracy = position.coords.accuracy;
    coords.altitudeAccuracy = position.coords.altitudeAccuracy;
    coords.heading = position.coords.heading;
    coords.speed = position.coords.speed;
    location.coords = coords;
    location.timestamp = position.timestamp;
    return JSON.stringify(location)
  }


  public validateKioskPassword(password: string): Observable<boolean> {
    return new Observable<boolean>((obs: Observer<boolean>) => {
      this.db.getConfig("kioskModePassword").subscribe((pwd) => {
        obs.next(pwd && password && password == pwd);
        obs.complete();
      }, err => {
        obs.error(err);
      });
    });
  }

  public setKioskPassword(password: string): Observable<boolean> {
    return new Observable<boolean>((obs: Observer<boolean>) => {
      this.db.saveConfig("kioskModePassword", password).subscribe((done) => {
        obs.next(done);
        obs.complete();
      }, err => {
        obs.error(err);
      });
    });
  }

  public hasKioskPassword(): Observable<boolean> {
    return new Observable<boolean>((obs: Observer<boolean>) => {
      this.db.getConfig("kioskModePassword").subscribe((pwd) => {
        obs.next(pwd != null && pwd.length > 0);
        obs.complete();
      }, err => {
        obs.error(err);
      });
    });
  }

  public authenticate(email, authCode): Observable<{ user: User, message: string }> {
    return new Observable<{ user: User, message: string }>((obs: Observer<{ user: User, message: string }>) => {
      let req = new AuthenticationRequest();
      req.invitation_code = authCode;
      req.device_name = email;
      this.rest.authenticate(req).subscribe(reply => {
        this.util.checkFilesDirectories();
        this.registration = reply;
        reply.pushRegistered = 1;
        reply.is_production = Config.isProd ? 1 : 0;
        this.db.makeAllAccountsInactive().subscribe((done) => {
          this.db.saveRegistration(reply).subscribe((done) => {
            this.db.setupWorkDb(reply.db);
            this.setLocation(3000);
            obs.next({ user: reply, message: "Done" });
            obs.complete();
          }, err => {
            console.log(err);
          });
        }, err => {
          console.log(err);
        });
      }, err => {
        obs.error("Invalid authentication code");
      });
    });
  }

  public unregister(user: User): Observable<User> {
    return new Observable<User>((obs: Observer<User>) => {
      this.rest.unauthenticate(user.access_token).subscribe(async (done) => {
        if (done) {
          this.db.deleteRegistration();
          this.push.shutdown();
          this.pushSubs.forEach(sub => {
            sub.unsubscribe();
          });

          await this.appPreferences.clearAll();
          this.formsProvider.resetForms()
          this.util.rmDir("leadliaison", "");
          this.pushSubs = [];
          this.setup = false;
          obs.next(user);
          obs.complete();

        } else {
          obs.error("Could not unauthenticate");
        }
      }, err => {
        obs.error(err);
      });
    });
  }

  public getDeviceStatus(user: User) {
    return new Observable<StatusResponse<string>>((obs: Observer<StatusResponse<string>>) => {
      this.rest.validateAccessToken(user.access_token).subscribe((status) => {
        obs.next(status);
        obs.complete();
      })
    });
  }

  public getUpdates(): Observable<boolean> {
    return new Observable<boolean>((obs: Observer<boolean>) => {
      if (!this.isOnline()) {
        obs.error('No internet connection available');
        return;
      }
      this.db.getConfig("lastSyncDate").subscribe(time => {
        let d = new Date();
        if (time) {
          d.setTime(parseInt(time));
        }
        let newD = new Date();
        this.sync.download(time ? d : null).subscribe(
          (downloadData) => { },
          (err) => { obs.error(err); },
          () => {
            console.log('Finished downloading updates at : ' + newD.getTime() + "")
            this.db.saveConfig("lastSyncDate", newD.getTime() + "").subscribe(() => {
              this.db.saveConfig("getAllContacts", "true").subscribe(() => {
                obs.next(true);
                obs.complete();
              });
            })
          });
        this.doAutoSync()
      });
    });
  }

  public getForms(): Observable<Form[]> {
    return this.db.getForms();
  }

  public async getFormById(formId): Promise<Form> {
    let forms = await this.db.getFormsByIds([formId]).toPromise();
    return forms[0]
  }

  /*
    public getDispatches(): Observable<DispatchOrder[]> {
        return this.db.getDispatches();
    }
     */

  public getContacts(form: Form): Observable<DeviceFormMembership[]> {
    return this.db.getMemberships(form.form_id);
  }

  public getContact(form: Form, prospectId: number): Observable<DeviceFormMembership> {
    return this.db.getMembership(form.form_id, prospectId);
  }

  public getSubmissions(form: Form, isDispatch): Observable<FormSubmission[]> {
    return this.db.getSubmissions(form.form_id, isDispatch);
  }

  public saveSubmission(sub: FormSubmission, form: Form, syncData: boolean = true): Observable<boolean> {
    sub.updateFields(form);

    return new Observable<boolean>((obs: Observer<boolean>) => {
      this.db.saveSubmission(sub).subscribe((done) => {

        if (syncData) {
          this.doAutoSync();
        }

        obs.next(done);
        obs.complete();
      }, (err) => {
        obs.error(err);
      });
    });
  }

  public doSync(formId?: number): Observable<any> {
    return new Observable<any>((obs: Observer<any>) => {
      if (!this.isOnline()) {
        obs.error('No internet connection available');
        return;
      }

      this.db.getSubmissionsToSend().subscribe((submissions) => {

        // console.log("Submissions to submit - " + JSON.stringify(submissions));

        if (submissions.length == 0) {
          obs.complete();
          return;
        }
        let formIds = [];

        if (formId > 0) {
          formIds.push(formId);
          var tmp = [];
          submissions.forEach(sub => {
            if (sub.form_id + "" == formId + "") {
              tmp.push(sub);
            }
          });
          submissions = tmp;
        } else {
          submissions.forEach(sub => {
            if (formIds.indexOf(sub.form_id) == -1) {
              formIds.push(sub.form_id);
            }
          });
        }
        this.db.getFormsByIds(formIds).subscribe(forms => {

          //sync submissions with status "ToSubmit"
          //sync submissions with status "Submitting" in case the first attempt was 9 min ago
          let filteredSubmissions = submissions.filter((submission) => {
            return this.isSubmissionNeedToBeSubmitted(submission)
          });

          console.log("Submissions date - " + new Date().getTime());

          // console.log("Filtered submissions - " + JSON.stringify(filteredSubmissions));

          let dbUpdates = [];
          filteredSubmissions.forEach((sub) => {
            sub.status = SubmissionStatus.Submitting;
            this.submissionsProvider.updateSubmissionStatus(sub.id,sub.status)
            sub.last_sync_date = new Date().toISOString();
            let subUpdateObs = this.db.updateSubmissionStatus(sub);
            dbUpdates.push(subUpdateObs);
          });

          Observable.zip(...dbUpdates).subscribe(() => {
            this.submissionsProvider.sync(filteredSubmissions, forms).subscribe((submitted) => {
              console.log("Syncing submissions is completed");

              obs.next(true);
              this.localNotificationsService.cancelAll();
              obs.complete();
            }, (err) => {
              console.error(err);
              obs.error(err);
              this.errorSource.next(err);
            });
          });
        }, (err) => {
          obs.error(err);
          this.errorSource.next(err);
        });
      }, (error) => {
        obs.error(error);
        this.errorSource.next(error);
      });
    });
  }

  getToSubmitLeads() {
    return this.db.getSubmissionsToSend();
  }

  public isSubmissionNeedToBeSubmitted(submission: FormSubmission) {
    let submissionTime = new Date(submission.sub_date).getTime();
    if (submission.last_sync_date) {
      submissionTime = new Date(submission.last_sync_date).getTime();
    }

    let diff = Math.abs(new Date().getTime() - submissionTime) / 3600000;
    let isValidToBeSubmitted = (submission.status == SubmissionStatus.Submitting) && diff > 0.05;
    return (submission.status == SubmissionStatus.ToSubmit) || isValidToBeSubmitted;
  }

  public removeSubmission(submission) {
    return this.db.deleteSubmission(submission)
  }

  //MARK: Private

  private handlePush(note) {
    console.log('Push received - ' + JSON.stringify(note));

    if (note.action == 'sync') {
      this.getUpdates().subscribe();
    } else if (note.action == 'resync') {
      this.sync.download(null).subscribe(data => {
        //
      }, (err) => {
        //obs.error(err);
      }, () => {
        console.log("resync-ed");
        this.db.saveConfig("lastSyncDate", new Date().getTime() + "");
      });
    }
  }

  setAppCloseTime() {
    this.db.saveConfig('appCloseTime', Date.now() + "");
  }

  async getAppCloseTimeFrom() {
    let closeTime = await this.db.getConfig('appCloseTime').toPromise();
    return (Date.now() - parseInt(closeTime)) / 1000;
  }

}
