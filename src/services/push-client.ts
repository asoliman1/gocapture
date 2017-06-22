import { Push, PushObject, NotificationEventResponse } from '@ionic-native/push';
import { Observable, BehaviorSubject } from "rxjs/Rx";
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

	private pushObj: PushObject;
	
	/**{
		on: (event: "registration" | "notification" | "error", callback: (data: PushResponse) => void) => void,
		off: (event: "registration" | "notification" | "error", callback: (err: any) => void) => void,
		unregister: (successHandler: () => void, errorHandler: () => void, topics: any[]) => void,
		clearAllNotifications: (successHandler: () => void, errorHandler: () => void) => void
	};*/

	private refs: any = {};

	constructor(private push: Push) {		
		this.errorSource = new BehaviorSubject<any>(null);
		this.error = this.errorSource.asObservable();
		
		this.registrationSource = new BehaviorSubject<string>(null);
		this.registration = this.registrationSource.asObservable();
		
		this.notificationSource = new BehaviorSubject<{id: number, action: number}>(null);
		this.notification = this.notificationSource.asObservable();
	}

	initialize(){
		this.pushObj = this.push.init({
			android: {
				senderID: Config.androidGcmId,
				icon: "icon_notif",
				iconColor: "orange",
				sound: true
			},
			ios: {
				alert: true,
				badge: true,
				sound: true
			},
			windows: {}
		});
		if(this.pushObj && this.pushObj['error']){
			this.pushObj = null;
		}
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
		this.pushObj.unregister();
	}

	private on(event: "registration" | "notification" | "error", cb: Function){
		let func = Util.proxy(cb, this);
		this.refs[event] = func;
		this.pushObj && this.pushObj.on(event).subscribe((d) => {
			func(d);
		});
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
