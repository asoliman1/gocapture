import { Table } from './metadata';

export const TABLES : Table[] = [
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
  
];