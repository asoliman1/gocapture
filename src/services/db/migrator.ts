import { SQLiteObject } from '@ionic-native/sqlite';
import { Observable, Observer } from "rxjs/Rx";
import { Utils } from "./utils";

export class Migrator{

	private migrations;

	public setMigrations(migrations){
		this.migrations = migrations;
	}

	public runMigrations(db: SQLiteObject, type: string): Observable<any>{
		return new Observable<any>((responseObserver: Observer<any>) => {
			this.migrateForType(db, type).subscribe(() => {
				responseObserver.next({});
				responseObserver.complete();
			}, (err) => {
				responseObserver.error(err);
			});
		});
	}

	private migrateForType(db: SQLiteObject, type: string): Observable<any>{
		return new Observable<any>((responseObserver: Observer<any>) => {
			this.getDbMigrationVersion(db, type).subscribe((version) => {
				let promise: Promise<any> = Promise.resolve();
				let hasMigrations = false;
				Object.keys(this.migrations[type]).forEach((key) => {
					let k = parseInt(key);
					if(k > version){
						promise = promise.then(() => this.executeMigration(db, type, this.migrations[type][key]));
						hasMigrations = true;
					}
				});
				/*if(!hasMigrations){
					responseObserver.next({});
					responseObserver.complete();
					return;
				}*/
				promise.then(() => {
					responseObserver.next({});
					responseObserver.complete();
				});
			})
		});
	}

	private executeMigration(db: SQLiteObject, type, migration) : Promise<any>{
		return new Promise<any>((resolve, reject) => {
			var toExecute = [];
			migration.tables && migration.tables.forEach(table => {
				toExecute.push(Utils.makeCreateTableQuery(table));
			});
			toExecute = toExecute.concat(migration.queries);
			if(toExecute.length == 0){
				resolve({});
				return;
			}
			var index = 0;
			var handler = () => {
				console.log("Exec " + toExecute[index]);
				db.executeSql(toExecute[index], {}).then(result => {
					index++;
					if(index < toExecute.length){
						handler();
					}else{
						console.log("Done");
						resolve({});
					}
				});
			};
			handler();
		});
	}

	private getDbMigrationVersion(db: SQLiteObject, type: string): Observable<number>{
		return new Observable<number>((responseObserver: Observer<number>) => {
			db.executeSql(this.migrations.queries.getVersion, {})
			.then((data) => {
				var entry = data.rows.item(0);
				var v = entry.version;
				responseObserver.next(v);
				responseObserver.complete();
			}).catch((err) => {
				responseObserver.next(-1);
				responseObserver.complete();
			});
		});
	}
}