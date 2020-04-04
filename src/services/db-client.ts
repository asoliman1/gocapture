import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';
import { Observer } from "rxjs/Observer";
import {
	DeviceFormMembership,
} from "../model";
import { Migrator, Manager, Table } from "./db";
import { SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from "ionic-angular/platform/platform";
import { TABLES } from "./db/tables";
import { VERSIONS } from "./db/versions";

let MASTER = "master";
let WORK = "work";

@Injectable()
export class DBClient {

	private migrator: Migrator;
	private manager: Manager;
	private saveAllEnabled = false;
	private saveAllPageSize = 500;
	private saveAllData: { query: string, type: string, parameters: any[] }[] = [];
	private tables: Table[] = TABLES;
	private versions = VERSIONS;

	constructor(private platform: Platform) {
		this.migrator = new Migrator();
		this.migrator.setMigrations(this.versions);
		this.manager = new Manager(this.platform, this.migrator, this.tables);
		this.manager.registerDb("tradeshow.db", MASTER, true);
	}
	/**
	 *
	 */
	public setupWorkDb(dbName) {
		this.manager.registerDb(dbName + ".db", WORK, false);
	}
	/**
	 *
	 */
	public isWorkDbInited(): boolean {
		return this.manager.isDbInited(WORK);
	}
	/**
	 *
	 */
	public getConfig(key: string): Observable<string> {
		return this.getSingle<any>(WORK, "configuration", [key])
			.map((entry) => {
				return entry ? entry.value : "";
			});
	}
	/**
	 *
	 */
	public getAllConfig(): Observable<Object> {
		return this.getAll<any[]>(WORK, "configuration", [])
			.map((data) => {
				let resp = {};
				data.forEach((entry: any) => {
					resp[entry.key] = entry ? entry.value : "";
				});
				return resp;
			});
	}
	/**
	 *
	 */
	public saveConfig(key: string, value: string): Observable<boolean> {
		return this.save(WORK, "configuration", [key, value]);
	}
	/**
	 *
	 */
	public deleteConfig(key: string): Observable<boolean> {
		return this.remove(WORK, "configuration", [key]);
	}
	/**
	 *
	 */
	public updateRegistration(registrationid: string): Observable<boolean> {
		return this.doUpdate(MASTER, "updateRegistration", 'org_master', [registrationid]);
	}
	/**
	 *
	 */
	public getMemberships(form_id: number): Observable<DeviceFormMembership[]> {
		return this.getAll<any[]>(WORK, "contacts", [form_id])
			.map((data) => {
				let forms = [];
				data.forEach((dbForm: any) => {
					let form = new DeviceFormMembership();
					form.form_id = dbForm.formId;
					form.id = dbForm.id;
					form.added_date = dbForm.added;
					form.membership_id = dbForm.membershipId;
					form.prospect_id = dbForm.prospectId;
					form.fields = JSON.parse(dbForm.data);
					form["search"] = form.fields["Email"] + " " + form.fields["FirstName"] + " " + form.fields["LastName"];
					forms.push(form);
				});
				return forms;
			});
	}
	/**
	 *
	 */
	public saveMemberships(forms: DeviceFormMembership[]): Observable<boolean> {
		return new Observable<boolean>(obs => {
			this.saveAll<DeviceFormMembership>(forms, "Membership").subscribe(d => {
				this.manager.db(WORK).subscribe((db) => {
					let data = [];
					forms.forEach(form => {
						data.push({ id: form.membership_id, formId: form.form_id });
					});
					this.saveAll<any>(data, "FormContact").subscribe(() => {
						db.executeSql("update contacts set formId=NULL", []).then(() => {
							obs.next(true);
							obs.complete();
						}).catch(err => {
							obs.error(err);
						});
					}, err => {
						obs.error(err);
					});
				});
			}, err => {
				obs.error(err);
			})
		});
	}
	/**
	 *
	 */
	private remove(type: string, table: string, parameters: any[], key = "delete"): Observable<boolean> {
		return this.doUpdate(type, key, table, parameters);
	}
	/**
	 *
	 */
	private removeAll(type: string, table: string): Observable<boolean> {
		return this.doUpdate(type, "deleteAll", table);
	}
	/**
	 *
	 */
	private saveAll<T>(items: T[], type: string, pageSize?: number): Observable<boolean> {
		return new Observable<boolean>((obs: Observer<boolean>) => {
			if (!items || items.length == 0) {
				setTimeout(() => {
					obs.next(true);
					obs.complete();
				});
				return;
			}
			this.manager.db(WORK).subscribe((db) => {
				this.internalSaveAll(db, items, type, pageSize).subscribe(d => {
					obs.next(true);
					obs.complete();
				}, err => {
					this.saveAllEnabled = false;
					this.saveAllData = [];
					obs.error(err);
				});
			}, (err) => {
				this.saveAllEnabled = false;
				this.saveAllData = [];
				obs.error(err);
			});
		});
	}
	/**
	 *
	 */
	private internalSaveAll<T>(db: SQLiteObject, items: T[], type: string, pageSize: number): Observable<boolean> {
		return new Observable<boolean>((obs: Observer<boolean>) => {
			if (!items || items.length == 0) {
				obs.next(true);
				obs.complete();
				return;
			}
			this.saveAllEnabled = true;
			let index = 0;
			let name = "save" + type;

			let exec = (done: boolean) => {
				// console.log('Save all data: ' + this.saveAllData.length);
				if (this.saveAllData.length == 0) {
					this.saveAllEnabled = false;
					obs.next(true);
					obs.complete();
					return;
				}
				let isDone = done;
				db.transaction((tx: any) => {
					for (let i = 0; i < this.saveAllData.length; i++) {
						let query = this.saveAllData[i].query;
						let params = this.saveAllData[i].parameters;
						tx.executeSql(query, params, function (success) {
						}, function (error) {
							console.log(error);
							tx.abort(error);
						});
					}
				}).then(result => {
					this.saveAllData = [];
					if (isDone) {
						this.saveAllEnabled = false;
						obs.next(true);
						obs.complete();
					} else {
						handler(true);
					}
				}, (error) => {
					this.saveAllEnabled = false;
					this.saveAllData = [];
					obs.error(error);
					console.log(error)
				})
			};
			let page = pageSize > 0 ? pageSize : this.saveAllPageSize;
			let handler = (resp: boolean, stopExec?: boolean) => {
				index++;
				if (index + 1 % page == 0) {  
					exec(index == items.length);
					if (index == items.length) {
						return;
					}
				} else if (index == items.length) {
					this.saveAllEnabled = false;
					exec(true);
					return;
				} else if (index < items.length) {
					this[name](items[index]).subscribe(handler);
				}
			};
			this[name](items[0]).subscribe(handler);
		});
	}
	/**
	 *
	 */
	private save(type: string, table: string, parameters: any[]): Observable<boolean> {
		return new Observable<boolean>((responseObserver: Observer<boolean>) => {
			if (this.saveAllEnabled) {
				this.saveAllData.push({ query: this.getQuery(table, "update"), type: type, parameters: parameters });
					responseObserver.next(true);
					responseObserver.complete();
				    return;
			}
			this.doUpdate(type, "update", table, parameters).subscribe((value) => {
				responseObserver.next(value);
				responseObserver.complete();
			}, err => {
				responseObserver.error(err);
			});
		});
	}
	/**
	 *
	 */
	private getSingle<T>(type: string, table: string, parameters: any[]): Observable<T> {
		return new Observable<T>((responseObserver: Observer<T>) => {
			this.manager.db(type).subscribe((db) => {
				db.executeSql(this.getQuery(table, "select"), parameters)
					.then((data) => {
						if (data.rows.length == 1) {
							responseObserver.next(data.rows.item(0));
							responseObserver.complete();
						} else if (data.rows.length == 0) {
							responseObserver.next(null);
							responseObserver.complete();
						} else {
							responseObserver.error("More than one entry found");
						}
					}, (err) => {
						responseObserver.error("An error occured: " + JSON.stringify(err));
					});
			});
		});
	}
	/**
	 *
	 */
	private getAll<T>(type: string, table: string, params?: any[]): Observable<T[]> {
		return this.doGet<T>(type, "selectAll", table, params);
	}
	/**
	 *
	 */
	private doGet<T>(type: string, queryId: string, table: string, params?: any[]): Observable<T[]> {
		return new Observable<T[]>((responseObserver: Observer<T[]>) => {
			this.manager.db(type).subscribe((db) => {
				db.executeSql(this.getQuery(table, queryId), params)
					.then((data) => {
						var resp = [];
						for (let i = 0; i < data.rows.length; i++) {
							resp.push(data.rows.item(i));
						}
						responseObserver.next(resp);
						responseObserver.complete();
					}, (err) => {
						responseObserver.error("An error occured: " + JSON.stringify(err));
					});
			});
		});
	}
	/**
	 *
	 */
	private doUpdate(type: string, queryId: string, table: string, params?: any[]): Observable<boolean> {
		return new Observable<boolean>((responseObserver: Observer<boolean>) => {
			this.manager.db(type).subscribe((db) => {
				db.executeSql(this.getQuery(table, queryId), params)
					.then((data) => {
						if (data.rowsAffected > 1) {
							responseObserver.error("Wrong number of affected rows: " + data.rowsAffected);
						} else {
							responseObserver.next(true);
							responseObserver.complete();
						}
					}, (err) => {
						console.log(err);
						responseObserver.error("An error occurred: " + JSON.stringify(err));
					});
			}, (error) => {
				console.error(error);
			});
		});
	}
	/**
	 *
	 */
	private getQuery(table: string, type: string): string {
		for (let i = 0; i < this.tables.length; i++) {
			if (this.tables[i].name == table) {
				let query = this.tables[i].queries[type];
				return query;
			}
		}
		return "";
	}

}
