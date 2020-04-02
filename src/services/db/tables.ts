import { Table } from './metadata';

export const TABLES : Table[] = [
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
            { name: "primary key", type: "(id, isDispatch)" },
        ],
        queries: {
            "select": "SELECT * FROM forms where isDispatch=?",
            "selectByIds": "SELECT * FROM forms where id in (?)",
            "selectAll": "SELECT id, formId, listId, name, title, description, success_message, submit_error_message, submit_button_text, created_at, updated_at, elements, isDispatch, dispatchData, prospectData, summary, is_mobile_kiosk_mode, is_mobile_quick_capture_mode, members_last_sync_date, is_enforce_instructions_initially, instructions_content, event_stations, is_enable_rapid_scan_mode, available_for_users, event_address, event_style,lastSync,activations, show_reject_prompt,duplicate_action, (SELECT count(*) FROM submissions WHERE status >= 1 and submissions.formId=Forms.id and  submissions.isDispatch = (?)) AS totalSub, (SELECT count(*) FROM submissions WHERE status in (2, 3) and submissions.formId=Forms.id and submissions.isDispatch = (?)) AS totalHold, (SELECT count(*) FROM submissions WHERE status = 1 and submissions.formId=Forms.id and submissions.isDispatch = (?)) AS totalSent, archive_date FROM forms where isDispatch = (?)",
            "update": "INSERT OR REPLACE INTO forms ( id, formId, name, listId, title, description, success_message, submit_error_message, submit_button_text, created_at, updated_at, elements, isDispatch, dispatchData, prospectData, summary, archive_date, is_mobile_kiosk_mode, members_last_sync_date, is_mobile_quick_capture_mode, instructions_content, is_enforce_instructions_initially, event_stations, is_enable_rapid_scan_mode, available_for_users, event_address, event_style , lastSync , activations, show_reject_prompt, duplicate_action) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
            "selectById": "SELECT * FROM submissions where id=? limit 1",
            "toSend": "SELECT * FROM submissions where status in (4,5)",
            "update": "INSERT OR REPLACE INTO submissions (id, formId, data, sub_date, status, firstName, lastName, fullName, email, isDispatch, dispatchId, activityId, hold_request_id, barcode_processed, submission_type, last_sync_date, hold_submission, hold_submission_reason, hidden_elements, station_id, is_rapid_scan, stations, captured_by_user_name, location) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            "updateFields": "UPDATE submissions set data=?, email=?, firstName=?, lastName=?, fullName=?, barcode_processed=?, hold_submission=?, hold_submission_reason=? where id=?",
            "delete": "DELETE from submissions where id=?",
            "deleteIn": "DELETE from submissions where formId in (?)",
            "deleteByHoldId": "DELETE from submissions where id in (select id from submissions where hold_request_id = ? limit 1)",
            "updateById": "UPDATE submissions set id=?, status=?, activityId=?, hold_request_id=?, invalid_fields=? where id=?",
            "updateWithStatus": "UPDATE submissions set status=?, last_sync_date=? where id=?",
            "updateByHoldId": "UPDATE submissions set id=?, status=?, activityId=?, data=?, firstName=?, lastName=?, fullName=?, email=?, isDispatch=?, dispatchId=?, location=?, station_id=? where hold_request_id=?",
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
            "delete": "DELETE FROM configuration WHERE key = (?)",
            "deleteAll": "delete from configuration"
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
            { name: 'operatorLastName', type: 'text' },
            
        ],
        queries: {
            "select": "SELECT * from org_master WHERE active = 1",
            "makeAllInactive": "UPDATE org_master set active = 0",
            "makeInactiveByIds": "UPDATE org_master set active = 0 where id in (?)",
            "update": "INSERT or REPLACE into org_master (id, name, operator, upload, db, active, token, avatar, logo, custAccName, username, email, title, operatorFirstName, operatorLastName, pushRegistered, isProduction, theme, deviceId, support, supportEmail, documentationURL , localizations , localization, activations) VALUES  (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            "delete": "DELETE from org_master where id = ?",
            'updateRegistration': 'UPDATE org_master set registrationId = ?',
            "deleteAll": "delete from org_master"
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
            "update": "INSERT OR REPLACE INTO documents ( id, setId, name, file_path, preview_urls, file_type, file_extension, vanity_url, created_at, updated_at ) VALUES (?,?,?,?,?,?,?,?,?,?)",
            "updateById": "UPDATE documents SET name=?, setId=?, file_path=?, preview_urls=?, file_type=?, file_extension=?, vanity_url=?, updated_at=? WHERE id=?",
            "delete": "DELETE FROM documents WHERE id=?",
            "deleteIn": "DELETE FROM documents WHERE id IN (?)",
            "deleteBySet": "DELETE FROM documents WHERE setId IN (?)",
            "deleteAll": "DELETE FROM documents"
        }
    },
    {
        name: 'activations',
        master : false,
        columns: [
            { name: 'id', type: 'integer not null' },
            { name: 'name', type: 'text not null' },
            { name: 'create_date', type: 'text' },
            { name: 'modified_date', type: 'text' },
            { name: 'activation_identifier', type: 'text' },
            { name: 'event', type: 'text not null' },
            { name: 'is_active', type: 'integer' },
        ],
        queries : {
            "select": "SELECT * FROM activations",
            "selectByIds": "SELECT * FROM activations where id in (?)",
            "selectAll": "SELECT * FROM activations",
            "update": "INSERT OR REPLACE INTO activations (id,name,create_date,modified_date,activation_identifier,event,is_active) VALUES (?,?,?,?,?,?,?)",
            "delete": "DELETE FROM activations where id=?",
            "deleteIn": "delete FROM activations where id in (?)",
            "deleteAll": "delete FROM activations"
        }
    }
];