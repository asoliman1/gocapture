import { Activation } from './../model/activation';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';
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
import { settingsKeys } from "../constants/constants";
import { TABLES } from "./db/tables";
import { VERSIONS } from "./db/versions";

let MASTER = "master";
let WORK = "work";

@Injectable()
export class DBClient {

	private migrator: Migrator;
	private manager: Manager;
	private registration: User;
	private saveAllEnabled = false;
	private saveAllPageSize = 500;
	private saveAllData: { query: string, type: string, parameters: any[] }[] = [];
	private tables: Table[] = TABLES;
	private versions = VERSIONS;

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
		form.event_address = typeof dbForm.event_address == "string" ? JSON.parse(dbForm.event_address) : dbForm.event_address;
		form.event_style = typeof dbForm.event_style == "string" ? JSON.parse(dbForm.event_style) : dbForm.event_style;
		form.available_for_users = typeof dbForm.available_for_users == "string" ? JSON.parse(dbForm.available_for_users) : dbForm.available_for_users;
		form.lastSync = typeof dbForm.lastSync == "string" ? JSON.parse(dbForm.lastSync) : dbForm.lastSync;

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
		form.activations = dbForm.activations ? JSON.parse(dbForm.activations) : [];
		form.show_reject_prompt = dbForm.show_reject_prompt == 1;
		form.duplicate_action = dbForm.duplicate_action;
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

