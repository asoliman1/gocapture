import { Injectable } from "@angular/core";
import { Observable, Observer, BehaviorSubject } from "rxjs/Rx";
import { AuthenticationRequest } from "../model/protocol";
import { User } from "../model";
import { DBClient, RESTClient } from "./";
import { Transfer, File } from 'ionic-native';
declare var cordova: any;

@Injectable()
export class BussinessClient {

	constructor(private db: DBClient, private rest: RESTClient) {

	}

	public getRegistration(): Observable<User> {
		return new Observable<User>((obs: Observer<User>) => {
			this.db.getRegistration()
				.subscribe((user) => {
					if (user) {
						this.db.setupWorkDb(user.db);
					}
					obs.next(user);
					obs.complete();
				})
		});
	}

	public authenticate(authCode): Observable<User> {
		return new Observable<User>((obs: Observer<User>) => {
			let req = new AuthenticationRequest();
			req.invitation_code = authCode;
			req.device_name = authCode;
			this.rest.authenticate(req).subscribe(reply => {
				let fileTransfer = new Transfer();
				let ext = reply.user_profile_picture.split('.').pop();
				let target = cordova.file.dataDirectory + 'leadliaison/profile/current.' + ext;
				fileTransfer.download(reply.user_profile_picture, target, true, {})
					.then((result) => {
						reply.user_profile_picture = result.nativeURL;
						ext = reply.customer_logo.split('.').pop();
						target = cordova.file.dataDirectory + 'leadliaison/profile/logo.' + ext;
						fileTransfer.download(reply.user_profile_picture, target, true, {})
							.then((result) => {
								reply.customer_logo = result.nativeURL;
								this.db.saveRegistration(reply).subscribe((done) => {
									this.db.setupWorkDb(reply.db);
									obs.next(reply);
									obs.complete();
								});
							})
							.catch((err) => {
								obs.error("There was an error retrieving the profile picture");
							})
							.catch((err) => {
								obs.error("There was an error retrieving the logo picture")
							});
					});
			});
		});
	}
}