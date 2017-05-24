import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import { Observable, Observer } from "rxjs/Rx";
import { Utils } from "./utils";
import { Migrator } from "./migrator";
import { Table } from "./metadata";

export class Manager{
	private map: {[key:string]: {obs: Observable<SQLiteObject>, db: SQLiteObject, dbName: string, master: boolean}} = {};

	constructor(private platform: Platform, private migrator: Migrator, private tables: Table[]){

	}

	public registerDb(name: string, type: string, master: boolean){
		if(!this.map[type]){
			this.map[type] = {
				obs: null,
				db: null,
				dbName: name,
				master: master
			};
		}else if(!this.map[type].dbName){
			this.map[type].dbName = name;
		}
	}

	public db(type: string): Observable<SQLiteObject> {
		return new Observable<SQLiteObject>((obs: Observer<SQLiteObject>) => {
			if (this.map[type] && this.map[type].db) {
				setTimeout(() => {
					obs.next(this.map[type].db);
					obs.complete();
				})
				return;
			} 			
			if(this.map[type] && this.map[type].obs){
				this.doSubscribe(type, this.map[type].obs, obs);
			}else if(this.map[type]){
				this.map[type].obs = this.initializeDb(this.platform, type).share();
				this.doSubscribe(type, this.map[type].obs, obs);
			}else{
				obs.error("Unregistered Db: " + type);
			}
		});
	}

	private doSubscribe(type: string, o: Observable<SQLiteObject>, obs: Observer<SQLiteObject>){
		o.subscribe((db) => {
			if(!obs.closed){
				this.map[type].db = db;
				obs.next(this.map[type].db);
				obs.complete();
				obs.closed = true;
			}else{
				obs.next(this.map[type].db);
			}
		});
	}

	public isDbInited(type: string): boolean {
		return this.map[type] && this.map[type].obs != null;
	}

	private initializeDb(platform: Platform, type: string): Observable<SQLiteObject> {
		console.log("Initialize " + type);
		return new Observable<SQLiteObject>((obs: Observer<SQLiteObject>) => {
			let db: SQLite = null;
			if (platform.is("cordova")) {
				db = new SQLite();
			} else {
				db = new LocalSql();
			}
			console.log("OPen db " + this.map[type].dbName);
			let settings = {
				name: this.map[type].dbName,
				location: 'default', // the location field is required
			};
			settings["version"] = this.map[type].master ? '1.0' : '';
			db.create(settings).then((theDb: SQLiteObject) => {
				this.setup(theDb, type).subscribe(()=>{
					setTimeout(() => {
						obs.next(theDb);
						obs.complete();
					}, 50);
				}, (err) =>{
					console.error('Unable to setup: ', err);
					obs.error(err);
				});
			}, (err) => {
				console.error('Unable to open database: ', err);
				obs.error(err);
			});
		});
	}

	private setup(db: SQLiteObject, type: string) : Observable<any> {
		return new Observable<any>((obs: Observer<any>) => {
			let index = 0;
			let handler = (data) => {
				if (index >= this.tables.length) {
					this.migrator.runMigrations(db, type).subscribe(() => {
						obs.next({});
						obs.complete();
					}, (err) => {
						obs.error(err);
					});
					return;
				}
				while (this.tables[index].master != this.map[type].master) {
					index++;
					if (index >= this.tables.length) {
						this.migrator.runMigrations(db, type).subscribe(() => {
							obs.next({});
							obs.complete();
						}, (err) => {
							obs.error(err);
						});
						return;
					}
				}
				let query = Utils.makeCreateTableQuery(this.tables[index]);
				index++;
				db.executeSql(query, {}).then(handler, (err) => {
					if (err.hasOwnProperty("rows")) {
						handler(err);
						return;
					}
					console.error('Unable to execute sql: ', err);
					obs.error(err);
				});
			};

			handler({});
		});
	}
}

class LocalSql {
	private db: any;

	echoTest(): Promise<any>{
		return null;
	}

    deleteDatabase(config): Promise<any>{
		return null;
	}

	create(opts: { name: string, location: string, version: string }): Promise<any> {
		let name = opts.name;
		let description = opts.name;
		let size = 2 * 1024 * 1024;
		let version = opts.version;
		return new Promise<any>((resolve, reject) => {
			try{
				this.db = window["openDatabase"](name, version, description, size, (db) => {
					resolve(this);
				});
			}catch(e){
				console.log(e);
			}
			setTimeout(() => {
				resolve(this);
			}, 1);
		});
	}

	executeSql(query, args): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db.transaction(function (t) {
				let params = args || {};
				if (Object.keys(params).length == 0) {
					params = [];
				}
				t.executeSql(query, params,
					(t, r) => {
						resolve(r);
					},
					(tx, err) => {
						console.log(err);
						reject(err);
					});
			});
		});
	};
}