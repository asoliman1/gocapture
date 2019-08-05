import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import {
  User,
  Form,
  DispatchOrder,
  FormElement,
  FormSubmission,
  DeviceFormMembership,
  SubmissionStatus,
  IDocument
} from "../model";
import { Migrator, Manager, Table } from "./db";
import { SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from "ionic-angular/platform/platform";

let MASTER = "master";
let WORK = "work";

@Injectable()
export class DBClient {

	private migrator: Migrator;
	private manager: Manager;

	private registration: User;

	private saveAllEnabled = false;
	private saveAllPageSize = 50;
	private saveAllData: { query: string, type: string, parameters: any[] }[] = [];

	private tables: Table[] = [
		{
			name: 'forms',
			master: false,
			columns: [
				{ name: 'id', type: 'integer not null' },
				{ name: 'formId', type: 'integer' },
				{ name: 'name', type: 'text' },
				{ name: 'title', type: 'text' },
				{ name: 'listId', type: 'text' },
				{ name: 'description', type: 'text' },
				{ name: 'success_message', type: 'text' },
				{ name: 'submit_error_message', type: 'text' },
				{ name: 'submit_button_text', type: 'text' },
				{ name: 'created_at', type: 'text' },
				{ name: 'updated_at', type: 'text' },
				{ name: 'elements', type: 'text' },
				{ name: 'isDispatch', type: 'integer not null' },
				{ name: 'dispatchData', type: 'text' },
				{ name: 'prospectData', type: 'text' },
				{ name: 'summary', type: 'text' },
				{ name: "primary key", type: "(id, isDispatch)" }
			],
			queries: {
				"select": "SELECT * FROM forms where isDispatch=?",
				"selectByIds": "SELECT * FROM forms where id in (?)",
				"selectAll": "SELECT id, formId, listId, name, title, description, success_message, submit_error_message, submit_button_text, created_at, updated_at, elements, isDispatch, dispatchData, prospectData, summary, is_mobile_kiosk_mode, is_mobile_quick_capture_mode, members_last_sync_date, is_enforce_instructions_initially, instructions_content, event_stations, is_enable_rapid_scan_mode, (SELECT count(*) FROM submissions WHERE status >= 1 and submissions.formId=Forms.id and  submissions.isDispatch = (?)) AS totalSub, (SELECT count(*) FROM submissions WHERE status in (2, 3) and submissions.formId=Forms.id and submissions.isDispatch = (?)) AS totalHold, (SELECT count(*) FROM submissions WHERE status = 1 and submissions.formId=Forms.id and submissions.isDispatch = (?)) AS totalSent, archive_date FROM forms where isDispatch = (?)",
				"update": "INSERT OR REPLACE INTO forms ( id, formId, name, listId, title, description, success_message, submit_error_message, submit_button_text, created_at, updated_at, elements, isDispatch, dispatchData, prospectData, summary, archive_date, is_mobile_kiosk_mode, members_last_sync_date, is_mobile_quick_capture_mode, instructions_content, is_enforce_instructions_initially, event_stations, is_enable_rapid_scan_mode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
				"delete": "DELETE from forms where id=?",
				"deleteIn": "delete FROM forms where formId in (?)",
				"deleteAll": "delete from forms"
			}
		},
		{
			name: 'submissions',
			master: false,
			columns: [
				{ name: 'id', type: 'integer primary key' },
				{ name: 'title', type: 'text' },
				{ name: 'sub_date', type: 'text' },
				{ name: 'formId', type: 'integer' },
				{ name: 'data', type: 'text' },
				{ name: 'status', type: 'integer' },
				{ name: 'firstName', type: 'text' },
				{ name: 'lastName', type: 'text' },
				{ name: 'email', type: 'text' },
				{ name: 'dispatchId', type: 'integer' },
				{ name: 'isDispatch', type: 'integer' }
			],
			queries: {
				"select": "SELECT * FROM submissions where formId=? and isDispatch=?",
				"selectAll": "SELECT * FROM submissions where formId=? and isDispatch=?",
				"selectByHoldId": "SELECT * FROM submissions where hold_request_id=? limit 1",
				"toSend": "SELECT * FROM submissions where status in (4,5)",
				"update": "INSERT OR REPLACE INTO submissions (id, formId, data, sub_date, status, firstName, lastName, fullName, email, isDispatch, dispatchId, activityId, hold_request_id, barcode_processed, submission_type, last_sync_date, hold_submission, hold_submission_reason, hidden_elements, station_id, is_rapid_scan, stations) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
				"updateFields": "UPDATE submissions set data=?, email=?, firstName=?, lastName=?, fullName=?, barcode_processed=?, hold_submission=?, hold_submission_reason=? where id=?",
				"delete": "DELETE from submissions where id=?",
				"deleteIn": "DELETE from submissions where formId in (?)",
				"deleteByHoldId": "DELETE from submissions where id in (select id from submissions where hold_request_id = ? limit 1)",
				"updateById": "UPDATE submissions set id=?, status=?, activityId=?, hold_request_id=?, invalid_fields=? where id=?",
        "updateWithStatus": "UPDATE submissions set status=?, last_sync_date=? where id=?",
				"updateByHoldId": "UPDATE submissions set id=?, status=?, activityId=?, data=?, firstName=?, lastName=?, fullName=?, email=?, isDispatch=?, dispatchId=? where hold_request_id=?",
				"deleteAll": "delete from submissions"
			}
		},
		{
			name: 'notifications',
			master: false,
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
			master: false,
			columns: [
				{ name: 'id', type: 'integer primary key' },
				{ name: 'data', type: 'text' },
				{ name: 'formId', type: 'integer' },
				{ name: 'membershipId', type: 'integer' },
				{ name: 'prospectId', type: 'integer' },
				{ name: 'added', type: 'string' },
				{ name: 'searchTerm', type: 'text' },
			],
			queries: {
				"selectAll": "select * from contacts inner join contact_forms on contacts.id = contact_forms.contactId where contact_forms.formId=?",
				"select": "select * from contacts where formId=? and prospectId=?",
				"update": "INSERT OR REPLACE INTO contacts (id, data, formId, membershipId, prospectId, added, searchTerm) VALUES (?, ?, ?, ?, ?, ?, ?)",
				"delete": "delete from contacts where id=?",
				"deleteIn": "delete from contacts where formId in (?)",
				"deleteAll": "delete from contacts"
			}
		},
		{
			name: 'contact_forms',
			master: false,
			columns: [
				{ name: 'formId', type: 'integer' },
				{ name: 'contactId', type: 'integer' },
				{ name: "primary key", type: "(formId, contactId)" }
			],
			queries: {
				"selectAll": "select * from contact_forms where formId=?",
				"update": "INSERT OR REPLACE INTO contact_forms (formId, contactId) VALUES (?, ?)",
				"delete": "delete from contact_forms where formId=?",
				"deleteIn": "delete from contact_forms where formId in (?)",
				"getAll": "select id, formId from contacts where formId is not NULL",
				"deleteAll": "delete from contact_forms"
			}
		},
		{
			name: 'configuration',
			master: false,
			columns: [
				{ name: 'key', type: 'text primary key' },
				{ name: 'value', type: 'text' }
			],
			queries: {
				"select": "SELECT * FROM configuration where key =?",
				"selectAll": "SELECT * from configuration",
				"update": "INSERT OR REPLACE INTO configuration (key, value) VALUES (?,?)",
				"delete": "DELETE FROM configuration WHERE key = (?)"
			}
		},
		{
			name: "org_master",
			master: true,
			columns: [
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
				"select": "SELECT * from org_master WHERE active = 1",
				"makeAllInactive": "UPDATE org_master set active = 0",
				"makeInactiveByIds": "UPDATE org_master set active = 0 where id in (?)",
				"update": "INSERT or REPLACE into org_master (id, name, operator, upload, db, active, token, avatar, logo, custAccName, username, email, title, operatorFirstName, operatorLastName, pushRegistered, isProduction, theme, deviceId) VALUES  (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
				"delete": "DELETE from org_master where id = ?",
				'updateRegistration': 'UPDATE org_master set registrationId = ?'
			}
		},
    {
      name: 'documents',
      master: false,
      columns: [
        { name: 'id', type: 'integer not null primary key' },
        { name: 'setId', type: 'integer' },
        { name: 'name', type: 'text' },
        { name: 'file_path', type: 'text' },
        { name: 'thumbnail_path', type: 'text' },
        { name: 'file_type', type: 'text' },
        { name: 'file_extension', type: 'text' },
        { name: 'vanity_url', type: 'text' },
        { name: 'created_at', type: 'text' },
        { name: 'updated_at', type: 'text' }
      ],
      queries: {
        "selectBySet": "SELECT * FROM documents WHERE setId=?",
        "selectByIds": "SELECT * FROM documents WHERE id IN (?)",
        "selectAll": "SELECT * FROM documents",
        "update": "INSERT OR REPLACE INTO documents ( id, setId, name, file_path, thumbnail_path, file_type, file_extension, vanity_url, created_at, updated_at ) VALUES (?,?,?,?,?,?,?,?,?,?)",
        "updateById": "UPDATE documents SET name=?, file_path=?, thumbnail_path=?, file_type=?, file_extension=?, updated_at=?, vanity_url=? WHERE id=?",
        "delete": "DELETE FROM documents WHERE id=?",
        "deleteIn": "DELETE FROM documents WHERE id IN (?)",
        "deleteBySet": "DELETE FROM documents WHERE setId IN (?)",
        "deleteAll": "DELETE FROM documents"
      }
    }
	];

	private versions = {
		queries: {
			getVersion: "select max(version) as version from versions;"
		},
		master: {
			2: {
				tables: [
					{
						name: 'versions',
						columns: [
							{ name: 'version', type: 'integer not null' },
							{ name: 'updated_at', type: 'text' }
						]
					}
				],
				queries: []
			},
			3: {
				queries: [
					"ALTER TABLE org_master add column pushRegistered integer default 0"
				]
			},
			4: {
				queries: [
					"ALTER TABLE org_master add column registrationId text"
				]
			},
			5: {
				queries: [
					"ALTER TABLE org_master add column isProduction integer default 1"
				]
			},
			6: {
				queries: [
					"ALTER TABLE org_master add column theme text"
				]
			},
      7: {
        queries: [
          "ALTER TABLE org_master add column deviceId integer"
        ]
      },
		},
		work: {
			1: {
				tables: [
					{
						name: 'versions',
						columns: [
							{ name: 'version', type: 'integer not null' },
							{ name: 'updated_at', type: 'text' }
						]
					},
          {
            name: 'documents',
            columns: [
              { name: 'id', type: 'integer not null primary key' },
              { name: 'setId', type: 'integer not null' },
              { name: 'name', type: 'text not null' },
              { name: 'file_path', type: 'text' },
              { name: 'thumbnail_path', type: 'text' },
              { name: 'file_type', type: 'text' },
              { name: 'file_extension', type: 'text' },
              { name: 'vanity_url', type: 'text' },
              { name: 'created_at', type: 'text' },
              { name: 'updated_at', type: 'text' }
            ]
          }
				],
				queries: [
					"ALTER TABLE submissions add column activityId VARCHAR(50)"
				]
			},
			2: {
				queries: [
					"ALTER table forms add column archive_date VARCHAR(50)"
				]
			},
			3: {
				queries: [
					"alter table submissions add column hold_request_id integer"
				]
			},
			4: {
				queries: [
					"alter table forms add column is_mobile_kiosk_mode integer default 0"
				]
			},
			5: {
				queries: [
					"INSERT OR REPLACE INTO configuration (key, value) VALUES ('autoUpload','true')"
				]
			},
			6: {
				queries: [
					"alter table submissions add column invalid_fields integer default 0"
				]
			},
			7: {
				custom: (db: SQLiteObject, callback) => {
					let t = this;
					db.executeSql("select id, formId from contacts where formId is not NULL", []).then(data => {
						console.log(data.rows.length);
						let list = [];
						let index = 0;
						while (index < data.rows.length) {
							list.push(data.rows.item(index));
							index++;
						}
						t.internalSaveAll<any>(db, list, "FormContact", 50).subscribe(() => {
							db.executeSql("update contacts set formId=NULL", []).then(() => {
								callback();
							}).catch(err => {
								console.error(err);
							});
						}, err => {
							console.error(err);
						});

					});
				},
				queries: []
			},
			8: {
				queries: [
					"alter table submissions add column barcode_processed integer default 0"
				]
			},
      9: {
        queries: [
          "alter table forms add column members_last_sync_date VARCHAR(50)"
        ]
      },
      10: {
        queries: [
          "alter table submissions add column submission_type VARCHAR(50)"
        ]
      },
      11: {
        queries: [
          "alter table submissions add column fullName VARCHAR(50)"
        ]
      },
      12: {
        queries: [
          "alter table forms add column is_mobile_quick_capture_mode integer default 0"
        ]
      },
      13: {
        queries: [
          "alter table forms add column is_enforce_instructions_initially integer default 0",
          "alter table forms add column instructions_content text"
        ]
      },
      14: {
        queries: [
          "alter table submissions add column last_sync_date text"
        ]
      },
      15: {
        queries: [
          "alter table submissions add column hold_submission integer",
          "alter table submissions add column hold_submission_reason text"
        ]
      },
      16: {
        queries: [
          "alter table submissions add column hidden_elements text"
        ]
      },
      17: {
        queries: [
          "alter table forms add column event_stations text"
        ]
      },
      18: {
        queries: [
          "alter table submissions add column station_id text"
        ]
      },
      19: {
        queries: [
          "alter table forms add column is_enable_rapid_scan_mode integer default 0"
        ]
      },
      20: {
        queries: [
          "alter table submissions add column is_rapid_scan integer default 0"
        ]
      },
      21: {
        queries: [
          "alter table submissions add column stations text"
        ]
      },
		}
	};
	/**
	 *
	 */
	constructor(private platform: Platform) {
		this.migrator = new Migrator();
		this.migrator.setMigrations(this.versions);
		this.manager = new Manager(platform, this.migrator, this.tables);
		this.manager.registerDb("tradeshow.db", MASTER, true);
	}
	/**
	 *
	 */
	public setupWorkDb(dbName) {
		this.manager.registerDb(dbName + ".db", WORK, false);
	}

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

	public updateRegistration(registrationid: string): Observable<boolean> {
		return this.doUpdate(MASTER, "updateRegistration", 'org_master', [registrationid]);
	}

	private parseForm(dbForm): Form {
		let form = new Form();
		form.id = dbForm.id;
		form.form_id = dbForm.formId;
		form.description = dbForm.description;
		form.title = dbForm.title;
		form.list_id = parseInt(dbForm.listId + "");
		form.name = dbForm.name;
		form.archive_date = dbForm.archive_date;
		form.members_last_sync_date = dbForm.members_last_sync_date;
		form.created_at = dbForm.created_at;
		form.updated_at = dbForm.updated_at;
		form.success_message = dbForm.success_message;
		form.is_mobile_kiosk_mode = dbForm.is_mobile_kiosk_mode == 1;
    form.is_mobile_quick_capture_mode = dbForm.is_mobile_quick_capture_mode == 1;
    form.is_enable_rapid_scan_mode = dbForm.is_enable_rapid_scan_mode == 1;
    form.is_enforce_instructions_initially = dbForm.is_enforce_instructions_initially == 1;
    form.instructions_content = dbForm.instructions_content;
		form.submit_error_message = dbForm.submit_error_message;
		form.submit_button_text = dbForm.submit_button_text;
		form.elements = typeof dbForm.elements == "string" ? JSON.parse(dbForm.elements) : dbForm.elements;
    form.event_stations = typeof dbForm.event_stations == "string" ? JSON.parse(dbForm.event_stations) : dbForm.event_stations;
		if (form.elements && form.elements.length > 0) {
			form.elements.sort((e1: FormElement, e2: FormElement): number => {
				if (e1.position < e2.position) {
					return -1;
				}
				if (e1.position > e2.position) {
					return 1;
				}
				return 0;
			});
			form.elements.forEach((e) => {
				if (e.options && e.options.length > 0) {
					e.options.sort((o1, o2): number => {
						if (o1.position < o2.position) {
							return -1;
						}
						if (o1.position > o2.position) {
							return 1;
						}
						return 0;
					});
				}
			});
		}
		form.total_submissions = dbForm.totalSub;
		form.total_hold = dbForm.totalHold;
		form.total_sent = dbForm.totalSent;
		form.computeIdentifiers();
		return form;
	}

	public getForms(): Observable<Form[]> {
		return this.getAll<any[]>(WORK, "forms", [false, false, false, false])
			.map((data) => {
				let forms = [];
				data.forEach((dbForm: any) => {
					forms.push(this.parseForm(dbForm));
				});
				return forms;
			});
	}

	public getFormsByIds(ids: number[]): Observable<Form[]> {
		return new Observable<Form[]>((responseObserver: Observer<Form[]>) => {
			this.manager.db(WORK).subscribe((db) => {
				db.executeSql(this.getQuery("forms", "selectByIds").replace("?", ids.join(",")), [])
					.then((data) => {
						var resp = [];
						for (let i = 0; i < data.rows.length; i++) {
							let dbForm = data.rows.item(i);
							resp.push(this.parseForm(dbForm));
						}
						responseObserver.next(resp);
						responseObserver.complete();
					}, (err) => {
						responseObserver.error("An error occured: " + JSON.stringify(err));
					});
			});
		});
	}

	public saveForm(form: Form): Observable<boolean> {
		//id, name, list_id, title, description, success_message, submit_error_message, submit_button_text, created_at,
		// updated_at, elements, isDispatch, dispatchData, prospectData, summary, archive_date
		return this.save(WORK, "forms", [form.id, form.form_id, form.name, form.list_id, form.title, form.description,
      form.success_message, form.submit_error_message, form.submit_button_text, form.created_at, form.updated_at,
      JSON.stringify(form.elements), false, null, null, null, form.archive_date, form.is_mobile_kiosk_mode ? 1 : 0,
      form.members_last_sync_date ? form.members_last_sync_date : "", form.is_mobile_quick_capture_mode ? 1 : 0,
      form.instructions_content, form.is_enforce_instructions_initially ? 1 : 0, JSON.stringify(form.event_stations),
      form.is_enable_rapid_scan_mode ? 1 : 0]);
	}

	public saveForms(forms: Form[]): Observable<boolean> {
		return this.saveAll<Form>(forms, "Form");
	}

	public deleteFormsInList(list: number[]): Observable<boolean> {
		return new Observable<boolean>((responseObserver: Observer<boolean>) => {
			if (!list || list.length == 0) {
				responseObserver.next(true);
				responseObserver.complete();
				return;
			}
			this.manager.db(WORK).subscribe((db) => {
				console.log("executing ", this.getQuery("forms", "deleteIn").replace("?", list.join(",")), []);
				db.executeSql(this.getQuery("forms", "deleteIn").replace("?", list.join(",")), [])
					.then((data) => {
						console.log("executing ", this.getQuery("submissions", "deleteIn").replace("?", list.join(",")), []);
						db.executeSql(this.getQuery("submissions", "deleteIn").replace("?", list.join(",")), [])
							.then((data) => {
								console.log("executing ", this.getQuery("contacts", "deleteIn").replace("?", list.join(",")), []);
								db.executeSql(this.getQuery("contacts", "deleteIn").replace("?", list.join(",")), [])
									.then((data) => {
										responseObserver.next(true);
										responseObserver.complete();
									}, (err) => {
										responseObserver.error("An error occured: " + JSON.stringify(err));
									});
							}, (err) => {
								responseObserver.error("An error occured: " + JSON.stringify(err));
							});
					}, (err) => {
						responseObserver.error("An error occured: " + JSON.stringify(err));
					});
			});
		});
	}
	/**
	 *
	 */
	public getRegistration(): Observable<User> {
		return this.getSingleWithCleanup<any>(MASTER, "org_master", null)
			.map((data) => {
				if (data) {
					let user = new User();
					user.access_token = data.token;
					user.customer_account_name = data.custAccName;
					user.user_profile_picture = data.avatar;
					user.customer_logo = data.logo;
					user.user_name = data.username;
					user.customer_name = data.name;
					user.theme = data.theme;
					user.db = data.db;
					user.email = data.email;
					user.first_name = data.operatorFirstName;
					user.id = data.id;
					user.is_active = data.active;
					user.last_name = data.operatorLastName;
					user.title = data.title;
					user.pushRegistered = data.pushRegistered;
					user.device_token = data.registrationId;
					user.is_production = data.isProduction;
					user.device_id = data.deviceId;
					this.registration = user;
					return user;
				}
				return null;
			});
	}

	/*
	public getDispatches(): Observable<DispatchOrder[]> {
		return this.getAll<any[]>(WORK, "forms", [true, true, true, true])
			.map((data) => {
				let forms = [];
				data.forEach((dbForm: any) => {
					let form = new DispatchOrder();
					form.form_id = dbForm.id;
					form.description = dbForm.description;
					form.name = dbForm.name;
					form.total_submissions = dbForm.totalSub;
					form.total_hold = dbForm.totalHold;
					let dispatch = JSON.parse(dbForm.dispatchData);
					form.device_id = dispatch.device_id;
					form.prospect_id = dispatch.prospect_id;
					form.fields_values = dispatch.fields_values;
					form.status = dispatch.status;
					form.form = this.parseForm(dispatch.form);
					forms.push(form);
				});
				return forms;
			});
	}
	 */

	public saveDispatchOrder(order: DispatchOrder): Observable<boolean> {
		//console.log("saving");
		//id, name, title, description, success_message, submit_error_message, submit_button_text, created_at, updated_at, elements, isDispatch, dispatchData, prospectData, summary
		return this.save(WORK, "forms", [order.id, order.form_id, order.name, order.form.title, order.description || order.form.description, order.form.success_message, order.form.submit_error_message, order.form.submit_button_text, order.date_created, order.date_last_modified, JSON.stringify(order.form.elements), true, JSON.stringify(order), null, null]);
	}

	/*
	public saveDispatches(forms: DispatchOrder[]): Observable<boolean> {
		return this.saveAll<DispatchOrder>(forms, "DispatchOrder");
	}

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

	public getMembership(form_id: number, prospect_id: number): Observable<DeviceFormMembership> {
		return this.getSingle<any>(WORK, "contacts", [form_id, prospect_id])
			.map((dbForm) => {
				if (dbForm) {
					let form = new DeviceFormMembership();
					form.form_id = dbForm.formId;
					form.id = dbForm.id;
					form.added_date = dbForm.added;
					form.membership_id = dbForm.membershipId;
					form.prospect_id = dbForm.prospectId;
					form.fields = JSON.parse(dbForm.data);
					form["search"] = form.fields["Email"] + " " + form.fields["FirstName"] + " " + form.fields["LastName"];

					return form;
				}
				return null;
			});
	}

	public saveMembership(form: DeviceFormMembership): Observable<boolean> {
		return this.save(WORK, "contacts", [form.membership_id, JSON.stringify(form.fields), form.form_id, form.membership_id, form.prospect_id, form.added_date, ""]);
	}

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

	public saveFormContact(data: any): Observable<boolean> {
		return this.save(WORK, "contact_forms", [data.formId, data.id]);
	}

	public saveContactForms(forms: any[]): Observable<boolean> {
		return this.saveAll<any>(forms, "FormContact");
	}

	public getSubmissions(formId: number, isDispatch): Observable<FormSubmission[]> {
		return this.getAll<any[]>(WORK, "submissions", [formId, isDispatch])
			.map((data) => {
				let forms = [];
				data.forEach((dbForm: any) => {
          let form = this.submissonFromDBEntry(dbForm);
					forms.push(form);
				});
				return forms;
			});
	}

	public getSubmissionsToSend(): Observable<FormSubmission[]> {
		return new Observable<FormSubmission[]>((responseObserver: Observer<FormSubmission[]>) => {
			this.manager.db(WORK).subscribe((db) => {
				db.executeSql(this.getQuery("submissions", "toSend"), [])
					.then((data) => {
						var resp = [];
						for (let i = 0; i < data.rows.length; i++) {
							let dbForm = data.rows.item(i);

              let form = this.submissonFromDBEntry(dbForm);
              resp.push(form);
						}
						responseObserver.next(resp);
						responseObserver.complete();
					}, (err) => {
						responseObserver.error("An error occured: " + JSON.stringify(err));
					});
			});
		});
	}


  private submissonFromDBEntry(dbForm) {
    let form = new FormSubmission();
    form.id = dbForm.id;
    form.form_id = dbForm.formId;
    form.fields = JSON.parse(dbForm.data);
    form.status = dbForm.status;
    form.first_name = dbForm.firstName;
    form.last_name = dbForm.lastName;
    form.full_name = dbForm.fullName;
    form.email = dbForm.email;
    form.invalid_fields = dbForm.invalid_fields;
    form.activity_id = dbForm.activityId;
    form.barcode_processed = dbForm.barcode_processed;
    form.submission_type = dbForm.submission_type;
    form.sub_date = dbForm.sub_date;
    form.last_sync_date = dbForm.last_sync_date;
    form.hold_submission = dbForm.hold_submission;
    form.hold_submission_reason = dbForm.hold_submission_reason;
    form.hidden_elements = JSON.parse(dbForm.hidden_elements);
    form.station_id = dbForm.station_id ? parseInt(dbForm.station_id) + '' : '';
    form.is_rapid_scan = dbForm.is_rapid_scan;
    form.stations = typeof dbForm.stations == "string" ? JSON.parse(dbForm.stations) : dbForm.stations;
    return form;
  }

	public saveSubmission(form: FormSubmission): Observable<boolean> {

		if (form.hold_request_id > 0) {
			//UPDATE submissions set id=?, status =?, activityId=?, data=?, sub_date=?, firstName=?, lastName=?, email=?, isDispatch=?, dispatchId=? where hold_request_id=?
			return new Observable<boolean>((obs: Observer<boolean>) => {
				this.manager.db(WORK).subscribe((db) => {
					db.executeSql(this.getQuery('submissions', "selectByHoldId"), [form.hold_request_id]).then((data) => {
						console.log(data.rows.length);
						if (data.rows.length == 1) {
							console.log("1 row");
							db.executeSql(this.getQuery('submissions', "updateByHoldId"), [form.id, SubmissionStatus.Submitted, form.activity_id, JSON.stringify(form.fields), form.first_name, form.last_name, form.full_name, form.email, false, null, form.hold_request_id])
								.then((data) => {
									obs.next(true);
									obs.complete();
								}, (err) => {
									obs.error("An error occured: " + JSON.stringify(err));
								});
							return;
						} else if (data.rows.length > 1) {
							console.log("more than a row");
							db.executeSql(this.getQuery("submissions", "deleteByHoldId"), [form.hold_request_id])
								.then((data) => {
									console.log(data);
									db.executeSql(this.getQuery('submissions', "updateByHoldId"), [form.id, SubmissionStatus.Submitted, form.activity_id, JSON.stringify(form.fields), form.first_name, form.last_name, form.full_name, form.email, false, null, form.hold_request_id])
										.then((data) => {
											console.log(data);
											obs.next(true);
											obs.complete();
										}, (err) => {
											obs.error("An error occured: " + JSON.stringify(err));
										});
								}, (err) => {
									obs.error("An error occured: " + JSON.stringify(err));
								});
							return;
						}

						let params = this.composeParamsForSubmission(form);

						this.save(WORK, "submissions", params).subscribe(
							(d) => {
								obs.next(true);
								obs.complete();
							}, err => {
								obs.error(err);
							}
						);

					}, (err) => {
						obs.error("An error occured: " + JSON.stringify(err));
					});
				});
			});
		}

    let params = this.composeParamsForSubmission(form);
		return this.save(WORK, "submissions", params);
	}

	private composeParamsForSubmission(form) {
    return [
      form.id,
      form.form_id,
      JSON.stringify(form.fields),
      form.sub_date ? form.sub_date : new Date().toISOString(),
      form.status,
      form.first_name,
      form.last_name,
      form.full_name,
      form.email,
      false,
      null,
      form.activity_id,
      form.hold_request_id,
      form.barcode_processed,
      form.submission_type,
      form.last_sync_date ? form.sub_date : new Date().toISOString(),
      form.hold_submission,
      form.hold_submission_reason,
      JSON.stringify(form.hidden_elements),
      form.station_id,
      form.is_rapid_scan,
      JSON.stringify(form.stations)];
  }

	public updateSubmissionId(form: FormSubmission): Observable<boolean> {
		//id, formId, data, sub_date, status, isDispatch, dispatchId
    let formId = form.activity_id || form.id;
		return this.updateById(WORK, "submissions", [formId, form.status, form.activity_id, form.hold_request_id, form.invalid_fields, form.id]);
	}

  public updateSubmissionStatus(form: FormSubmission): Observable<boolean> {
    return this.updateWithStatus(WORK, "submissions", [form.status, form.last_sync_date, form.id]);
  }

	public updateSubmissionFields(form: Form, sub: FormSubmission): Observable<boolean> {
		sub.updateFields(form);
		return this.doUpdate(WORK, "updateFields", "submissions", [JSON.stringify(sub.fields), sub.email, sub.first_name, sub.last_name, sub.full_name, sub.barcode_processed, sub.hold_submission, sub.hold_submission_reason, sub.id]);
	}

	public getDocumentsByIds(ids: number[]) {
    return new Observable<IDocument[]>((responseObserver: Observer<IDocument[]>) => {
      this.manager.db(WORK).subscribe((db) => {
        db.executeSql(this.getQuery("documents", "selectByIds").replace("?", ids.join(",")), [])
          .then((data) => {
            if (!data.rows.length) {
              responseObserver.next(null);
              responseObserver.complete();

              return;
            }

            const documents: IDocument[] = [];

            for (let i = 0; i < data.rows.length; i++) {
              documents.push(data.rows.item(i));
            }

            responseObserver.next(documents);
            responseObserver.complete();
          }, (err) => {
            responseObserver.error("An error occurred: " + JSON.stringify(err));
          });
      });
    });
  }

  public getDocumentsBySetId(setId: number) {
    return new Observable<IDocument[]>((responseObserver: Observer<IDocument[]>) => {
      this.manager.db(WORK).subscribe((db) => {
        db.executeSql(this.getQuery("documents", "selectBySet"), [setId])
          .then((data) => {
            if (!data.rows.length) {
              responseObserver.next(null);
              responseObserver.complete();

              return;
            }

            const documents: IDocument[] = [];

            for (let i = 0; i < data.rows.length; i++) {
              documents.push(data.rows.item(i));
            }

            responseObserver.next(documents);
            responseObserver.complete();
          }, (err) => {
            responseObserver.error("An error occurred: " + JSON.stringify(err));
          });
      });
    });
  }

  public saveDocument(document: IDocument) {
	  const now = Date.now();
	  return this.save(WORK, 'documents', [
	    document.id,
      document.setId,
      document.name,
      document.file_path,
      document.thumbnail_path,
      document.file_type,
      document.file_extension,
      document.vanity_url,
      now,
      now
    ])
  }

	public updateDocument(document: IDocument) {
	  return this.updateById(WORK, 'documents', [
	    document.name,
      document.file_path,
      document.thumbnail_path || '',
      document.file_type,
      document.file_extension || '',
      document.vanity_url,
      Date.now(),
      document.id
    ]);
  }

	public saveSubmisisons(forms: FormSubmission[], pageSize: number = 1): Observable<boolean> {
		return this.saveAll<FormSubmission>(forms, "Submission");
	}

	public deleteSubmission(form: FormSubmission) {
		return this.remove(WORK, "submissions", [form.id]);
	}

  public deleteHoldSubmission(form: FormSubmission) {
    return this.doUpdate(WORK, 'deleteByHoldId', 'submissions', [form.hold_request_id]);
  }

  public deleteDocuments(ids: number[]) {
	  return this.doUpdate(WORK, 'deleteIn', 'documents', [ids.join(',')]);
  }

  public deleteAllDocuments() {
    return this.doUpdate(WORK, 'deleteAll', 'documents', []);
  }

	/**§
	 *
	 */
	public saveRegistration(user: User): Observable<boolean> {
		user.db = user.customer_account_name.replace(/\s*/g, '') + (user.is_production == 1 ? "_prod" : "_dev");
		return this.save(MASTER, "org_master", [
			user.id,
			user.customer_name,
			user.first_name + ' ' + user.last_name,
			1,
			user.db,
			1,
			user.access_token,
			user.user_profile_picture,
			user.customer_logo,
			user.customer_account_name,
			user.user_name,
			user.email,
			user.title,
			user.first_name,
			user.last_name,
			user.pushRegistered,
			user.is_production,
			user.theme,
      user.device_id
		]).map(data => {
			this.registration = user;
			return data;
		});
	}

	public makeAllAccountsInactive(): Observable<boolean> {
		return new Observable<boolean>((obs: Observer<boolean>) => {
			this.manager.db(MASTER).subscribe((db) => {
				db.executeSql(this.getQuery("org_master", "makeAllInactive"), [])
					.then((data) => {
						obs.next(true);
						obs.complete();
					});
			});
		});
	}

	public deleteRegistration(authId: string): Observable<boolean> {
		return this.remove(MASTER, "org_master", [authId])
			.map(data => {
				this.registration = null;
				return data;
			});
	}

	private remove(type: string, table: string, parameters: any[], key = "delete"): Observable<boolean> {
		return this.doUpdate(type, key, table, parameters);
	}

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
			console.log("Start save all " + type + " " + items.length);

			let exec = (done: boolean) => {
				console.log('Save all data: ' + this.saveAllData.length);
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
							//
						}, function (error) {
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
				})
			};

			let page = pageSize > 0 ? pageSize : this.saveAllPageSize;

			let handler = (resp: boolean, stopExec?: boolean) => {
				index++;
				if (index % page == 0) {
					console.log("save " + type + " " + index);
					exec(index == items.length);
					if (index == items.length) {
						return;
					}
				} else if (index == items.length) {
					this.saveAllEnabled = false;
					console.log("save " + type + " " + index);
					exec(true);
					return;
				} else if (index < items.length) {
					this[name](items[index]).subscribe(handler);
				}
			};
			this[name](items[0]).subscribe(handler);
		});
	}

	private save(type: string, table: string, parameters: any[]): Observable<boolean> {
		return new Observable<boolean>((responseObserver: Observer<boolean>) => {
			if (this.saveAllEnabled) {
				this.saveAllData.push({ query: this.getQuery(table, "update"), type: type, parameters: parameters });
				setTimeout(() => {
					responseObserver.next(true);
					responseObserver.complete();
				});
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

	private updateById(type: string, table: string, parameters: any[]): Observable<boolean> {
		return this.doUpdate(type, "updateById", table, parameters);
	}

  private updateWithStatus(type: string, table: string, parameters: any[]): Observable<boolean> {
    return this.doUpdate(type, "updateWithStatus", table, parameters);
  }

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

	private getSingleWithCleanup<T>(type: string, table: string, parameters: any[]): Observable<T> {
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
							let ids = [];
							for (let i = 0; i < data.rows.length - 1; i++) {
								ids.push(data.rows.item(i).id);
							}
							db.executeSql(this.getQuery(table, "makeInactiveByIds").replace("?", ids.join(",")), []).then(() => {
								responseObserver.next(data.rows.item(data.rows.length - 1));
								responseObserver.complete();
							}, (err) => {
								responseObserver.error("An error occured: " + JSON.stringify(err));
							})
						}
					}, (err) => {
						responseObserver.error("An error occured: " + JSON.stringify(err));
					});
			});
		});
	}

	private getMultiple<T>(type: string, table: string, parameters: any[]): Observable<T[]> {
		return this.doGet<T>(type, "select", table, parameters);
	}

	private getAll<T>(type: string, table: string, params?: any[]): Observable<T[]> {
		return this.doGet<T>(type, "selectAll", table, params);
	}

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

	private doUpdate(type: string, queryId: string, table: string, params?: any[]): Observable<boolean> {
		return new Observable<boolean>((responseObserver: Observer<boolean>) => {
			this.manager.db(type).subscribe((db) => {
				db.executeSql(this.getQuery(table, queryId), params)
					.then((data) => {
						if (data.rowsAffected == 1) {
							responseObserver.next(true);
							responseObserver.complete();
						} else {
							responseObserver.error("Wrong number of affected rows: " + data.rowsAffected);
						}
					}, (err) => {
						responseObserver.error("An error occured: " + JSON.stringify(err));
					});
			});
		});
	}

	private getQuery(table: string, type: string): string {
		for (let i = 0; i < this.tables.length; i++) {
			if (this.tables[i].name == table) {
				return this.tables[i].queries[type];
			}
		}
		return "";
	}
}
