import { Push, PushNotification, NotificationEventResponse } from 'ionic-native';
import { Observable, BehaviorSubject, Observer } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import { Config } from "../config";
import { PushResponse } from "../model/protocol";
import { Util } from "../util/util";

@Injectable()
export class PushClient {
	
	private errorSource: BehaviorSubject<any>;
    /**
     * Error event
     */
	error: Observable<any>;

	private notificationSource: BehaviorSubject<{id: number, action: number}>;
    /**
     * Error event
     */
	notification: Observable<{id: number, action: number}>;

	private registrationSource: BehaviorSubject<string>;
    /**
     * Error event
     */
	registration: Observable<string>;

	private push: PushNotification;
	/**{
		on: (event: "registration" | "notification" | "error", callback: (data: PushResponse) => void) => void,
		off: (event: "registration" | "notification" | "error", callback: (err: any) => void) => void,
		unregister: (successHandler: () => void, errorHandler: () => void, topics: any[]) => void,
		clearAllNotifications: (successHandler: () => void, errorHandler: () => void) => void
	};*/

	private refs: any = {};

	constructor() {		
		this.errorSource = new BehaviorSubject<any>(null);
		this.error = this.errorSource.asObservable();
		
		this.registrationSource = new BehaviorSubject<string>(null);
		this.registration = this.registrationSource.asObservable();
		
		this.notificationSource = new BehaviorSubject<{id: number, action: number}>(null);
		this.notification = this.notificationSource.asObservable();
	}

	initialize(){
		this.push = <any>Push.init({
			android: {
				senderID: Config.androidGcmId,
				icon: "icon_notif",
				iconColor: "orange"
			},
			ios: {
				alert: 'true',
				badge: true,
				sound: 'false'
			},
			windows: {}
		});
		this.startup();
	}

	startup(){
		if(Util.isEmptyObject(this.refs)){
			this.on("registration", Util.proxy(this.onRegistration, this));
			this.on("notification", Util.proxy(this.onNotification, this));
			this.on("error", Util.proxy(this.onError, this));
		}
	}

	shutdown(){
		for(let event in this.refs){
			this.push.off(<any>event, this.refs[event])
		}
	}

	private on(event: "registration" | "notification" | "error", cb: Function){
		let func = Util.proxy(cb, this);
		this.refs[event] = func;
		this.push.on(event, func);
	}

	private onRegistration(data : PushResponse){
		console.log("registration", data);
		this.registrationSource.next(data.registrationId);
	}

	private onNotification(data : NotificationEventResponse){
		let action = data.additionalData["action"];
		let id = data.additionalData["id"];
		this.notificationSource.next({id: id, action: action});
	}

	private onError(err){
		this.errorSource.next(err);
	}
}
