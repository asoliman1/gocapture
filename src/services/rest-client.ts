import { Injectable} from "@angular/core";
import { Config } from "../config";
import { Observable, Observer} from "rxjs";
import { User, Form, Dispatch, DeviceFormMembership, FormSubmission} from "../model";

@Injectable()
export class RESTClient{
	constructor(){
		
	}
	
	/**
	 * 
	 * @returns Observable
	 */
	public authenticate() : Observable<User>{
		return new Observable<User>((obs:Observer<User>) => {
			
		});
	}
	/**
	 * 
	 * @returns Observable
	 */
	public getForms() : Observable<Form>{
		return new Observable<Form>((obs:Observer<Form>) => {
			
		});
	}
	/**
	 * 
	 * @returns Observable
	 */
	public getDispatches() : Observable<Dispatch>{
		return new Observable<Dispatch>((obs:Observer<Dispatch>) => {
			
		});
	}
	/**
	 * 
	 * @returns Observable
	 */
	public registerDeviceToPush() : Observable<boolean>{
		return new Observable<boolean>((obs:Observer<boolean>) => {
			
		});
	}
	/**
	 * 
	 * @returns Observable
	 */
	public getDeviceFormMemberships() : Observable<DeviceFormMembership[]>{
		return new Observable<DeviceFormMembership[]>((obs:Observer<DeviceFormMembership[]>) => {
			
		});
	}
	/**
	 * 
	 * @returns Observable
	 */
	public submitForm(data: FormSubmission) : Observable<boolean>{
		return new Observable<boolean]>((obs:Observer<boolean>) => {
			
		});
	}
}