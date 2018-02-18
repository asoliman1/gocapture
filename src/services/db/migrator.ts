import { SQLiteObject } from '@ionic-native/sqlite';
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
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
						promise = promise.then(() => this.executeMigration(db, type, this.migrations[type][key], k));
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

	private executeMigration(db: SQLiteObject, type: string, migration, migrationNo: number) : Promise<any>{
		return new Promise<any>((resolve, reject) => {
			var toExecute = [];
			migration.tables && migration.tables.forEach(table => {
				toExecute.push(Utils.makeCreateTableQuery(table));
			});
			toExecute = toExecute.concat(migration.queries);
			if(toExecute.length == 0){
				this.finishMigration(migration, migrationNo, db, resolve);
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
						this.finishMigration(migration, migrationNo, db, resolve);
					}
				});
			};
			handler();
		});
	}

	private finishMigration(migration, index, db, resolve){
		let statement = "INSERT INTO versions(version, updated_at) values (" + index + ", strftime('%Y-%m-%d %H:%M:%S', 'now'))"
		if(migration.custom){
			migration.custom(db, ()=>{
				console.log("Done 1");
				db.executeSql(statement, {}).then(result => {
					console.log("Done");
					resolve({});
				});
			})
		}else{
			db.executeSql(statement, {}).then(result => {
				console.log("Done");
				resolve({});
			});
		}
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