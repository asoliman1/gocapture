export const VERSIONS = {
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
                    ],
                },
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
        8: {
            queries: [
                "alter table org_master add column support integer default 0",
                "alter table org_master add column supportEmail text",
                "alter table org_master add column documentationURL text",
            ]
        },
        9: {
            queries: [
              "ALTER TABLE org_master add column localizations text",
              "ALTER TABLE org_master add column localization text",
            ]
          },
          10: {
            queries: [
              "ALTER TABLE org_master add column activations integer default 0",
            ]
          }
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
                        { name: 'setId', type: 'integer' },
                        { name: 'name', type: 'text' },
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
            // custom: (db: SQLiteObject, callback) => {
            // 	let t = this;
            // 	db.executeSql("select id, formId from contacts where formId is not NULL", []).then(data => {
            // 		let list = [];
            // 		let index = 0;
            // 		while (index < data.rows.length) {
            // 			list.push(data.rows.item(index));
            // 			index++;
            // 		}
            // 		t.internalSaveAll<any>(db, list, "FormContact", 50).subscribe(() => {
            // 			db.executeSql("update contacts set formId=NULL", []).then(() => {
            // 				callback();
            // 			}).catch(err => {
            // 				console.error(err);
            // 			});
            // 		}, err => {
            // 			console.error(err);
            // 		});

            // 	});
            // },
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
        22: {
            queries: [
                "alter table documents add column preview_urls text"
            ]
        },
        23: {
            queries: [
                "alter table submissions add column captured_by_user_name text"
            ]
        },
        24: {
            queries: [
                "alter table forms add column available_for_users text"
            ]
        },
        25: {
            queries: [
                "alter table forms add column event_address text",
            ]
        },
        26: {
            queries: [
                "alter table forms add column event_style text",
            ]
        },
        27: {
            queries: [
                "alter table submissions add column location text",
            ]
        },
        28: {
            queries: [
                "alter table forms add column lastSync text",
            ]
        },
        29 :  {
            queries: [
                "alter table forms add column activations text",
            ]
        },
        30 :  {
            queries: [
                "alter table forms add column show_reject_prompt integer default 0",
            ]
        },
        31 :  {
            queries: [
                "alter table forms add column duplicate_action text",
            ]
        },
        32: {
            queries: [
                "alter table submissions add column barcodeID text",
            ]
        },
        33: {
            queries: [
                "alter table forms add column unique_identifier_barcode integer default 0",
                "alter table forms add column unique_identifier_name integer default 0",
                "alter table forms add column unique_identifier_email integer default 0"
            ]
        },
        34 :  {
            queries: [
                "alter table forms add column ignore_submissions_from_activations integer default 0",
            ]
        }
    }
};