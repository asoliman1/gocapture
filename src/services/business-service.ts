import { Injectable } from "@angular/core";
import { Observable, Observer, BehaviorSubject, Subscription } from "rxjs/Rx";
import { AuthenticationRequest } from "../model/protocol";
import { User, Form, DispatchOrder } from "../model";
import { DBClient, RESTClient, SyncClient } from "./";
import { Transfer, File, Network } from 'ionic-native';
declare var cordova: any;

@Injectable()
export class BussinessClient {

	protected networkSource: BehaviorSubject<"ON"|"OFF">;
    /**
     * Error event
     */
	network: Observable<"ON"|"OFF">;

	private networkOn : Subscription;
	private networkOff : Subscription;

	private online: boolean = true;

	constructor(private db: DBClient, private rest: RESTClient, private sync: SyncClient) {
		
		this.networkSource = new BehaviorSubject<"ON"|"OFF">(null);
		this.network = this.networkSource.asObservable();

		this.networkOff = Network.onDisconnect().subscribe(() => {
			console.log("network was disconnected :-(");
			this.setOnline(false);
		});

		this.networkOn = Network.onConnect().subscribe(() => {
			console.log("network was connected");
			this.setOnline(true);
		});
	}

	private setOnline(val: boolean){
		this.online = val;
		this.networkSource.next(val ? "ON" : "OFF");
		this.rest.setOnline(val);
	}

	public getRegistration(): Observable<User> {
		return new Observable<User>((obs: Observer<User>) => {
			this.db.getRegistration()
				.subscribe((user) => {
					if (user) {
						this.db.setupWorkDb(user.db);
						this.rest.token = user.access_token;
					}
					obs.next(user);
					obs.complete();
				})
		});
	}

	public authenticate(authCode): Observable<{user:User, message:string}> {
		return new Observable<{user:User, message:string}>((obs: Observer<{user:User, message:string}>) => {
			let req = new AuthenticationRequest();
			req.invitation_code = authCode;
			req.device_name = authCode;
			this.rest.authenticate(req).subscribe(reply => {
				obs.next({user:reply, message: "Authenticated. Setting things up..."});
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
									obs.next({user:reply, message: "Syncing..."});
									this.sync.download(null).subscribe(downloadData => {
										this.db.saveConfig("lastSyncDate", new Date().getTime() + "").subscribe(()=>{
											obs.next({user:reply, message: "Done"});
											obs.complete();
										})
									});
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

	public getForms() : Observable<Form[]>{
		return this.db.getForms();
	}

	public getDispatches() : Observable<DispatchOrder[]>{
		return this.db.getDispatches();
	}
}