	// public getActivations(): Observable<Activation[]> {
	// 	return this.getAll<any[]>(WORK, "activations", [])
	// 		.map((data) => {
	// 			return  Activation.parseActivations(data);
	// 		});
	// }

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
		return this.save(WORK, "forms", [form.id, form.form_id, form.name, form.list_id, form.title, form.description,
		form.success_message, form.submit_error_message, form.submit_button_text, form.created_at, form.updated_at,
		JSON.stringify(form.elements), false, null, null, null, form.archive_date, form.is_mobile_kiosk_mode ? 1 : 0,
		form.members_last_sync_date ? form.members_last_sync_date : "", form.is_mobile_quick_capture_mode ? 1 : 0,
		form.instructions_content, form.is_enforce_instructions_initially ? 1 : 0, JSON.stringify(form.event_stations),
		form.is_enable_rapid_scan_mode ? 1 : 0, JSON.stringify(form.available_for_users),
		JSON.stringify(form.event_address), JSON.stringify(form.event_style),JSON.stringify(form.lastSync),JSON.stringify(form.activations), form.show_reject_prompt ? 1 : 0,
		 form.duplicate_action]);
	}

	public saveActivation(activation: Activation): Observable<boolean> {
		return this.save(WORK, "activations", Object.keys(Activation.encodeActivation(activation)).map((e)=>activation[e]));
	}

	public saveForms(forms: Form[]): Observable<boolean> {
		return this.saveAll<Form>(forms, "Form");
	}

	public saveActivations(activations: Activation[]): Observable<boolean> {
		return this.saveAll<Activation>(activations, "activations");
	}

	public deleteFormsInList(list: number[]): Observable<boolean> {
		return new Observable<boolean>((responseObserver: Observer<boolean>) => {
			if (!list || list.length == 0) {
				responseObserver.next(true);
				responseObserver.complete();
				return;
			}
			this.manager.db(WORK).subscribe((db) => {
				// console.log("executing ", this.getQuery("forms", "deleteIn").replace("?", list.join(",")), []);
				db.executeSql(this.getQuery("forms", "deleteIn").replace("?", list.join(",")), [])
					.then((data) => {
						// console.log("executing ", this.getQuery("submissions", "deleteIn").replace("?", list.join(",")), []);
						db.executeSql(this.getQuery("submissions", "deleteIn").replace("?", list.join(",")), [])
							.then((data) => {
								// console.log("executing ", this.getQuery("contacts", "deleteIn").replace("?", list.join(",")), []);
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
				return this.mapUser(data);
			});
	}

	private mapUser(data : any) : User {
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
			user.in_app_support = data.support;
			user.support_email = data.supportEmail;
			user.documentation_url = data.documentationURL;
			user.localizations = typeof data.localizations == "string" ? JSON.parse(data.localizations) : data.localizations;
			user.localization = data.localization;
			user.activations = data.activations;
			this.registration = user;
			return user;
		}else return null;
	}


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
					let form = this.submissionFromDBEntry(dbForm);
					forms.push(form);
				});
				return forms;
			});
	}

	public getSubmissionById(activityId): Observable<FormSubmission> {
		return new Observable<FormSubmission>((responseObserver: Observer<FormSubmission>) => {
			this.manager.db(WORK).subscribe((db) => {
				db.executeSql(this.getQuery("submissions", "selectById"), [activityId])
					.then((data) => {
						let submission: FormSubmission;
						if (data && data.rows.length > 0) {
							let dbForm = data.rows.item(0);
							submission = this.submissionFromDBEntry(dbForm);
						}
						responseObserver.next(submission);
						responseObserver.complete();
					}, (err) => {
						responseObserver.error("An error occured: " + JSON.stringify(err));
					});
			});
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
							let form = this.submissionFromDBEntry(dbForm);
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


	private submissionFromDBEntry(dbForm) { // bug here
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
		form.hold_request_id = dbForm.hold_request_id;
		form.hidden_elements = dbForm.hidden_elements != "undefined" ? JSON.parse(dbForm.hidden_elements) : [];
		form.station_id = dbForm.station_id ? parseInt(dbForm.station_id) + '' : '';
		form.is_rapid_scan = dbForm.is_rapid_scan;
		form.stations = dbForm.stations != "undefined" ? JSON.parse(dbForm.stations) : dbForm.stations;
		form.captured_by_user_name = dbForm.captured_by_user_name;
		form.location = dbForm.location != "undefined" ? JSON.parse(dbForm.location) : null;
		// console.log(form);
		return form;
	}

	public saveSubmission(form: FormSubmission): Observable<boolean> {

		if (form.hold_request_id > 0) {
			return new Observable<boolean>((obs: Observer<boolean>) => {
				this.manager.db(WORK).subscribe((db) => {
					db.executeSql(this.getQuery('submissions', "selectByHoldId"), [form.hold_request_id]).then((data) => {
						if (data.rows.length == 1) {
							db.executeSql(this.getQuery('submissions', "updateByHoldId"), [form.id, form.status, form.activity_id, JSON.stringify(form.fields), form.first_name, form.last_name, form.full_name, form.email, false, null, JSON.stringify(form.location) ,form.hold_request_id])
								.then((data) => {
									obs.next(true);
									obs.complete();
								}, (err) => {
									obs.error("An error occured: " + JSON.stringify(err));
								});
							return;
						} else if (data.rows.length > 1) {
							db.executeSql(this.getQuery("submissions", "deleteByHoldId"), [form.hold_request_id])
								.then((data) => {
									db.executeSql(this.getQuery('submissions', "updateByHoldId"), [form.id, form.status, form.activity_id, JSON.stringify(form.fields), form.first_name, form.last_name, form.full_name, form.email, false, null,JSON.stringify(form.location), form.hold_request_id])
										.then((data) => {
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

	private composeParamsForSubmission(form: FormSubmission) {
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
			JSON.stringify(form.stations),
			form.captured_by_user_name,
			JSON.stringify(form.location)
		];
	}

	public updateSubmissionId(form: FormSubmission): Observable<boolean> {
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
			document.preview_urls,
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
			document.setId,
			document.file_path,
			document.preview_urls || '',
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

	public deleteActivation(activation: Activation) {
		return this.remove(WORK, "activations", [activation.id]);
	}

	public deleteHoldSubmission(form: FormSubmission) {
		return this.doUpdate(WORK, 'deleteByHoldId', 'submissions', [form.hold_request_id]);
	}

	public deleteDocuments(ids: number[]) {
		return new Observable<IDocument[]>((responseObserver: Observer<IDocument[]>) => {
			this.manager.db(WORK).subscribe((db) => {
				db.executeSql(this.getQuery("documents", "deleteIn").replace("?", ids.join(",")), [])
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
			user.device_id,
			user.in_app_support,
			user.support_email,
			user.documentation_url,
			JSON.stringify(user.localizations),
			user.localization,
			user.activations
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

	public deleteRegistration() {
		localStorage.clear();
		this.dropDb()
	}

	private remove(type: string, table: string, parameters: any[], key = "delete"): Observable<boolean> {
		return this.doUpdate(type, key, table, parameters);
	}

	private removeAll(type: string, table: string): Observable<boolean> {
		return this.doUpdate(type, "deleteAll", table);
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

	private getQuery(table: string, type: string): string {
		for (let i = 0; i < this.tables.length; i++) {
			if (this.tables[i].name == table) {
				let query = this.tables[i].queries[type];
				return query;
			}
		}
		return "";
	}

	// A.S drop db on unauthenticate
	public dropDb() {
		this.tables.forEach(async (e) => {
			this.removeAll(e.master ? MASTER : WORK, e.name).subscribe((data) => {
				console.log(`${e.name} removed from db`)
			}, err => {
				console.log(err);
			})
		})
	}
}
