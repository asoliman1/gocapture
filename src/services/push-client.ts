import { Push } from 'ionic-native';
import { Injectable } from "@angular/core";
import { Config } from "../config";
import { PushResponse } from "../model/protocol";
import { Util } from "../util/util";

@Injectable()
export class PushClient {
	private push: {
		on: (event: "registration" | "notification" | "error", callback: (data: PushResponse) => void) => void,
		off: (event: "registration" | "notification" | "error", callback: (err: any) => void) => void,
		unregister: (successHandler: () => void, errorHandler: () => void, topics: any[]) => void,
		clearAllNotifications: (successHandler: () => void, errorHandler: () => void) => void
	};

	private refs: any = {};

	constructor() {
		this.push = <any>Push.init({
			android: {
				senderID: Config.androidGcmId
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

	}

	private onNotification(data : PushResponse){
		
	}

	private onError(err){
		
	}
}
