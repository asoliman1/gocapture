import { Injectable } from "@angular/core";
import { SQLite } from 'ionic-native';

@Injectable()
export class DBClient {

	private db;

	private tables = [
		{
			name: 'forms',
			columns: [
				{ name: 'id', type: 'integer primary key'},
				{ name: 'name', type: 'text' },
				{ name: 'title', type: 'text' },
				{ name: 'description', type: 'text' },
				{ name: 'success_message', type: 'text' },
				{ name: 'submit_error_message', type: 'text' },
				{ name: 'submit_button_text', type: 'text' },
				{ name: 'created_at', type: 'text' },
				{ name: 'updated_at', type: 'text' },
				{ name: 'elements', type: 'text' },
				{ name: 'isDispatch', type: 'integer' },
				{ name: 'dispatchData', type: 'text' },
				{ name: 'prospectData', type: 'text' },
				{ name: 'summary', type: 'text' }
			],
			queries: {
				"create": "",
				"update": "",
				"delete": ""
			}
		},
		{
			name: 'submissions',
			columns: [
				{ name: 'id', type: 'integer primary key' },
				{ name: 'title', type: 'text' },
				{ name: 'sub_date', type: 'text' },
				{ name: 'formId', type: 'integer' },
				{ name: 'data', type: 'text' },
				{ name: 'status', type: 'integer' },
				{ name: 'dispatchId', type: 'integer' },
				{ name: 'isDispatch', type: 'integer' }
			],
			queries: {
				"create": "",
				"update": "",
				"delete": ""
			}
		},
		{
			name: 'notifications',
			columns: [
				{ name: 'id', type: 'integer primary key' },
				{ name: 'data', type: 'text' },
				{ name: 'processed', type: 'text' }
			],
			queries: {
				"create": "",
				"update": "",
				"delete": ""
			}
		},
		{
			name: 'contacts',
			columns: [
				{ name: 'id', type: 'integer primary key' },
				{ name: 'data', type: 'text' },
				{ name: 'formId', type: 'integer' },
				{ name: 'searchTerm', type: 'text' },
			],
			queries: {
				"create": "",
				"update": "",
				"delete": ""
			}
		},
		{
			name: 'configuration',
			columns: [
				{ name: 'key', type: 'text primary key' },
				{ name: 'value', type: 'text' }
			]
		},
		{
			name: "org_master",
			columns:[
				{ name: 'id', type: 'integer primary key' },
				{ name: 'name', type: 'text' },
				{ name: 'upload', type: 'integer' },
				{ name: 'operator', type: 'text' },
				{ name: 'db', type: 'text' },
				{ name: 'active', type: 'integer' },
				{ name: 'token', type: 'text' },
				{ name: 'avatar', type: 'text' },
				{ name: 'logo', type: 'text' },
				{ name: 'custAccName', type: 'text' },
				{ name: 'username', type: 'text' },
				{ name: 'email', type: 'text' },
				{ name: 'title', type: 'text' },
				{ name: 'operatorFirstName', type: 'text' },
				{ name: 'operatorLastName', type: 'text' }
			],
			queries: {
				"create": "",
				"update": "",
				"delete": ""
			}
		}
	];

	constructor() {
		this.db = new SQLite();
		this.tables.forEach(element => {
			//do something
		});
		this.db.openDatabase({
			name: 'tradeshow.db',
			location: 'default' // the location field is required
		}).then(() => {
			this.db.executeSql('create table danceMoves(name VARCHAR(32))', {}).then(() => {

			}, (err) => {
				console.error('Unable to execute sql: ', err);
			});
		}, (err) => {
			console.error('Unable to open database: ', err);
		});
	}
}