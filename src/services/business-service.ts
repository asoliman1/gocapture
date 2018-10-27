import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from "rxjs/Subscription";
import { Config } from '../config';
import { DeviceFormMembership, DispatchOrder, Form, FormSubmission, User } from '../model';
import { AuthenticationRequest } from '../model/protocol';
import { DBClient } from './db-client';
import { RESTClient } from './rest-client';
import { SyncClient } from './sync-client';
import { PushClient } from "./push-client";
import { Transfer } from '@ionic-native/transfer';
import { Network } from '@ionic-native/network';
import { StatusResponse } from "../model/protocol/status-response";
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

	constructor(private db: DBClient,
		private rest: RESTClient,
		private sync: SyncClient,
		private push: PushClient,
		private net: Network,
		private fileTransfer: Transfer) {

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
		console.log('doAutoSync');
		if (this.isOnline()) {
			this.db.isWorkDbInited() && this.db.getConfig("autoUpload").subscribe((val) => {
				if (val + "" == "true") {
					this.doSync().subscribe(() => {
						console.log("Sync up done");
					});
				}
			}, err => {

			});
		}
	}

	public setupNotifications() {
		if (!this.setup) {
			this.setup = true;
			this.pushSubs.push(this.push.error.subscribe((err) => {
				console.error("notification", err);
				console.error(JSON.stringify(err));
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
				let ext = reply.user_profile_picture.split('.').pop();
				let target = cordova.file.dataDirectory + 'leadliaison/profile/current.' + ext;


				this.registration = reply;
				reply.pushRegistered = 1;
				reply.is_production = Config.isProd ? 1 : 0;
				this.db.makeAllAccountsInactive().subscribe((done) => {
					this.db.saveRegistration(reply).subscribe((done) => {
						this.db.setupWorkDb(reply.db);
						obs.next({ user: reply, message: "Done" });
						obs.complete();
						let d = new Date();
						this.sync.download(null).subscribe(downloadData => {
						},
							(err) => {
								obs.error(err);
							},
							() => {
								this.db.saveConfig("lastSyncDate", d.getTime() + "").subscribe(() => {
									obs.next({ user: reply, message: "Done" });
								})
							});
					});
				});



				// this.fileTransfer.create().download(reply.user_profile_picture, target, true, {})
				// 	.then((result) => {
				// 		reply.user_profile_picture = result.nativeURL;
				// 		ext = reply.customer_logo.split('.').pop();
				// 		target = cordova.file.dataDirectory + 'leadliaison/profile/logo.' + ext;
				// 		this.fileTransfer.create().download(reply.user_profile_picture, target, true, {})
				// 			.then((result) => {
				// 				reply.customer_logo = result.nativeURL;
				//
				// 			})
				// 			.catch((err) => {
				// 				obs.error("There was an error retrieving the profile picture");
				// 			})
				// 			.catch((err) => {
				// 				obs.error("There was an error retrieving the logo picture")
				// 			});
				// 	});
			}, err => {
				obs.error("Invalid authentication code");
			});
		});
	}

	public unregister(user: User): Observable<User> {
		return new Observable<User>((obs: Observer<User>) => {
			this.rest.unauthenticate(user.access_token).subscribe((done) => {
				if (done) {
					this.db.deleteRegistration(user.id + "").subscribe(() => {
						this.push.shutdown();
						this.pushSubs.forEach(sub => {
							sub.unsubscribe();
						});
						this.pushSubs = [];
						this.setup = false;
						obs.next(user);
						obs.complete();
					}, err => {
						obs.error(err);
					});
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
			this.db.getConfig("lastSyncDate").subscribe(time => {
				this.db.getConfig("getAllContacts").subscribe(getAllContacts => {
					let d = new Date();
					if (time) {
						d.setTime(parseInt(time));
					}
					let newD = new Date();
					this.sync.download(time ? d : null, getAllContacts != "true").subscribe(downloadData => {
						//console.log(downloadData);
					},
						(err) => {
							obs.error(err);
						},
						() => {
							this.db.saveConfig("lastSyncDate", newD.getTime() + "").subscribe(() => {
								this.db.saveConfig("getAllContacts", "true").subscribe(() => {
									obs.next(true);
									obs.complete();
								});
							})
						});
				});
			});
		});
	}

	public getForms(): Observable<Form[]> {
		return this.db.getForms();
	}

	public getDispatches(): Observable<DispatchOrder[]> {
		return this.db.getDispatches();
	}

	public getContacts(form: Form): Observable<DeviceFormMembership[]> {
		return this.db.getMemberships(form.form_id);
	}

	public getContact(form: Form, prospectId: number): Observable<DeviceFormMembership> {
		return this.db.getMembership(form.form_id, prospectId);
	}

	public getSubmissions(form: Form, isDispatch): Observable<FormSubmission[]> {
		return this.db.getSubmissions(form.form_id, isDispatch);
	}

	public saveSubmission(sub: FormSubmission, form: Form): Observable<boolean> {
		sub.updateFields(form);
		return new Observable<boolean>((obs: Observer<boolean>) => {
			this.db.saveSubmission(sub).subscribe((done) => {
				this.doAutoSync();
				obs.next(done);
				obs.complete();
			}, (err) => {
				obs.error(err);
			});
		});
	}

	public doSync(formId?: number): Observable<any> {
		return new Observable<any>((obs: Observer<any>) => {
			if (!this.online) {
				obs.complete();
				return;
			}
			this.db.getSubmissionsToSend().subscribe((submissions) => {
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
					this.sync.sync(submissions, forms).subscribe(submitted => {
						obs.next(true);
						obs.complete();
					}, (err) => {
						console.error(err);
						obs.error(err);
						this.errorSource.next(err);
					});
				}, (err) => {
					obs.error(err);
					this.errorSource.next(err);
				});
			});
		});
	}

	//MARK: Private

	private handlePush(note) {
		console.log('Push received - ' + JSON.stringify(note));

		if (note.action == 'sync') {
			this.db.getConfig("lastSyncDate").subscribe(time => {
				let d = new Date();
				if (time) {
					d.setTime(parseInt(time));
				}
				this.sync.download(time ? d : null).subscribe(data => {
					//
				}, (err) => {
					//obs.error(err);
				}, () => {
					console.log("sync-ed");
					this.db.saveConfig("lastSyncDate", d.getTime() + "").subscribe(() => {
						//
					});
				});
			});
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
}
