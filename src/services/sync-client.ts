import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs/Rx";
import { RESTClient, DBClient} from './';
import { SyncStatus } from "../model";

@Injectable()
export class SyncClient {

	private errorSource: BehaviorSubject<any>;
    /**
     * Error event
     */
	error: Observable<any>;

	private syncSource: BehaviorSubject<any>;
    /**
     * Sync update event
     */
	onSync: Observable<any>;

	private _isSyncing : boolean = false;

	private lastSyncStatus: SyncStatus[];

	constructor(private rest : RESTClient, private db: DBClient) {
		this.errorSource = new BehaviorSubject<any>(null);
		this.error = this.errorSource.asObservable();
		this.syncSource = new BehaviorSubject<any>(null);
		this.onSync = this.syncSource.asObservable();

		this.sync();
	}

	public isSyncing() : boolean{
		return this._isSyncing;
	}

	public getLastSync(): SyncStatus[]{
		return this.lastSyncStatus; 
	}

	public sync(){
		setTimeout(()=>{
			this.lastSyncStatus = [
				{
					loading: false,
					complete: true,
					formId: 7,
					formName: "Tradeshow#7"
				},
				{
					loading: true,
					formId: 8,
					formName: "Tradeshow#8"
				},
				{
					loading: false,
					formId: 4,
					formName: "Tradeshow#2"
				},
				{
					loading: false,
					formId: 6,
					formName: "Tradeshow#3"
				},
				{
					loading: false,
					formId:2,
					formName: "Tradeshow#4"
				},
				{
					loading: false,
					formId: 9,
					formName: "Tradeshow#5"
				},
				{
					loading: false,
					formId: 10,
					formName: "Tradeshow#6"
				}
			];
			this.syncSource.next(this.lastSyncStatus);
		}, 15000);
	}
}