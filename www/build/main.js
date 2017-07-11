webpackJsonp([0],{

/***/ 107:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// CONCATENATED MODULE: ./src/model/protocol/response.ts
var BaseResponse = (function () {
    function BaseResponse() {
    }
    return BaseResponse;
}());

//# sourceMappingURL=response.js.map
// CONCATENATED MODULE: ./src/model/protocol/data-response.ts
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var DataResponse = (function (_super) {
    __extends(DataResponse, _super);
    function DataResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DataResponse;
}(BaseResponse));

//# sourceMappingURL=data-response.js.map
// CONCATENATED MODULE: ./src/model/protocol/records-response.ts
var records_response___extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var RecordsResponse = (function (_super) {
    records_response___extends(RecordsResponse, _super);
    function RecordsResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RecordsResponse;
}(BaseResponse));

//# sourceMappingURL=records-response.js.map
// CONCATENATED MODULE: ./src/model/protocol/push-response.ts
var PushResponse = (function () {
    function PushResponse() {
    }
    return PushResponse;
}());

//# sourceMappingURL=push-response.js.map
// CONCATENATED MODULE: ./src/model/protocol/auth-request.ts
var AuthenticationRequest = (function () {
    function AuthenticationRequest() {
        this.auth_type = "device_form";
        this.cordova = 1;
    }
    return AuthenticationRequest;
}());

//# sourceMappingURL=auth-request.js.map
// CONCATENATED MODULE: ./src/model/protocol/submission-response.ts
var SubmissionResponse = (function () {
    function SubmissionResponse() {
    }
    return SubmissionResponse;
}());

var SubmissionDataResponse = (function () {
    function SubmissionDataResponse() {
    }
    return SubmissionDataResponse;
}());

//# sourceMappingURL=submission-response.js.map
// CONCATENATED MODULE: ./src/model/protocol/file-upload-request.ts
var FileUploadRequest = (function () {
    function FileUploadRequest() {
        this.files = [];
    }
    return FileUploadRequest;
}());

var FileInfo = (function () {
    function FileInfo() {
    }
    return FileInfo;
}());

//# sourceMappingURL=file-upload-request.js.map
// CONCATENATED MODULE: ./src/model/protocol/file-upload-response.ts
var file_upload_response___extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var FileUploadResponse = (function (_super) {
    file_upload_response___extends(FileUploadResponse, _super);
    function FileUploadResponse() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.files = [];
        return _this;
    }
    return FileUploadResponse;
}(BaseResponse));

var FileResponse = (function () {
    function FileResponse() {
    }
    return FileResponse;
}());

//# sourceMappingURL=file-upload-response.js.map
// CONCATENATED MODULE: ./src/model/protocol/form-submit-response.ts
var form_submit_response___extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var FormSubmitResponse = (function (_super) {
    form_submit_response___extends(FormSubmitResponse, _super);
    function FormSubmitResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FormSubmitResponse;
}(BaseResponse));

//# sourceMappingURL=form-submit-response.js.map
// CONCATENATED MODULE: ./src/model/protocol/index.ts









//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/model/user.ts
var User = (function () {
    function User() {
        this.pushRegistered = 0;
    }
    return User;
}());

//# sourceMappingURL=user.js.map
// CONCATENATED MODULE: ./src/model/base-form.ts
var BaseForm = (function () {
    function BaseForm() {
    }
    return BaseForm;
}());

//# sourceMappingURL=base-form.js.map
// CONCATENATED MODULE: ./src/model/form.ts
var form___extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Form = (function (_super) {
    form___extends(Form, _super);
    function Form() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Form.getIdByUniqueFieldName = function (name, form) {
        var element = null;
        for (var i = 0; i < form.elements.length; i++) {
            element = form.elements[i];
            if (!element.mapping || element.mapping.length == 0) {
                continue;
            }
            if (element.mapping.length == 1) {
                if (element.mapping[0].ll_field_unique_identifier == name) {
                    return element["identifier"];
                }
                continue;
            }
            for (var j = 0; j < element.mapping.length; j++) {
                if (element.mapping[j].ll_field_unique_identifier == name) {
                    return element.mapping[j]["identifier"];
                }
            }
        }
        return null;
    };
    Form.prototype.getUrlFields = function () {
        var res = [];
        var types = ["business_card", "image", "signature"];
        var element = null;
        for (var i = 0; i < this.elements.length; i++) {
            element = this.elements[i];
            if (types.indexOf(element.type) > -1) {
                res.push(element["identifier"]);
            }
        }
        return res;
    };
    Form.prototype.getIdByUniqueFieldName = function (name) {
        return Form.getIdByUniqueFieldName(name, this);
    };
    Form.prototype.getFieldById = function (id) {
        if (id > 0) {
            for (var i = 0; i < this.elements.length; i++) {
                if (this.elements[i].id == id) {
                    return this.elements[i];
                }
            }
        }
        return null;
    };
    Form.prototype.computeIdentifiers = function () {
        this.elements.forEach(function (element) {
            if (element["identifier"]) {
                return;
            }
            var identifier = "element_" + element.id;
            element["identifier"] = identifier;
            if (element.mapping.length > 1) {
                element.mapping.forEach(function (entry, index) {
                    entry["identifier"] = identifier + "_" + (index + 1);
                });
            }
        });
    };
    return Form;
}(BaseForm));

//# sourceMappingURL=form.js.map
// CONCATENATED MODULE: ./src/model/form-element.ts
var FormElement = (function () {
    function FormElement() {
    }
    return FormElement;
}());

var ElementMapping = (function () {
    function ElementMapping() {
    }
    return ElementMapping;
}());

//# sourceMappingURL=form-element.js.map
// CONCATENATED MODULE: ./src/model/form-submission.ts

var form_submission_FormSubmission = (function () {
    function FormSubmission() {
        this.id = null;
        this.form_id = null;
        this.status = null;
        this.prospect_id = null;
        this.email = "";
        this.company = "";
        this.phone = "";
        this.first_name = "";
        this.last_name = "";
        this.activity_id = null;
        this.hold_request_id = null;
        this.fields = {};
    }
    FormSubmission.prototype.isSubmitted = function () {
        return this.status == SubmissionStatus.Submitted;
    };
    FormSubmission.prototype.updateFields = function (form) {
        var _this = this;
        form.elements.forEach(function (element) {
            switch (element.type) {
                case "simple_name":
                    _this.first_name = _this.fields[element["identifier"] + "_1"] || "";
                    _this.last_name = _this.fields[element["identifier"] + "_2"] || "";
                    break;
                case "email":
                    _this.email = _this.fields[element["identifier"]] || "";
                    break;
            }
        });
        var id = form instanceof Form ? form.getIdByUniqueFieldName("WorkPhone") : Form.getIdByUniqueFieldName("WorkPhone", form);
        if (id) {
            this.phone = this.fields[id] || "";
        }
        id = form instanceof Form ? form.getIdByUniqueFieldName("Company") : Form.getIdByUniqueFieldName("Company", form);
        if (id) {
            this.company = this.fields[id] || "";
        }
    };
    return FormSubmission;
}());

var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus[SubmissionStatus["Submitted"] = 1] = "Submitted";
    SubmissionStatus[SubmissionStatus["OnHold"] = 2] = "OnHold";
    SubmissionStatus[SubmissionStatus["Blocked"] = 3] = "Blocked";
    SubmissionStatus[SubmissionStatus["ToSubmit"] = 4] = "ToSubmit";
    SubmissionStatus[SubmissionStatus["Submitting"] = 5] = "Submitting";
})(SubmissionStatus || (SubmissionStatus = {}));
//# sourceMappingURL=form-submission.js.map
// CONCATENATED MODULE: ./src/model/dispatch.ts
var Dispatch = (function () {
    function Dispatch() {
    }
    return Dispatch;
}());

//# sourceMappingURL=dispatch.js.map
// CONCATENATED MODULE: ./src/model/dispatch-order.ts
var dispatch_order___extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var DispatchOrder = (function (_super) {
    dispatch_order___extends(DispatchOrder, _super);
    function DispatchOrder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DispatchOrder;
}(BaseForm));

//# sourceMappingURL=dispatch-order.js.map
// CONCATENATED MODULE: ./src/model/membership.ts
var DeviceFormMembership = (function () {
    function DeviceFormMembership() {
    }
    return DeviceFormMembership;
}());

//# sourceMappingURL=membership.js.map
// CONCATENATED MODULE: ./src/model/sync-status.ts
var SyncStatus = (function () {
    function SyncStatus(loading, complete, formId, formName, percent) {
        this.complete = false;
        this.percent = 0;
        this.loading = loading;
        this.complete = complete;
        this.formId = formId;
        this.formName = formName;
        this.percent = percent > 0 ? percent : 0;
    }
    return SyncStatus;
}());

//# sourceMappingURL=sync-status.js.map
// CONCATENATED MODULE: ./src/model/index.ts








//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/services/db/utils.ts
var Utils = (function () {
    function Utils() {
    }
    Utils.makeCreateTableQuery = function (table) {
        var columns = [];
        table.columns.forEach(function (col) {
            columns.push(col.name + ' ' + col.type);
        });
        var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
        return query;
    };
    return Utils;
}());

//# sourceMappingURL=utils.js.map
// CONCATENATED MODULE: ./src/services/db/manager.ts
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ionic_native_sqlite__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);



var manager_Manager = (function () {
    function Manager(platform, migrator, tables) {
        this.platform = platform;
        this.migrator = migrator;
        this.tables = tables;
        this.map = {};
    }
    Manager.prototype.registerDb = function (name, type, master) {
        if (!this.map[type]) {
            this.map[type] = {
                obs: null,
                db: null,
                dbName: name,
                master: master
            };
        }
        else if (!this.map[type].dbName) {
            this.map[type].dbName = name;
        }
    };
    Manager.prototype.db = function (type) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            if (_this.map[type] && _this.map[type].db) {
                setTimeout(function () {
                    obs.next(_this.map[type].db);
                    obs.complete();
                });
                return;
            }
            if (_this.map[type] && _this.map[type].obs) {
                _this.doSubscribe(type, _this.map[type].obs, obs);
            }
            else if (_this.map[type]) {
                _this.map[type].obs = _this.initializeDb(_this.platform, type).share();
                _this.doSubscribe(type, _this.map[type].obs, obs);
            }
            else {
                obs.error("Unregistered Db: " + type);
            }
        });
    };
    Manager.prototype.doSubscribe = function (type, o, obs) {
        var _this = this;
        o.subscribe(function (db) {
            if (!obs.closed) {
                _this.map[type].db = db;
                obs.next(_this.map[type].db);
                obs.complete();
                obs.closed = true;
            }
            else {
                obs.next(_this.map[type].db);
            }
        });
    };
    Manager.prototype.isDbInited = function (type) {
        return this.map[type] && this.map[type].obs != null;
    };
    Manager.prototype.initializeDb = function (platform, type) {
        var _this = this;
        console.log("Initialize " + type);
        return new __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            var db = null;
            if (platform.is("cordova")) {
                db = new __WEBPACK_IMPORTED_MODULE_0__ionic_native_sqlite__["a" /* SQLite */]();
            }
            else {
                db = new LocalSql();
            }
            console.log("OPen db " + _this.map[type].dbName);
            var settings = {
                name: _this.map[type].dbName,
                location: 'default',
            };
            settings["version"] = _this.map[type].master ? '1.0' : '';
            db.create(settings).then(function (theDb) {
                _this.setup(theDb, type).subscribe(function () {
                    setTimeout(function () {
                        obs.next(theDb);
                        obs.complete();
                    }, 50);
                }, function (err) {
                    console.error('Unable to setup: ', err);
                    obs.error(err);
                });
            }, function (err) {
                console.error('Unable to open database: ', err);
                obs.error(err);
            });
        });
    };
    Manager.prototype.setup = function (db, type) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            var index = 0;
            var handler = function (data) {
                if (index >= _this.tables.length) {
                    _this.migrator.runMigrations(db, type).subscribe(function () {
                        obs.next({});
                        obs.complete();
                    }, function (err) {
                        obs.error(err);
                    });
                    return;
                }
                while (_this.tables[index].master != _this.map[type].master) {
                    index++;
                    if (index >= _this.tables.length) {
                        _this.migrator.runMigrations(db, type).subscribe(function () {
                            obs.next({});
                            obs.complete();
                        }, function (err) {
                            obs.error(err);
                        });
                        return;
                    }
                }
                var query = Utils.makeCreateTableQuery(_this.tables[index]);
                index++;
                db.executeSql(query, {}).then(handler, function (err) {
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
    };
    return Manager;
}());

var LocalSql = (function () {
    function LocalSql() {
    }
    LocalSql.prototype.echoTest = function () {
        return null;
    };
    LocalSql.prototype.deleteDatabase = function (config) {
        return null;
    };
    LocalSql.prototype.create = function (opts) {
        var _this = this;
        var name = opts.name;
        var description = opts.name;
        var size = 2 * 1024 * 1024;
        var version = opts.version;
        return new Promise(function (resolve, reject) {
            try {
                _this.db = window["openDatabase"](name, version, description, size, function (db) {
                    resolve(_this);
                });
            }
            catch (e) {
                console.log(e);
            }
            setTimeout(function () {
                resolve(_this);
            }, 1);
        });
    };
    LocalSql.prototype.executeSql = function (query, args) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.transaction(function (t) {
                var params = args || {};
                if (Object.keys(params).length == 0) {
                    params = [];
                }
                t.executeSql(query, params, function (t, r) {
                    resolve(r);
                }, function (tx, err) {
                    console.log(err);
                    reject(err);
                });
            });
        });
    };
    ;
    return LocalSql;
}());
//# sourceMappingURL=manager.js.map
// CONCATENATED MODULE: ./src/services/db/migrator.ts
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__);


var migrator_Migrator = (function () {
    function Migrator() {
    }
    Migrator.prototype.setMigrations = function (migrations) {
        this.migrations = migrations;
    };
    Migrator.prototype.runMigrations = function (db, type) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__["Observable"](function (responseObserver) {
            _this.migrateForType(db, type).subscribe(function () {
                responseObserver.next({});
                responseObserver.complete();
            }, function (err) {
                responseObserver.error(err);
            });
        });
    };
    Migrator.prototype.migrateForType = function (db, type) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__["Observable"](function (responseObserver) {
            _this.getDbMigrationVersion(db, type).subscribe(function (version) {
                var promise = Promise.resolve();
                var hasMigrations = false;
                Object.keys(_this.migrations[type]).forEach(function (key) {
                    var k = parseInt(key);
                    if (k > version) {
                        promise = promise.then(function () { return _this.executeMigration(db, type, _this.migrations[type][key]); });
                        hasMigrations = true;
                    }
                });
                /*if(!hasMigrations){
                    responseObserver.next({});
                    responseObserver.complete();
                    return;
                }*/
                promise.then(function () {
                    responseObserver.next({});
                    responseObserver.complete();
                });
            });
        });
    };
    Migrator.prototype.executeMigration = function (db, type, migration) {
        return new Promise(function (resolve, reject) {
            var toExecute = [];
            migration.tables && migration.tables.forEach(function (table) {
                toExecute.push(Utils.makeCreateTableQuery(table));
            });
            toExecute = toExecute.concat(migration.queries);
            if (toExecute.length == 0) {
                resolve({});
                return;
            }
            var index = 0;
            var handler = function () {
                console.log("Exec " + toExecute[index]);
                db.executeSql(toExecute[index], {}).then(function (result) {
                    index++;
                    if (index < toExecute.length) {
                        handler();
                    }
                    else {
                        console.log("Done");
                        resolve({});
                    }
                });
            };
            handler();
        });
    };
    Migrator.prototype.getDbMigrationVersion = function (db, type) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__["Observable"](function (responseObserver) {
            db.executeSql(_this.migrations.queries.getVersion, {})
                .then(function (data) {
                var entry = data.rows.item(0);
                var v = entry.version;
                responseObserver.next(v);
                responseObserver.complete();
            }).catch(function (err) {
                responseObserver.next(-1);
                responseObserver.complete();
            });
        });
    };
    return Migrator;
}());

//# sourceMappingURL=migrator.js.map
// CONCATENATED MODULE: ./src/services/db/metadata.ts
var Table = (function () {
    function Table() {
    }
    return Table;
}());

var Column = (function () {
    function Column() {
    }
    return Column;
}());

//# sourceMappingURL=metadata.js.map
// CONCATENATED MODULE: ./src/services/db/index.ts




//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/services/db-client.ts
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MASTER = "master";
var WORK = "work";
var db_client_DBClient = (function () {
    /**
     *
     */
    function DBClient(platform) {
        this.platform = platform;
        this.saveAllEnabled = false;
        this.saveAllPageSize = 50;
        this.saveAllData = [];
        this.tables = [
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
                    "selectAll": "SELECT id, formId, listId, name, title, description, success_message, submit_error_message, submit_button_text, created_at, updated_at, elements, isDispatch, dispatchData, prospectData, summary, is_mobile_kiosk_mode, (SELECT count(*) FROM submissions WHERE status >= 1 and submissions.formId=Forms.id and  submissions.isDispatch = (?)) AS totalSub, (SELECT count(*) FROM submissions WHERE status in (2, 3) and submissions.formId=Forms.id and submissions.isDispatch = (?)) AS totalHold, (SELECT count(*) FROM submissions WHERE status = 1 and submissions.formId=Forms.id and submissions.isDispatch = (?)) AS totalSent, archive_date FROM forms where isDispatch = (?)",
                    "update": "INSERT OR REPLACE INTO forms ( id, formId, name, listId, title, description, success_message, submit_error_message, submit_button_text, created_at, updated_at, elements, isDispatch, dispatchData, prospectData, summary, archive_date, is_mobile_kiosk_mode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    "delete": "DELETE from forms where id=?",
                    "deleteIn": "delete FROM forms where formId in (?)"
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
                    "toSend": "SELECT * FROM submissions where status=4",
                    "update": "INSERT OR REPLACE INTO submissions (id, formId, data, sub_date, status, firstName, lastName, email, isDispatch, dispatchId, activityId, hold_request_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                    "delete": "DELETE from submissions where id=?",
                    "deleteIn": "DELETE from submissions where formId in (?)",
                    "updateById": "UPDATE submissions set id=?, status=?, activityId=?, hold_request_id=? where id=?",
                    "updateByHoldId": "UPDATE submissions set id=?, status=?, activityId=?, data=?, firstName=?, lastName=?, email=?, isDispatch=?, dispatchId=? where hold_request_id=?"
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
                    "selectAll": "select * from contacts where formId=?",
                    "select": "select * from contacts where formId=? and prospectId=?",
                    "update": "INSERT OR REPLACE INTO contacts (id, data, formId, membershipId, prospectId, added, searchTerm) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    "delete": "delete from contacts where id=?",
                    "deleteIn": "delete from contacts where formId in (?)"
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
                    "update": "INSERT or REPLACE into org_master (id, name, operator, upload, db, active, token, avatar, logo, custAccName, username, email, title, operatorFirstName, operatorLastName, pushRegistered) VALUES  (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    "delete": "DELETE from org_master where id = ?",
                    'updateRegistration': 'UPDATE org_master set registrationId = ?'
                }
            }
        ];
        this.versions = {
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
                    queries: [
                        "INSERT INTO versions(version, updated_at) values (2, strftime('%Y-%m-%d %H:%M:%S', 'now'))"
                    ]
                },
                3: {
                    queries: [
                        "ALTER TABLE org_master add column pushRegistered integer default 0",
                        "INSERT INTO versions(version, updated_at) values (3, strftime('%Y-%m-%d %H:%M:%S', 'now'))"
                    ]
                },
                4: {
                    queries: [
                        "ALTER TABLE org_master add column registrationId text",
                        "INSERT INTO versions(version, updated_at) values (4, strftime('%Y-%m-%d %H:%M:%S', 'now'))"
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
                        }
                    ],
                    queries: [
                        "ALTER TABLE submissions add column activityId VARCHAR(50)",
                        "INSERT INTO versions(version, updated_at) values (1, strftime('%Y-%m-%d %H:%M:%S', 'now'))"
                    ]
                },
                2: {
                    queries: [
                        "ALTER table forms add column archive_date VARCHAR(50)",
                        "INSERT INTO versions(version, updated_at) values (2, strftime('%Y-%m-%d %H:%M:%S', 'now'))"
                    ]
                },
                3: {
                    queries: [
                        "alter table submissions add column hold_request_id integer",
                        "INSERT INTO versions(version, updated_at) values (3, strftime('%Y-%m-%d %H:%M:%S', 'now'))"
                    ]
                },
                4: {
                    queries: [
                        "alter table forms add column is_mobile_kiosk_mode integer default 0",
                        "INSERT INTO versions(version, updated_at) values (4, strftime('%Y-%m-%d %H:%M:%S', 'now'))"
                    ]
                }
            }
        };
        this.migrator = new migrator_Migrator();
        this.migrator.setMigrations(this.versions);
        this.manager = new manager_Manager(platform, this.migrator, this.tables);
        this.manager.registerDb("tradeshow.db", MASTER, true);
    }
    /**
     *
     */
    DBClient.prototype.setupWorkDb = function (dbName) {
        this.manager.registerDb(dbName + ".db", WORK, false);
    };
    DBClient.prototype.isWorkDbInited = function () {
        return this.manager.isDbInited(WORK);
    };
    /**
     *
     */
    DBClient.prototype.getConfig = function (key) {
        return this.getSingle(WORK, "configuration", [key])
            .map(function (entry) {
            return entry ? entry.value : "";
        });
    };
    /**
     *
     */
    DBClient.prototype.getAllConfig = function () {
        return this.getAll(WORK, "configuration", [])
            .map(function (data) {
            var resp = {};
            data.forEach(function (entry) {
                resp[entry.key] = entry ? entry.value : "";
            });
            return resp;
        });
    };
    /**
     *
     */
    DBClient.prototype.saveConfig = function (key, value) {
        return this.save(WORK, "configuration", [key, value]);
    };
    /**
     *
     */
    DBClient.prototype.deleteConfig = function (key) {
        return this.remove(WORK, "configuration", [key]);
    };
    DBClient.prototype.updateRegistration = function (registrationid) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"](function (responseObserver) {
            _this.manager.db(MASTER).subscribe(function (db) {
                db.executeSql(_this.getQuery('org_master', "updateRegistration"), [registrationid])
                    .then(function (data) {
                    if (data.rowsAffected == 1) {
                        responseObserver.next(true);
                        responseObserver.complete();
                    }
                    else {
                        responseObserver.error("Wrong number of affected rows: " + data.rowsAffected);
                    }
                }, function (err) {
                    responseObserver.error("An error occured: " + err);
                });
            });
        });
    };
    DBClient.prototype.parseForm = function (dbForm) {
        var form = new Form();
        form.id = dbForm.id;
        form.form_id = dbForm.formId;
        form.description = dbForm.description;
        form.title = dbForm.title;
        form.list_id = parseInt(dbForm.listId + "");
        form.name = dbForm.name;
        form.archive_date = dbForm.archive_date;
        form.created_at = dbForm.created_at;
        form.updated_at = dbForm.updated_at;
        form.success_message = dbForm.success_message;
        form.is_mobile_kiosk_mode = dbForm.is_mobile_kiosk_mode == 1;
        form.submit_error_message = dbForm.submit_error_message;
        form.submit_button_text = dbForm.submit_button_text;
        form.elements = typeof dbForm.elements == "string" ? JSON.parse(dbForm.elements) : dbForm.elements;
        if (form.elements && form.elements.length > 0) {
            form.elements.sort(function (e1, e2) {
                if (e1.position < e2.position) {
                    return -1;
                }
                if (e1.position > e2.position) {
                    return 1;
                }
                return 0;
            });
            form.elements.forEach(function (e) {
                if (e.options && e.options.length > 0) {
                    e.options.sort(function (o1, o2) {
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
    };
    DBClient.prototype.getForms = function () {
        var _this = this;
        return this.getAll(WORK, "forms", [false, false, false, false])
            .map(function (data) {
            var forms = [];
            data.forEach(function (dbForm) {
                forms.push(_this.parseForm(dbForm));
            });
            return forms;
        });
    };
    DBClient.prototype.getFormsByIds = function (ids) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"](function (responseObserver) {
            _this.manager.db(WORK).subscribe(function (db) {
                db.executeSql(_this.getQuery("forms", "selectByIds").replace("?", ids.join(",")), [])
                    .then(function (data) {
                    var resp = [];
                    for (var i = 0; i < data.rows.length; i++) {
                        var dbForm = data.rows.item(i);
                        resp.push(_this.parseForm(dbForm));
                    }
                    responseObserver.next(resp);
                    responseObserver.complete();
                }, function (err) {
                    responseObserver.error("An error occured: " + err);
                });
            });
        });
    };
    DBClient.prototype.saveForm = function (form) {
        //id, name, list_id, title, description, success_message, submit_error_message, submit_button_text, created_at, updated_at, elements, isDispatch, dispatchData, prospectData, summary, archive_date
        return this.save(WORK, "forms", [form.id, form.form_id, form.name, form.list_id, form.title, form.description, form.success_message, form.submit_error_message, form.submit_button_text, form.created_at, form.updated_at, JSON.stringify(form.elements), false, null, null, null, form.archive_date, form.is_mobile_kiosk_mode ? 1 : 0]);
    };
    DBClient.prototype.saveForms = function (forms) {
        return this.saveAll(forms, "Form");
    };
    DBClient.prototype.deleteFormsInList = function (list) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"](function (responseObserver) {
            if (!list || list.length == 0) {
                responseObserver.next(true);
                responseObserver.complete();
                return;
            }
            _this.manager.db(WORK).subscribe(function (db) {
                console.log("executing ", _this.getQuery("forms", "deleteIn").replace("?", list.join(",")), []);
                db.executeSql(_this.getQuery("forms", "deleteIn").replace("?", list.join(",")), [])
                    .then(function (data) {
                    console.log("executing ", _this.getQuery("submissions", "deleteIn").replace("?", list.join(",")), []);
                    db.executeSql(_this.getQuery("submissions", "deleteIn").replace("?", list.join(",")), [])
                        .then(function (data) {
                        console.log("executing ", _this.getQuery("contacts", "deleteIn").replace("?", list.join(",")), []);
                        db.executeSql(_this.getQuery("contacts", "deleteIn").replace("?", list.join(",")), [])
                            .then(function (data) {
                            responseObserver.next(true);
                            responseObserver.complete();
                        }, function (err) {
                            responseObserver.error("An error occured: " + err);
                        });
                    }, function (err) {
                        responseObserver.error("An error occured: " + err);
                    });
                }, function (err) {
                    responseObserver.error("An error occured: " + err);
                });
            });
        });
    };
    /**
     *
     */
    DBClient.prototype.getRegistration = function () {
        var _this = this;
        return this.getSingle(MASTER, "org_master", null)
            .map(function (data) {
            if (data) {
                var user = new User();
                user.access_token = data.token;
                user.customer_account_name = data.custAccName;
                user.user_profile_picture = data.avatar;
                user.customer_logo = data.logo;
                user.user_name = data.username;
                user.customer_name = data.name;
                user.db = data.db;
                user.email = data.email;
                user.first_name = data.operatorFirstName;
                user.id = data.id;
                user.is_active = data.active;
                user.last_name = data.operatorLastName;
                user.title = data.title;
                user.pushRegistered = data.pushRegistered;
                user.device_token = data.registrationId;
                _this.registration = user;
                return user;
            }
            return null;
        });
    };
    DBClient.prototype.getDispatches = function () {
        var _this = this;
        return this.getAll(WORK, "forms", [true, true, true, true])
            .map(function (data) {
            var forms = [];
            data.forEach(function (dbForm) {
                var form = new DispatchOrder();
                form.form_id = dbForm.id;
                form.description = dbForm.description;
                form.name = dbForm.name;
                form.total_submissions = dbForm.totalSub;
                form.total_hold = dbForm.totalHold;
                var dispatch = JSON.parse(dbForm.dispatchData);
                form.device_id = dispatch.device_id;
                form.prospect_id = dispatch.prospect_id;
                form.fields_values = dispatch.fields_values;
                form.status = dispatch.status;
                form.form = _this.parseForm(dispatch.form);
                forms.push(form);
            });
            return forms;
        });
    };
    DBClient.prototype.saveDispatchOrder = function (order) {
        //console.log("saving");
        //id, name, title, description, success_message, submit_error_message, submit_button_text, created_at, updated_at, elements, isDispatch, dispatchData, prospectData, summary
        return this.save(WORK, "forms", [order.id, order.form_id, order.name, order.form.title, order.description || order.form.description, order.form.success_message, order.form.submit_error_message, order.form.submit_button_text, order.date_created, order.date_last_modified, JSON.stringify(order.form.elements), true, JSON.stringify(order), null, null]);
    };
    DBClient.prototype.saveDispatches = function (forms) {
        return this.saveAll(forms, "DispatchOrder");
    };
    DBClient.prototype.getMemberships = function (form_id) {
        return this.getAll(WORK, "contacts", [form_id])
            .map(function (data) {
            var forms = [];
            data.forEach(function (dbForm) {
                var form = new DeviceFormMembership();
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
    };
    DBClient.prototype.getMembership = function (form_id, prospect_id) {
        return this.getSingle(WORK, "contacts", [form_id, prospect_id])
            .map(function (dbForm) {
            if (dbForm) {
                var form = new DeviceFormMembership();
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
    };
    DBClient.prototype.saveMembership = function (form) {
        return this.save(WORK, "contacts", [form.membership_id, JSON.stringify(form.fields), form.form_id, form.membership_id, form.prospect_id, form.added_date, ""]);
    };
    DBClient.prototype.saveMemberships = function (forms) {
        return this.saveAll(forms, "Membership");
    };
    DBClient.prototype.getSubmissions = function (formId, isDispatch) {
        return this.getAll(WORK, "submissions", [formId, isDispatch])
            .map(function (data) {
            var forms = [];
            data.forEach(function (dbForm) {
                var form = new form_submission_FormSubmission();
                form.id = dbForm.id;
                form.form_id = dbForm.formId;
                form.fields = JSON.parse(dbForm.data);
                form.status = dbForm.status;
                form.first_name = dbForm.firstName;
                form.last_name = dbForm.lastName;
                form.email = dbForm.email;
                form.activity_id - dbForm.activityId;
                forms.push(form);
            });
            return forms;
        });
    };
    DBClient.prototype.getSubmissionsToSend = function () {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"](function (responseObserver) {
            _this.manager.db(WORK).subscribe(function (db) {
                db.executeSql(_this.getQuery("submissions", "toSend"), {})
                    .then(function (data) {
                    var resp = [];
                    for (var i = 0; i < data.rows.length; i++) {
                        var dbForm = data.rows.item(i);
                        var form = new form_submission_FormSubmission();
                        form.id = dbForm.id;
                        form.form_id = dbForm.formId;
                        form.fields = JSON.parse(dbForm.data);
                        form.status = dbForm.status;
                        form.first_name = dbForm.firstName;
                        form.last_name = dbForm.lastName;
                        form.email = dbForm.email;
                        form.activity_id - dbForm.activityId;
                        resp.push(form);
                    }
                    responseObserver.next(resp);
                    responseObserver.complete();
                }, function (err) {
                    responseObserver.error("An error occured: " + err);
                });
            });
        });
    };
    DBClient.prototype.saveSubmission = function (form) {
        var _this = this;
        if (form.hold_request_id > 0) {
            //UPDATE submissions set id=?, activityId=?, data=?, sub_date=?, firstName=?, lastName=?, email=?, isDispatch=?, dispatchId=? where hold_request_id=?
            return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"](function (obs) {
                _this.manager.db(MASTER).subscribe(function (db) {
                    db.executeSql(_this.getQuery('submissions', "selectByHoldId"), [form.hold_request_id]).then(function (data) {
                        if (data.rows.length >= 1) {
                            db.executeSql(_this.getQuery('submissions', "updateByHoldId"), [form.id, form.activity_id, JSON.stringify(form.fields), form.first_name, form.last_name, form.email, false, null, form.hold_request_id])
                                .then(function (data) {
                                if (data.rowsAffected == 1) {
                                    obs.next(true);
                                    obs.complete();
                                }
                                else {
                                    obs.error("Wrong number of affected rows: " + data.rowsAffected);
                                }
                            }, function (err) {
                                obs.error("An error occured: " + err);
                            });
                        }
                        else {
                            _this.save(WORK, "submissions", [form.id, form.form_id, JSON.stringify(form.fields), new Date().toISOString(), form.status, form.first_name, form.last_name, form.email, false, null, form.activity_id, form.hold_request_id]).subscribe(function (d) {
                                obs.next(true);
                                obs.complete();
                            }, function (err) {
                                obs.error(err);
                            });
                        }
                    }, function (err) {
                        obs.error("An error occured: " + err);
                    });
                });
            });
        }
        //id, formId, data, sub_date, status, isDispatch, dispatchId
        return this.save(WORK, "submissions", [form.id, form.form_id, JSON.stringify(form.fields), new Date().toISOString(), form.status, form.first_name, form.last_name, form.email, false, null, form.activity_id, form.hold_request_id]);
    };
    DBClient.prototype.updateSubmissionId = function (form) {
        //id, formId, data, sub_date, status, isDispatch, dispatchId
        return this.updateById(WORK, "submissions", [form.activity_id, form.status, form.activity_id, form.hold_request_id, form.id]);
    };
    DBClient.prototype.saveSubmisisons = function (forms, pageSize) {
        if (pageSize === void 0) { pageSize = 1; }
        return this.saveAll(forms, "Submission");
    };
    /**
     *
     */
    DBClient.prototype.saveRegistration = function (user) {
        var _this = this;
        user.db = user.customer_name.replace(/\s*/g, '');
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
            user.pushRegistered
        ]).map(function (data) {
            _this.registration = user;
            return data;
        });
    };
    DBClient.prototype.deleteRegistration = function (authId) {
        var _this = this;
        return this.remove(MASTER, "org_master", [authId])
            .map(function (data) {
            _this.registration = null;
            return data;
        });
    };
    DBClient.prototype.remove = function (type, table, parameters, key) {
        var _this = this;
        if (key === void 0) { key = "delete"; }
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"](function (responseObserver) {
            _this.manager.db(type).subscribe(function (db) {
                db.executeSql(_this.getQuery(table, key), parameters)
                    .then(function (data) {
                    if (data.rowsAffected == 1) {
                        responseObserver.next(true);
                        responseObserver.complete();
                    }
                    else {
                        responseObserver.error("Wrong number of affected rows: " + data.rowsAffected);
                    }
                }, function (err) {
                    responseObserver.error("An error occured: " + err);
                });
            });
        });
    };
    DBClient.prototype.saveAll = function (items, type, pageSize) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"](function (obs) {
            if (!items || items.length == 0) {
                setTimeout(function () {
                    obs.next(true);
                    obs.complete();
                });
                return;
            }
            _this.saveAllEnabled = true;
            var index = 0;
            //console.log(new Date().getTime());
            var name = "save" + type;
            var exec = function (done) {
                var query = _this.saveAllData[0].query;
                var params = [].concat(_this.saveAllData[0].parameters);
                for (var i = 1; i < _this.saveAllData.length; i++) {
                    query += ", " + _this.saveAllData[0].query.split("VALUES")[1];
                    params.push.apply(params, _this.saveAllData[i].parameters);
                }
                var isDone = done;
                _this.manager.db(_this.saveAllData[0].type).subscribe(function (db) {
                    db.executeSql(query, params)
                        .then(function (data) {
                        _this.saveAllData = [];
                        if (data.rowsAffected > 0) {
                            if (isDone) {
                                _this.saveAllEnabled = false;
                                obs.next(true);
                                obs.complete();
                                //console.log(new Date().getTime());
                            }
                            else {
                                handler(true);
                            }
                        }
                        else {
                            _this.saveAllEnabled = false;
                            obs.error("Wrong number of affected rows: " + data.rowsAffected);
                        }
                    }, function (err) {
                        _this.saveAllEnabled = false;
                        _this.saveAllData = [];
                        obs.error(err);
                    });
                });
            };
            var page = pageSize > 0 ? pageSize : _this.saveAllPageSize;
            var handler = function (resp, stopExec) {
                index++;
                if (index % page == 0 || index == items.length) {
                    exec(index == items.length);
                }
                else if (index < items.length) {
                    _this[name](items[index]).subscribe(handler);
                }
            };
            _this[name](items[0]).subscribe(handler);
        });
    };
    DBClient.prototype.save = function (type, table, parameters) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"](function (responseObserver) {
            if (_this.saveAllEnabled) {
                _this.saveAllData.push({ query: _this.getQuery(table, "update"), type: type, parameters: parameters });
                setTimeout(function () {
                    responseObserver.next(true);
                    responseObserver.complete();
                });
                return;
            }
            _this.manager.db(type).subscribe(function (db) {
                db.executeSql(_this.getQuery(table, "update"), parameters)
                    .then(function (data) {
                    if (data.rowsAffected == 1) {
                        responseObserver.next(true);
                        responseObserver.complete();
                    }
                    else {
                        responseObserver.error("Wrong number of affected rows: " + data.rowsAffected);
                    }
                }, function (err) {
                    responseObserver.error("An error occured: " + err);
                });
            });
        });
    };
    DBClient.prototype.updateById = function (type, table, parameters) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"](function (responseObserver) {
            _this.manager.db(type).subscribe(function (db) {
                db.executeSql(_this.getQuery(table, "updateById"), parameters)
                    .then(function (data) {
                    if (data.rowsAffected == 1) {
                        responseObserver.next(true);
                        responseObserver.complete();
                    }
                    else {
                        responseObserver.error("Wrong number of affected rows: " + data.rowsAffected);
                    }
                }, function (err) {
                    responseObserver.error("An error occured: " + err);
                });
            });
        });
    };
    DBClient.prototype.getSingle = function (type, table, parameters) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"](function (responseObserver) {
            _this.manager.db(type).subscribe(function (db) {
                db.executeSql(_this.getQuery(table, "select"), parameters)
                    .then(function (data) {
                    if (data.rows.length == 1) {
                        responseObserver.next(data.rows.item(0));
                        responseObserver.complete();
                    }
                    else if (data.rows.length == 0) {
                        responseObserver.next(null);
                        responseObserver.complete();
                    }
                    else {
                        responseObserver.error("More than one entry found");
                    }
                }, function (err) {
                    responseObserver.error("An error occured: " + err);
                });
            });
        });
    };
    DBClient.prototype.getMultiple = function (type, table, parameters) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"](function (responseObserver) {
            _this.manager.db(type).subscribe(function (db) {
                db.executeSql(_this.getQuery(table, "select"), parameters)
                    .then(function (data) {
                    var resp = [];
                    for (var i = 0; i < data.rows.length; i++) {
                        resp.push(data.rows.item(i));
                    }
                    responseObserver.next(resp);
                    responseObserver.complete();
                }, function (err) {
                    responseObserver.error("An error occured: " + err);
                });
            });
        });
    };
    DBClient.prototype.getAll = function (type, table, params) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"](function (responseObserver) {
            _this.manager.db(type).subscribe(function (db) {
                db.executeSql(_this.getQuery(table, "selectAll"), params)
                    .then(function (data) {
                    var resp = [];
                    for (var i = 0; i < data.rows.length; i++) {
                        resp.push(data.rows.item(i));
                    }
                    responseObserver.next(resp);
                    responseObserver.complete();
                }, function (err) {
                    responseObserver.error("An error occured: " + err);
                });
            });
        });
    };
    DBClient.prototype.getQuery = function (table, type) {
        for (var i = 0; i < this.tables.length; i++) {
            if (this.tables[i].name == table) {
                return this.tables[i].queries[type];
            }
        }
        return "";
    };
    DBClient = __decorate([
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"](),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* Platform */]])
    ], DBClient);
    return DBClient;
}());

//# sourceMappingURL=db-client.js.map
// CONCATENATED MODULE: ./src/config/index.ts
var Config = {
    serverUrl: "",
    androidGcmId: ""
};
//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/services/rest-client.ts
/* harmony import */ var rest_client___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_device__ = __webpack_require__(99);
var rest_client___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var rest_client___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var rest_client_RESTClient = (function () {
    function RESTClient(http) {
        this.http = http;
        this.online = true;
        this.errorSource = new __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["BehaviorSubject"](null);
        this.error = this.errorSource.asObservable();
        this.device = new __WEBPACK_IMPORTED_MODULE_5__ionic_native_device__["a" /* Device */]();
    }
    RESTClient.prototype.setOnline = function (val) {
        this.online = val;
    };
    /**
     *
     * @returns Observable
     */
    RESTClient.prototype.authenticate = function (req) {
        var _this = this;
        req.device_platform = this.device.platform;
        req.device_model = this.device.model;
        req.device_manufacture = this.device.manufacturer;
        req.device_os_version = this.device.version;
        req.device_uuid = this.device.uuid;
        return this.call("POST", "/authenticate.json", req)
            .map(function (resp) {
            if (resp.status != "200") {
                _this.errorSource.next(resp);
            }
            _this.token = resp.data.access_token;
            return resp.data;
        });
    };
    /**
     *
     * @returns Observable
     */
    RESTClient.prototype.getForms = function (offset, name, updatedAt, createdAt) {
        var _this = this;
        if (offset === void 0) { offset = 0; }
        var opts = {
            form_type: "device"
        };
        if (name) {
            opts.name = name;
        }
        if (updatedAt) {
            opts.updated_at = updatedAt.toISOString().split(".")[0] + "+00:00";
        }
        if (createdAt) {
            opts.created_at = createdAt.toISOString().split(".")[0] + "+00:00";
        }
        if (offset > 0) {
            opts.offset = offset;
        }
        return this.call("GET", "/forms.json", opts).map(function (resp) {
            if (resp.status != "200") {
                _this.errorSource.next(resp);
            }
            var result = [];
            resp.records.forEach(function (record) {
                var f = new Form();
                Object.keys(record).forEach(function (key) {
                    f[key] = record[key];
                });
                f.computeIdentifiers();
                result.push(f);
            });
            resp.records = result;
            return resp;
        });
    };
    RESTClient.prototype.getAllForms = function (lastSyncDate) {
        var opts = {
            form_type: "device"
        };
        if (lastSyncDate) {
            opts.updated_at = lastSyncDate.toISOString().split(".")[0] + "+00:00";
        }
        return this.getAll("/forms.json", opts).map(function (resp) {
            var result = [];
            resp.forEach(function (record) {
                var f = new Form();
                Object.keys(record).forEach(function (key) {
                    f[key] = record[key];
                });
                result.push(f);
                f.computeIdentifiers();
            });
            return result;
        });
    };
    /**
     *
     * @returns Observable
     */
    RESTClient.prototype.getDispatches = function (offset, lastSync) {
        var _this = this;
        if (offset === void 0) { offset = 0; }
        var opts = {};
        if (lastSync) {
            opts.updated_at = lastSync.toISOString().split(".")[0] + "+00:00";
            ;
        }
        if (offset > 0) {
            opts.offset = offset;
        }
        return this.call("GET", "/dispatches.json", opts)
            .map(function (resp) {
            if (resp.status != "200") {
                _this.errorSource.next(resp);
            }
            return resp;
        });
    };
    RESTClient.prototype.getAllDispatches = function (lastSyncDate) {
        var opts = {};
        if (lastSyncDate) {
            opts.updated_at = lastSyncDate.toISOString().split(".")[0] + "+00:00";
            ;
        }
        return this.getAll("/dispatches.json", opts)
            .map(function (resp) {
            resp.forEach(function (dispatch) {
                dispatch.orders.forEach(function (order) {
                    var form = null;
                    dispatch.forms.forEach(function (f) {
                        if (f.form_id == order.form_id) {
                            order.form = f;
                        }
                    });
                    order.form = form;
                });
            });
            return resp;
        });
    };
    RESTClient.prototype.getSubmissions = function (form, lastSyncDate) {
        var opts = {
            form_id: form.id,
            form_type: "device"
        };
        if (lastSyncDate) {
            opts.date_from = lastSyncDate.toISOString().split(".")[0] + "+00:00";
            ;
        }
        var f = form;
        return this.getAll("/forms/submissions.json", opts)
            .map(function (resp) {
            var data = [];
            resp.forEach(function (item) {
                var entry = new form_submission_FormSubmission();
                entry.id = item.activity_id;
                entry.activity_id = item.activity_id;
                entry.status = SubmissionStatus.Submitted;
                entry.prospect_id = parseInt(item.prospect_id + "");
                entry.hold_request_id = item.hold_request_id;
                entry.email = item.email;
                entry.form_id = parseInt(form.id);
                item.data.forEach(function (dataItem) {
                    if (!dataItem.value) {
                        return;
                    }
                    var fieldName = "element_" + dataItem.element_id;
                    var field = form.getFieldById(dataItem.element_id);
                    switch (field.type) {
                        case "simple_name":
                        case "address":
                            var vals = dataItem.value.split(" ");
                            if (field.type == "address") {
                                if (vals.length > 6) {
                                    var tmp_1 = [];
                                    vals.forEach(function (val, index) {
                                        if (index <= 6) {
                                            tmp_1.push(val);
                                        }
                                        else {
                                            tmp_1[tmp_1.length - 1] += " " + val;
                                        }
                                    });
                                    vals = tmp_1;
                                }
                            }
                            vals.forEach(function (value, index) {
                                entry.fields[fieldName + "_" + (index + 1)] = value;
                            });
                            break;
                        case "image":
                        case "business_card":
                            try {
                                entry.fields[fieldName] = JSON.parse(dataItem.value);
                            }
                            catch (e) {
                                console.log("Can't parse " + field.type + " for submission " + entry.activity_id);
                            }
                            break;
                        case "checkbox":
                            entry.fields[fieldName] = dataItem.value.split(";");
                            break;
                        default:
                            entry.fields[fieldName] = dataItem.value;
                    }
                });
                entry.first_name = "";
                entry.last_name = "";
                entry.company = "";
                entry.phone = "";
                entry.updateFields(f);
                data.push(entry);
            });
            return data;
        });
    };
    RESTClient.prototype.getAvailableFormIds = function () {
        return this.getAll("/device/available_forms.json", {})
            .map(function (response) {
            var d = [];
            if (Array.isArray(response)) {
                if (response.length > 0) {
                    if (Number.isInteger(response[0])) {
                        d = response;
                    }
                    else {
                        Object.keys(response[0]).forEach(function (key) {
                            d.push(response[0][key]);
                        });
                    }
                }
            }
            else {
                Object.keys(response).forEach(function (key) {
                    d.push(response[key]);
                });
            }
            return d;
        });
    };
    RESTClient.prototype.getAllSubmissions = function (forms, lastSync, newFormIds) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"](function (obs) {
            var result = [];
            if (!forms || forms.length == 0) {
                setTimeout(function () {
                    obs.next(result);
                    obs.complete();
                });
                return;
            }
            var index = 0;
            var syncDate = newFormIds && newFormIds.length > 0 && newFormIds.indexOf(forms[index].form_id) > -1 ? null : lastSync;
            var handler = function (data) {
                result.push.apply(result, data);
                index++;
                if (index < forms.length) {
                    syncDate = newFormIds && newFormIds.length > 0 && newFormIds.indexOf(forms[index].form_id) > -1 ? null : lastSync;
                    _this.getSubmissions(forms[index], syncDate).subscribe(handler);
                }
                else {
                    obs.next(result);
                    obs.complete();
                }
            };
            _this.getSubmissions(forms[index], syncDate).subscribe(handler);
        });
    };
    /**
     *
     * @returns Observable
     */
    RESTClient.prototype.registerDeviceToPush = function (device_token, receiveNotifications) {
        var _this = this;
        if (receiveNotifications === void 0) { receiveNotifications = true; }
        return this.call("POST", '/devices/register_to_notifications.json', {
            device_token: device_token,
            is_allow_to_receive_notification: receiveNotifications
        })
            .map(function (resp) {
            if (resp.status == "200") {
                return true;
            }
            _this.errorSource.next(resp);
            return false;
        });
    };
    RESTClient.prototype.unauthenticate = function (token) {
        var _this = this;
        return this.call("POST", '/devices/unauthorize.json', {})
            .map(function (resp) {
            if (resp.status == "200") {
                return true;
            }
            _this.errorSource.next(resp);
            return false;
        });
    };
    /**
     *
     * @returns Observable
     */
    RESTClient.prototype.getDeviceFormMemberships = function (form_id, lastSync) {
        var _this = this;
        var opts = {
            form_id: form_id
        };
        if (lastSync) {
            opts.last_sync_date = lastSync.toISOString().split(".")[0] + "+00:00";
            ;
        }
        return this.call("GET", "/forms/memberships.json", opts).map(function (resp) {
            if (resp.status != "200") {
                _this.errorSource.next(resp);
            }
            return resp;
        });
    };
    RESTClient.prototype.getAllDeviceFormMemberships = function (forms, lastSync, newFormIds) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"](function (obs) {
            var result = [];
            if (!forms || forms.length == 0) {
                setTimeout(function () {
                    obs.next(result);
                    obs.complete();
                });
                return;
            }
            var index = 0;
            var handler = function (data) {
                data.forEach(function (item) {
                    item.form_id = forms[index].form_id;
                });
                result.push.apply(result, data);
                index++;
                if (index < forms.length) {
                    doTheCall();
                }
                else {
                    obs.next(result);
                    obs.complete();
                }
            };
            var doTheCall = function () {
                var params = {
                    form_id: forms[index].form_id
                };
                var syncDate = newFormIds && newFormIds.length > 0 && newFormIds.indexOf(forms[index].form_id) > -1 ? null : lastSync;
                if (syncDate) {
                    params.last_sync_date = syncDate.toISOString().split(".")[0] + "+00:00";
                }
                _this.getAll("/forms/memberships.json", params).subscribe(handler);
            };
            doTheCall();
        });
    };
    /**
     *
     * @returns Observable
     */
    RESTClient.prototype.submitForm = function (data) {
        var _this = this;
        return this.call("POST", "/forms/submit.json", data)
            .map(function (resp) {
            if (resp.status == "200") {
                return {
                    id: resp.activity_id,
                    hold_request_id: resp.hold_request_id,
                    message: ""
                };
            }
            _this.errorSource.next(resp);
            return {
                id: resp.activity_id,
                message: resp.message,
                hold_request_id: null
            };
        });
    };
    RESTClient.prototype.submitForms = function (data) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"](function (obs) {
            var index = 0;
            var result = [];
            if (!data || data.length == 0) {
                obs.next(null);
                obs.complete();
                return;
            }
            var handler = function (reply) {
                if (reply.id > 0) {
                    result.push(data[index]);
                }
                index++;
                if (index >= data.length) {
                    obs.next(result);
                    obs.complete();
                    return;
                }
                setTimeout(function () {
                    _this.submitForm(data[index]).subscribe(handler, handler);
                }, 150);
            };
            _this.submitForm(data[index]).subscribe(handler, handler);
        });
    };
    RESTClient.prototype.uploadFiles = function (req) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"](function (obs) {
            _this.call("POST", "/drive/upload.json", req)
                .subscribe(function (data) {
                if (data.status == "200") {
                    obs.next(data.files);
                    obs.complete();
                }
                if (data == null) {
                    obs.error(data.message);
                }
            }, function (err) {
                obs.error(err);
            });
        });
    };
    RESTClient.prototype.getAll = function (relativeUrl, content) {
        var _this = this;
        var response = new __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"](function (obs) {
            var offset = 0;
            var result = [];
            var handler = function (data) {
                var records = [];
                if (!data.records) {
                }
                else if (Array.isArray(data.records)) {
                    records = data.records;
                }
                else {
                    records = [data.records];
                }
                result.push.apply(result, records);
                if (data.count + offset < data.total_count) {
                    offset += data.count;
                    doTheCall();
                }
                else {
                    obs.next(result);
                    obs.complete();
                }
            };
            var doTheCall = function () {
                var params = Object.assign({}, content);
                if (offset > 0) {
                    params.offset = offset;
                }
                _this.call("GET", relativeUrl, params).subscribe(handler);
            };
            doTheCall();
        });
        return response;
    };
    RESTClient.prototype.call = function (method, relativeUrl, content) {
        var _this = this;
        var response = new __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"](function (responseObserver) {
            var sub = null;
            var url = Config.serverUrl + relativeUrl;
            var params = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["f" /* URLSearchParams */]();
            params.set("access_token", _this.token);
            var opts = {
                headers: _this.getHeaders(),
                search: params
            };
            var search = "?access_token=" + encodeURIComponent(_this.token);
            for (var field in content) {
                search += "&" + encodeURIComponent(field) + "=" + encodeURIComponent(content[field]);
            }
            switch (method) {
                case "GET":
                    for (var field in content) {
                        opts.search.set(field, content[field]);
                    }
                    delete opts.search;
                    sub = _this.http.get(url + search, opts);
                    break;
                case "POST":
                    sub = _this.http.post(url, JSON.stringify(content), opts);
                    break;
                case "DELETE":
                    for (var field in content) {
                        opts.search.set(field, content[field]);
                    }
                    delete opts.search;
                    sub = _this.http.delete(url + search, opts);
                    break;
                case "PATCH":
                    sub = _this.http.patch(url, content, opts);
                    break;
            }
            sub
                .map(function (response) {
                if (response._body) {
                    try {
                        return response.json();
                    }
                    catch (e) { }
                }
                return null;
            })
                .subscribe(function (response) {
                responseObserver.next(response);
                responseObserver.complete();
            }, function (err) {
                _this.errorSource.next(err);
                responseObserver.error(err);
            });
        });
        return response;
    };
    RESTClient.prototype.getHeaders = function () {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]();
        headers.append('Content-Type', 'application/json');
        return headers;
    };
    RESTClient = rest_client___decorate([
        rest_client___WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"](),
        rest_client___metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]])
    ], RESTClient);
    return RESTClient;
}());

//# sourceMappingURL=rest-client.js.map
// CONCATENATED MODULE: ./src/services/sync-client.ts
/* harmony import */ var sync_client___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(15);
/* harmony import */ var sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_transfer__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_file__ = __webpack_require__(27);
var sync_client___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var sync_client___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var sync_client_SyncClient = (function () {
    function SyncClient(rest, db, file, transfer) {
        this.rest = rest;
        this.db = db;
        this.file = file;
        this.transfer = transfer;
        this._isSyncing = false;
        this.dataUrlRegexp = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
        this.errorSource = new sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["BehaviorSubject"](null);
        this.error = this.errorSource.asObservable();
        this.syncSource = new sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["BehaviorSubject"](null);
        this.onSync = this.syncSource.asObservable();
        this.entitySyncedSource = new sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["BehaviorSubject"](null);
        this.entitySynced = this.entitySyncedSource.asObservable();
    }
    SyncClient.prototype.isSyncing = function () {
        return this._isSyncing;
    };
    SyncClient.prototype.getLastSync = function () {
        return this.lastSyncStatus;
    };
    SyncClient.prototype.download = function (lastSyncDate) {
        var _this = this;
        return new sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            var result = new DownloadData();
            var map = {
                forms: new SyncStatus(true, false, 0, "Forms", 10),
                contacts: new SyncStatus(false, false, 0, "Contacts", 0),
                dispatches: new SyncStatus(false, false, 0, "Dispatches", 0),
                submissions: new SyncStatus(false, false, 0, "Submissions", 0)
            };
            _this._isSyncing = true;
            _this.lastSyncStatus = [
                map["forms"],
                map["contacts"],
                map["dispatches"],
                map["submissions"]
            ];
            _this.syncSource.next(_this.lastSyncStatus);
            _this.downloadForms(lastSyncDate, map, result).subscribe(function (forms) {
                obs.next(result);
                _this.db.getForms().subscribe(function (forms) {
                    var filteredForms = [];
                    var current = new Date();
                    forms.forEach(function (form) {
                        if (new Date(form.archive_date) > current) {
                            filteredForms.push(form);
                        }
                        else {
                            console.log("Form " + form.name + "(" + form.id + ") is past it's expiration date. Filtering it out");
                        }
                    });
                    _this.downloadSubmissions(filteredForms, lastSyncDate, map, result).subscribe(function () {
                        obs.next(result);
                        _this.downloadDispatches(lastSyncDate, map, result).subscribe(function () {
                            obs.next(result);
                            _this.downloadContacts(filteredForms, lastSyncDate, map, result).subscribe(function () {
                                obs.next(result);
                                obs.complete();
                                _this.syncCleanup();
                            }, function (err) {
                                obs.error(err);
                                _this.syncCleanup();
                            });
                        }, function (err) {
                            obs.error(err);
                            _this.syncCleanup();
                        });
                    }, function (err) {
                        obs.error(err);
                        _this.syncCleanup();
                    });
                });
            }, function (err) {
                obs.error(err);
                _this.syncCleanup();
            });
        });
    };
    SyncClient.prototype.syncCleanup = function () {
        this._isSyncing = false;
        this.syncSource.complete();
        this.syncSource = new sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["BehaviorSubject"](null);
        this.onSync = this.syncSource.asObservable();
    };
    SyncClient.prototype.sync = function (submissions, forms) {
        var _this = this;
        return new sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            _this._isSyncing = true;
            var result = [];
            var map = {};
            _this.lastSyncStatus = [];
            forms.forEach(function (form) {
                map[form.form_id + ""] = {
                    form: form,
                    urlFields: form.getUrlFields(),
                    submissions: [],
                    status: new SyncStatus(false, false, form.form_id, form.name)
                };
                _this.lastSyncStatus.push(map[form.form_id].status);
            });
            submissions.forEach(function (sub) {
                map[sub.form_id + ""].submissions.push(sub);
            });
            var formIds = Object.keys(map);
            var index = 0;
            map[formIds[index]].status.loading = true;
            _this.syncSource.next(_this.lastSyncStatus);
            var onError = function (err) {
                _this._isSyncing = false;
                _this.syncSource.complete();
                _this.syncSource = new sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["BehaviorSubject"](null);
                _this.onSync = _this.syncSource.asObservable();
                obs.error(err);
                _this.errorSource.next(err);
            };
            var handler = function (submitted) {
                result.push.apply(result, submitted);
                map[formIds[index]].status.complete = true;
                map[formIds[index]].status.loading = false;
                _this.syncSource.next(_this.lastSyncStatus);
                index++;
                if (index >= formIds.length) {
                    _this._isSyncing = false;
                    obs.next(result);
                    obs.complete();
                    _this.syncSource.complete();
                    _this.syncSource = new sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["BehaviorSubject"](null);
                    _this.onSync = _this.syncSource.asObservable();
                    return;
                }
                setTimeout(function () {
                    _this.doSubmitAll(map[formIds[index]]).subscribe(handler, onError);
                }, 500);
            };
            _this.doSubmitAll(map[formIds[index]]).subscribe(handler, onError);
        });
    };
    SyncClient.prototype.doSubmitAll = function (data) {
        var _this = this;
        return new sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            var result = [];
            var index = 0;
            var handler = function () {
                if (index == data.submissions.length) {
                    obs.next(result);
                    obs.complete();
                    return;
                }
                _this.doSubmit(data, index).subscribe(function (submission) {
                    setTimeout(function () {
                        result.push(submission);
                        index++;
                        handler();
                    });
                }, function (err) {
                    index++;
                    handler();
                });
            };
            handler();
        });
    };
    SyncClient.prototype.buildUrlMap = function (submission, urlFields, urlMap) {
        var hasUrls = false;
        var _loop_1 = function () {
            if (urlFields.indexOf(field) > -1) {
                var sub_1 = submission.fields[field];
                if (sub_1) {
                    val = [];
                    if (typeof (sub_1) == "object") {
                        Object.keys(sub_1).forEach(function (key) {
                            val.push(sub_1[key]);
                        });
                    }
                    else {
                        val = val.concat(sub_1);
                    }
                    val.forEach(function (url) {
                        if (url) {
                            urlMap[url] = "";
                            hasUrls = true;
                        }
                    });
                }
            }
        };
        var val;
        for (var field in submission.fields) {
            _loop_1();
        }
        return hasUrls;
    };
    SyncClient.prototype.doSubmit = function (data, index) {
        var _this = this;
        return new sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            var submission = data.submissions[index];
            var urlMap = {};
            var hasUrls = _this.buildUrlMap(submission, data.urlFields, urlMap);
            _this.uploadImages(urlMap, hasUrls).subscribe(function (d) {
                var _loop_2 = function () {
                    if (data.urlFields.indexOf(field) > -1) {
                        var sub_2 = submission.fields[field];
                        if (sub_2) {
                            if (typeof (sub_2) == "object") {
                                Object.keys(sub_2).forEach(function (key) {
                                    sub_2[key] = urlMap[sub_2[key]];
                                });
                            }
                            else if (Array.isArray(sub_2)) {
                                for (var i = 0; i < sub_2.length; i++) {
                                    sub_2[i] = urlMap[sub_2[i]];
                                }
                            }
                            else {
                                submission.fields[field] = urlMap[sub_2];
                            }
                        }
                    }
                };
                for (var field in submission.fields) {
                    _loop_2();
                }
                _this.rest.submitForm(submission).subscribe(function (d) {
                    if ((!d.id || d.id < 0) && (!d.hold_request_id || d.hold_request_id < 0)) {
                        var msg = "Could not process submission for form \"" + data.form.name + "\": " + d.message;
                        obs.error(msg);
                        _this.errorSource.next(msg);
                        return;
                    }
                    if (d.id > 0) {
                        submission.activity_id = d.id;
                    }
                    else {
                        submission.activity_id = submission.id;
                        submission.hold_request_id = d.hold_request_id;
                    }
                    submission.status = SubmissionStatus.Submitted;
                    _this.db.updateSubmissionId(submission).subscribe(function (ok) {
                        if (d.id > 0) {
                            submission.id = submission.activity_id;
                        }
                        obs.next(submission);
                        obs.complete();
                    }, function (err) {
                        obs.error(err);
                        var msg = "Could not process submission for form " + data.form.name;
                        _this.errorSource.next(msg);
                    });
                }, function (err) {
                    obs.error(err);
                    var msg = "Could not process submission for form " + data.form.name;
                    _this.errorSource.next(msg);
                });
            }, function (err) {
                obs.error(err);
                var msg = "Could not process submission for form " + data.form.name;
                _this.errorSource.next(msg);
            });
        });
    };
    SyncClient.prototype.uploadImages = function (urlMap, hasUrls) {
        var _this = this;
        return new sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            if (!hasUrls) {
                obs.next(null);
                obs.complete();
                return;
            }
            var index = 0;
            var urls = Object.keys(urlMap);
            var transfer = new __WEBPACK_IMPORTED_MODULE_4__ionic_native_transfer__["a" /* Transfer */]();
            var request = new FileUploadRequest();
            var handler = function () {
                if (index >= urls.length) {
                    _this.rest.uploadFiles(request).subscribe(function (data) {
                        urls.forEach(function (url, index) {
                            urlMap[url] = data[index].url;
                        });
                        obs.next(data);
                        obs.complete();
                    }, function (err) {
                        obs.error(err);
                    });
                }
                else {
                    if (_this.dataUrlRegexp.test(urls[index])) {
                        var data = urls[index];
                        var entry = new FileInfo();
                        var d = data.split(";base64,");
                        entry.mime_type = d[0].substr(5);
                        entry.data = d[1];
                        entry.name = "sig" + new Date().getTime();
                        entry.size = atob(entry.data).length;
                        request.files.push(entry);
                        index++;
                        handler();
                        return;
                    }
                    var folder_1 = urls[index].substr(0, urls[index].lastIndexOf("/"));
                    var file_1 = urls[index].substr(urls[index].lastIndexOf("/") + 1);
                    _this.file.resolveDirectoryUrl(folder_1).then(function (dir) {
                        _this.file.getFile(dir, file_1, { create: false }).then(function (fileEntry) {
                            fileEntry.getMetadata(function (metadata) {
                                //data:[<mediatype>][;base64],<data>
                                _this.file.readAsDataURL(folder_1, file_1).then(function (data) {
                                    var entry = new FileInfo();
                                    var d = data.split(";base64,");
                                    entry.data = d[1];
                                    entry.name = file_1;
                                    entry.size = metadata.size;
                                    entry.mime_type = d[0].substr(5);
                                    request.files.push(entry);
                                    index++;
                                    handler();
                                }).catch(function (err) {
                                    obs.error(err);
                                });
                            }, function (err) {
                                obs.error(err);
                            });
                        }).catch(function (err) {
                            obs.error(err);
                        });
                    }).catch(function (err) {
                        obs.error(err);
                    });
                }
            };
            handler();
        });
    };
    SyncClient.prototype.downloadForms = function (lastSyncDate, map, result) {
        var _this = this;
        return new sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            var mapEntry = map["forms"];
            mapEntry.loading = true;
            mapEntry.percent = 10;
            _this.rest.getAvailableFormIds().subscribe(function (ids) {
                _this.db.getForms().subscribe(function (forms) {
                    var toDelete = [];
                    var newForms = [];
                    forms.forEach(function (form) {
                        if (ids.indexOf(form.form_id) == -1) {
                            toDelete.push(form.form_id);
                        }
                    });
                    ids.forEach(function (id) {
                        var form = forms.find(function (f) {
                            return f.form_id == id;
                        });
                        if (!form) {
                            newForms.push(id);
                        }
                    });
                    result.newFormIds = newForms;
                    _this.db.deleteFormsInList(toDelete).subscribe(function () {
                        _this.rest.getAllForms(lastSyncDate).subscribe(function (forms) {
                            result.forms = forms;
                            forms.forEach(function (form) {
                                form.id = form.form_id + "";
                            });
                            mapEntry.percent = 50;
                            _this.syncSource.next(_this.lastSyncStatus);
                            _this.db.saveForms(forms).subscribe(function (reply) {
                                mapEntry.complete = true;
                                mapEntry.loading = false;
                                mapEntry.percent = 100;
                                _this.entitySyncedSource.next(mapEntry.formName);
                                _this.syncSource.next(_this.lastSyncStatus);
                                obs.next(forms);
                                obs.complete();
                            }, function (err) {
                                obs.error(err);
                            });
                        }, function (err) {
                            obs.error(err);
                        });
                    });
                });
            });
        });
    };
    SyncClient.prototype.downloadContacts = function (forms, lastSyncDate, map, result) {
        var _this = this;
        return new sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            var mapEntry = map["contacts"];
            mapEntry.loading = true;
            mapEntry.percent = 10;
            //obs.next(null);
            //obs.complete();
            _this.rest.getAllDeviceFormMemberships(forms, lastSyncDate, result.newFormIds).subscribe(function (contacts) {
                result.memberships.push.apply(result.memberships, contacts);
                mapEntry.percent = 50;
                _this.syncSource.next(_this.lastSyncStatus);
                _this.db.saveMemberships(contacts).subscribe(function (res) {
                    mapEntry.complete = true;
                    mapEntry.loading = false;
                    mapEntry.percent = 100;
                    _this.entitySyncedSource.next(mapEntry.formName);
                    _this.syncSource.next(_this.lastSyncStatus);
                    obs.next(null);
                    obs.complete();
                }, function (err) {
                    obs.error(err);
                });
            }, function (err) {
                obs.error(err);
            });
        });
    };
    SyncClient.prototype.downloadDispatches = function (lastSyncDate, map, result) {
        var _this = this;
        return new sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            var mapEntry = map["dispatches"];
            mapEntry.loading = true;
            mapEntry.percent = 10;
            _this.rest.getAllDispatches(lastSyncDate).subscribe(function (dispatches) {
                mapEntry.percent = 50;
                _this.syncSource.next(_this.lastSyncStatus);
                result.dispatches = dispatches;
                var orders = [];
                var forms = [];
                _this.syncSource.next(_this.lastSyncStatus);
                dispatches.forEach(function (dispatch) {
                    orders.push.apply(orders, dispatch.orders);
                    dispatch.forms.forEach(function (f) {
                        if (forms.filter(function (form) { return form.form_id == f.form_id; }).length == 0) {
                            forms.push(f);
                        }
                    });
                });
                orders.forEach(function (order) {
                    order.form = forms.filter(function (f) { return f.form_id == order.form_id; })[0];
                    order.id = order.id + "" + order.form_id;
                });
                mapEntry.percent = 100;
                _this.syncSource.next(_this.lastSyncStatus);
                _this.db.saveDispatches(orders).subscribe(function (reply) {
                    mapEntry.complete = true;
                    mapEntry.loading = false;
                    mapEntry.percent = 100;
                    _this.entitySyncedSource.next(mapEntry.formName);
                    _this.syncSource.next(_this.lastSyncStatus);
                    obs.next(null);
                    obs.complete();
                });
            }, function (err) {
                obs.error(err);
            });
        });
    };
    SyncClient.prototype.downloadSubmissions = function (forms, lastSyncDate, map, result) {
        var _this = this;
        return new sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            var mapEntry = map["submissions"];
            mapEntry.loading = true;
            mapEntry.percent = 10;
            _this.rest.getAllSubmissions(forms, lastSyncDate, result.newFormIds).subscribe(function (submissions) {
                mapEntry.percent = 50;
                _this.syncSource.next(_this.lastSyncStatus);
                result.submissions = submissions;
                //let forms: Form[] = [];
                _this.downloadImages(forms, submissions).subscribe(function (subs) {
                    _this.db.saveSubmisisons(subs).subscribe(function (reply) {
                        mapEntry.complete = true;
                        mapEntry.loading = false;
                        mapEntry.percent = 100;
                        _this.entitySyncedSource.next(mapEntry.formName);
                        _this.syncSource.next(_this.lastSyncStatus);
                        obs.next(null);
                        obs.complete();
                    }, function (err) {
                        obs.error(err);
                    });
                }, function (err) {
                    obs.error(err);
                });
            }, function (err) {
                obs.error(err);
            });
        });
    };
    SyncClient.prototype.downloadImages = function (forms, submissions) {
        var _this = this;
        return new sync_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            if (!submissions || submissions.length == 0) {
                obs.next([]);
                obs.complete();
                return;
            }
            var map = forms.reduce(function (previous, current, index, array) {
                previous[current.id] = current;
                return previous;
            }, {});
            var urlMap = {};
            var hasUrls = false;
            submissions.forEach(function (submission) {
                var urlFields = map[submission.form_id].getUrlFields();
                hasUrls = _this.buildUrlMap(submission, urlFields, urlMap) || hasUrls;
            });
            if (!hasUrls) {
                obs.next(submissions);
                obs.complete();
                return;
            }
            var urls = Object.keys(urlMap);
            var index = 0;
            var fileTransfer = _this.transfer.create();
            var handler = function () {
                if (index == urls.length) {
                    submissions.forEach(function (submission) {
                        var urlFields = map[submission.form_id].getUrlFields();
                        var _loop_3 = function () {
                            if (urlFields.indexOf(field) > -1) {
                                var sub_3 = submission.fields[field];
                                if (sub_3) {
                                    if (typeof (sub_3) == "object") {
                                        Object.keys(sub_3).forEach(function (key) {
                                            sub_3[key] = urlMap[sub_3[key]];
                                        });
                                    }
                                    else if (Array.isArray(sub_3)) {
                                        var val = submission.fields[field];
                                        for (var i = 0; i < val.length; i++) {
                                            val[i] = urlMap[val[i]];
                                        }
                                    }
                                    else {
                                        submission.fields[field] = urlMap[sub_3];
                                    }
                                }
                            }
                        };
                        for (var field in submission.fields) {
                            _loop_3();
                        }
                    });
                    obs.next(submissions);
                    obs.complete();
                }
                else {
                    var ext = urls[index].substr(urls[index].lastIndexOf("."));
                    fileTransfer.download(urls[index], cordova.file.dataDirectory + "leadliaison/images/dwn_" + new Date().getTime() + ext)
                        .then(function (value) {
                        //console.log(value);
                        urlMap[urls[index]] = "/" + value.nativeURL.split("///")[1];
                        index++;
                        setTimeout(function () {
                            handler();
                        });
                    })
                        .catch(function (err) {
                        console.error(err);
                        index++;
                        setTimeout(function () {
                            handler();
                        });
                    });
                }
            };
            handler();
        });
    };
    SyncClient.prototype.isExternalUrl = function (url) {
        return url.indexOf("http") == 0;
    };
    SyncClient = sync_client___decorate([
        sync_client___WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"](),
        sync_client___metadata("design:paramtypes", [rest_client_RESTClient, db_client_DBClient, __WEBPACK_IMPORTED_MODULE_5__ionic_native_file__["a" /* File */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_transfer__["a" /* Transfer */]])
    ], SyncClient);
    return SyncClient;
}());

var DownloadData = (function () {
    function DownloadData() {
        this.forms = [];
        this.dispatches = [];
        this.memberships = [];
        this.submissions = [];
        this.newFormIds = [];
    }
    return DownloadData;
}());

var FormMapEntry = (function () {
    function FormMapEntry() {
    }
    return FormMapEntry;
}());
//# sourceMappingURL=sync-client.js.map
// CONCATENATED MODULE: ./src/util/util.ts
/**
 * Jquery clone
 */
var Util = (function () {
    function Util() {
    }
    Util.each = function (obj, callback) {
        var length, i = 0;
        if (Util.isArrayLike(obj)) {
            length = obj.length;
            for (; i < length; i++) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        }
        else {
            for (i in obj) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        }
        return obj;
    };
    Util.proxy = function (fn, context) {
        var args, proxy, tmp;
        if (typeof context === "string") {
            tmp = fn[context];
            context = fn;
            fn = tmp;
        }
        // Quick check to determine if target is callable, in the spec
        // this throws a TypeError, but we will just return undefined.
        if (!Util.isFunction(fn)) {
            return undefined;
        }
        // Simulated bind
        args = Util.slice.call(arguments, 2);
        proxy = function () {
            return fn.apply(context || Util, args.concat(Util.slice.call(arguments)));
        };
        return proxy;
    };
    Util.isFunction = function (obj) {
        return Util.type(obj) === "function";
    };
    Util.isArray = function (obj) {
        return Array.isArray(obj);
    };
    Util.isWindow = function (obj) {
        return obj != null && obj == obj.window;
    };
    Util.isNumeric = function (obj) {
        var realStringObj = obj && obj.toString();
        return !Util.isArray(obj) && (realStringObj - parseFloat(realStringObj) + 1) >= 0;
    };
    Util.isEmptyObject = function (obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    };
    Util.isPlainObject = function (obj) {
        var key;
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if (!obj || Util.type(obj) !== "object" || obj.nodeType || Util.isWindow(obj)) {
            return false;
        }
        try {
            // Not own constructor property must be Object
            if (obj.constructor &&
                !Util.hasOwn.call(obj, "constructor") &&
                !Util.hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        }
        catch (e) {
            // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }
        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.
        for (key in obj) { }
        return key === undefined || Util.hasOwn.call(obj, key);
    };
    Util.type = function (obj) {
        if (obj == null) {
            return obj + "";
        }
        return typeof obj === "object" || typeof obj === "function" ?
            Util.class2type[toString.call(obj)] || "object" :
            typeof obj;
    };
    Util.isArrayLike = function (obj) {
        var length = !!obj && "length" in obj && obj.length, type = Util.type(obj);
        if (type === "function" || Util.isWindow(obj)) {
            return false;
        }
        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;
    };
    Util.arr = [];
    Util.slice = Util.arr.slice;
    Util.class2type = {
        "[object Boolean]": "boolean",
        "[object Number]": "number",
        "[object String]": "string",
        "[object Function]": "function",
        "[object Array]": "array",
        "[object Date]": "date",
        "[object RegExp]": "regexp",
        "[object Object]": "object",
        "[object Error]": "error",
        "[object Symbol]": "symbol"
    };
    //private static toString : Function = Util.class2type.toString;
    Util.hasOwn = Util.class2type.hasOwnProperty;
    return Util;
}());

//# sourceMappingURL=util.js.map
// CONCATENATED MODULE: ./src/services/push-client.ts
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ionic_native_push__ = __webpack_require__(100);
/* harmony import */ var push_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(15);
/* harmony import */ var push_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(push_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
var push_client___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var push_client___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var push_client_PushClient = (function () {
    function PushClient(push) {
        this.push = push;
        /**{
            on: (event: "registration" | "notification" | "error", callback: (data: PushResponse) => void) => void,
            off: (event: "registration" | "notification" | "error", callback: (err: any) => void) => void,
            unregister: (successHandler: () => void, errorHandler: () => void, topics: any[]) => void,
            clearAllNotifications: (successHandler: () => void, errorHandler: () => void) => void
        };*/
        this.refs = {};
        this.errorSource = new push_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["BehaviorSubject"](null);
        this.error = this.errorSource.asObservable();
        this.registrationSource = new push_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["BehaviorSubject"](null);
        this.registration = this.registrationSource.asObservable();
        this.notificationSource = new push_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["BehaviorSubject"](null);
        this.notification = this.notificationSource.asObservable();
    }
    PushClient.prototype.initialize = function () {
        this.pushObj = this.push.init({
            android: {
                senderID: Config.androidGcmId,
                icon: "icon_notif",
                iconColor: "orange",
                sound: true
            },
            ios: {
                alert: true,
                badge: true,
                sound: true
            },
            windows: {}
        });
        if (this.pushObj && this.pushObj['error']) {
            this.pushObj = null;
        }
        this.startup();
    };
    PushClient.prototype.startup = function () {
        if (Util.isEmptyObject(this.refs)) {
            this.on("registration", Util.proxy(this.onRegistration, this));
            this.on("notification", Util.proxy(this.onNotification, this));
            this.on("error", Util.proxy(this.onError, this));
        }
    };
    PushClient.prototype.shutdown = function () {
        this.pushObj.unregister();
    };
    PushClient.prototype.on = function (event, cb) {
        var func = Util.proxy(cb, this);
        this.refs[event] = func;
        this.pushObj && this.pushObj.on(event).subscribe(function (d) {
            func(d);
        });
    };
    PushClient.prototype.onRegistration = function (data) {
        console.log("registration", data);
        this.registrationSource.next(data.registrationId);
    };
    PushClient.prototype.onNotification = function (data) {
        var action = data.additionalData["action"];
        var id = data.additionalData["id"];
        this.notificationSource.next({ id: id, action: action });
    };
    PushClient.prototype.onError = function (err) {
        this.errorSource.next(err);
    };
    PushClient = push_client___decorate([
        __WEBPACK_IMPORTED_MODULE_2__angular_core__["Injectable"](),
        push_client___metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__ionic_native_push__["a" /* Push */]])
    ], PushClient);
    return PushClient;
}());

//# sourceMappingURL=push-client.js.map
// CONCATENATED MODULE: ./src/services/business-service.ts
/* harmony import */ var business_service___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var business_service___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(15);
/* harmony import */ var business_service___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(business_service___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_transfer__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_network__ = __webpack_require__(101);
var business_service___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var business_service___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var business_service_BussinessClient = (function () {
    function BussinessClient(db, rest, sync, push, net, fileTransfer) {
        var _this = this;
        this.db = db;
        this.rest = rest;
        this.sync = sync;
        this.push = push;
        this.net = net;
        this.fileTransfer = fileTransfer;
        this.online = true;
        this.setup = false;
        this.networkSource = new business_service___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["BehaviorSubject"](null);
        this.network = this.networkSource.asObservable();
        this.networkOff = this.net.onDisconnect().subscribe(function () {
            console.log("network was disconnected :-(");
            _this.setOnline(false);
        });
        this.networkOn = this.net.onConnect().subscribe(function () {
            console.log("network was connected");
            _this.setOnline(true);
        });
        this.errorSource = new business_service___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["BehaviorSubject"](null);
        this.error = this.errorSource.asObservable();
    }
    BussinessClient.prototype.isOnline = function () {
        return this.online;
    };
    BussinessClient.prototype.setOnline = function (val) {
        this.online = val;
        this.networkSource.next(val ? "ON" : "OFF");
        this.rest.setOnline(val);
        this.doAutoSync();
    };
    BussinessClient.prototype.doAutoSync = function () {
        var _this = this;
        if (this.isOnline()) {
            this.db.getConfig("autoUpload").subscribe(function (val) {
                if (val + "" == "true") {
                    _this.doSync().subscribe(function () {
                        console.log("Sync up done");
                    });
                }
            });
        }
    };
    BussinessClient.prototype.setupNotifications = function () {
        var _this = this;
        if (!this.setup) {
            this.setup = true;
            this.push.error.subscribe(function (err) {
                console.error("notification", err);
                console.error(JSON.stringify(err));
            });
            this.push.notification.subscribe(function (note) {
                if (!note) {
                    return;
                }
                _this.db.getConfig("lastSyncDate").subscribe(function (time) {
                    var d = new Date();
                    if (time) {
                        d.setTime(parseInt(time));
                    }
                    _this.sync.download(time ? d : null).subscribe(function (data) {
                    }, function (err) {
                        //obs.error(err);
                    }, function () {
                        console.log("sync-ed");
                        _this.db.saveConfig("lastSyncDate", d.getTime() + "").subscribe(function () {
                        });
                    });
                });
            });
            this.push.registration.subscribe(function (regId) {
                if (!regId) {
                    return;
                }
                _this.db.updateRegistration(regId).subscribe(function (ok) {
                    _this.rest.registerDeviceToPush(regId, true).subscribe(function (done) {
                        if (done) {
                            _this.registration.pushRegistered = 1;
                            _this.db.saveRegistration(_this.registration).subscribe(function () {
                                //done
                            });
                        }
                    });
                });
            });
            this.push.initialize();
        }
    };
    BussinessClient.prototype.getRegistration = function (registerForPush) {
        var _this = this;
        return new business_service___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            _this.db.getRegistration().subscribe(function (user) {
                if (user) {
                    _this.registration = user;
                    _this.db.setupWorkDb(user.db);
                    _this.rest.token = user.access_token;
                    obs.next(user);
                    obs.complete();
                }
                else {
                    obs.next(user);
                    obs.complete();
                }
            });
        });
    };
    BussinessClient.prototype.validateKioskPassword = function (password) {
        var _this = this;
        return new business_service___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            _this.db.getConfig("kioskModePassword").subscribe(function (pwd) {
                obs.next(pwd && password && password == pwd);
                obs.complete();
            }, function (err) {
                obs.error(err);
            });
        });
    };
    BussinessClient.prototype.setKioskPassword = function (password) {
        var _this = this;
        return new business_service___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            _this.db.saveConfig("kioskModePassword", password).subscribe(function (done) {
                obs.next(done);
                obs.complete();
            }, function (err) {
                obs.error(err);
            });
        });
    };
    BussinessClient.prototype.hasKioskPassword = function () {
        var _this = this;
        return new business_service___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            _this.db.getConfig("kioskModePassword").subscribe(function (pwd) {
                obs.next(pwd != null && pwd.length > 0);
                obs.complete();
            }, function (err) {
                obs.error(err);
            });
        });
    };
    BussinessClient.prototype.authenticate = function (authCode) {
        var _this = this;
        return new business_service___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            var req = new AuthenticationRequest();
            req.invitation_code = authCode;
            req.device_name = authCode;
            _this.rest.authenticate(req).subscribe(function (reply) {
                var fileTransfer = new __WEBPACK_IMPORTED_MODULE_7__ionic_native_transfer__["a" /* Transfer */]();
                var ext = reply.user_profile_picture.split('.').pop();
                var target = cordova.file.dataDirectory + 'leadliaison/profile/current.' + ext;
                _this.fileTransfer.create().download(reply.user_profile_picture, target, true, {})
                    .then(function (result) {
                    reply.user_profile_picture = result.nativeURL;
                    ext = reply.customer_logo.split('.').pop();
                    target = cordova.file.dataDirectory + 'leadliaison/profile/logo.' + ext;
                    _this.fileTransfer.create().download(reply.user_profile_picture, target, true, {})
                        .then(function (result) {
                        reply.customer_logo = result.nativeURL;
                        _this.registration = reply;
                        reply.pushRegistered = 1;
                        _this.db.saveRegistration(reply).subscribe(function (done) {
                            _this.db.setupWorkDb(reply.db);
                            obs.next({ user: reply, message: "Done" });
                            obs.complete();
                            var d = new Date();
                            _this.sync.download(null).subscribe(function (downloadData) {
                            }, function (err) {
                                obs.error(err);
                            }, function () {
                                _this.db.saveConfig("lastSyncDate", d.getTime() + "").subscribe(function () {
                                    obs.next({ user: reply, message: "Done" });
                                });
                            });
                        });
                    })
                        .catch(function (err) {
                        obs.error("There was an error retrieving the profile picture");
                    })
                        .catch(function (err) {
                        obs.error("There was an error retrieving the logo picture");
                    });
                });
            }, function (err) {
                obs.error("Invalid authentication code");
            });
        });
    };
    BussinessClient.prototype.unregister = function (user) {
        var _this = this;
        return new business_service___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            _this.rest.unauthenticate(user.access_token).subscribe(function (done) {
                if (done) {
                    _this.db.deleteRegistration(user.id + "").subscribe(function () {
                        obs.next(user);
                        obs.complete();
                    }, function (err) {
                        obs.error(err);
                    });
                }
                else {
                    obs.error("Could not unauthenticate");
                }
            }, function (err) {
                obs.error(err);
            });
        });
    };
    BussinessClient.prototype.getUpdates = function () {
        var _this = this;
        return new business_service___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            _this.db.getConfig("lastSyncDate").subscribe(function (time) {
                var d = new Date();
                if (time) {
                    d.setTime(parseInt(time));
                }
                var newD = new Date();
                _this.sync.download(time ? d : null).subscribe(function (downloadData) {
                    //console.log(downloadData);
                }, function (err) {
                    obs.error(err);
                }, function () {
                    _this.db.saveConfig("lastSyncDate", newD.getTime() + "").subscribe(function () {
                        obs.next(true);
                        obs.complete();
                    });
                });
            });
        });
    };
    BussinessClient.prototype.getForms = function () {
        return this.db.getForms();
    };
    BussinessClient.prototype.getDispatches = function () {
        return this.db.getDispatches();
    };
    BussinessClient.prototype.getContacts = function (form) {
        return this.db.getMemberships(form.form_id);
    };
    BussinessClient.prototype.getContact = function (form, prospectId) {
        return this.db.getMembership(form.form_id, prospectId);
    };
    BussinessClient.prototype.getSubmissions = function (form, isDispatch) {
        return this.db.getSubmissions(form.form_id, isDispatch);
    };
    BussinessClient.prototype.saveSubmission = function (sub, form) {
        var _this = this;
        sub.updateFields(form);
        return new business_service___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            _this.db.saveSubmission(sub).subscribe(function (done) {
                _this.doAutoSync();
                obs.next(done);
                obs.complete();
            }, function (err) {
                obs.error(err);
            });
        });
    };
    BussinessClient.prototype.doSync = function (formId) {
        var _this = this;
        return new business_service___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"](function (obs) {
            if (!_this.online) {
                obs.complete();
                return;
            }
            _this.db.getSubmissionsToSend().subscribe(function (submissions) {
                if (submissions.length == 0) {
                    obs.complete();
                    return;
                }
                var formIds = [];
                if (formId > 0) {
                    formIds.push(formId);
                    var tmp = [];
                    submissions.forEach(function (sub) {
                        if (sub.form_id + "" == formId + "") {
                            tmp.push(sub);
                        }
                    });
                    submissions = tmp;
                }
                else {
                    submissions.forEach(function (sub) {
                        if (formIds.indexOf(sub.form_id) == -1) {
                            formIds.push(sub.form_id);
                        }
                    });
                }
                _this.db.getFormsByIds(formIds).subscribe(function (forms) {
                    _this.sync.sync(submissions, forms).subscribe(function (submitted) {
                        obs.next(true);
                        obs.complete();
                    }, function (err) {
                        console.error(err);
                        obs.error(err);
                        _this.errorSource.next(err);
                    });
                }, function (err) {
                    obs.error(err);
                    _this.errorSource.next(err);
                });
            });
        });
    };
    BussinessClient = business_service___decorate([
        business_service___WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"]()
        /**
         * The client to rule them all. The BussinessClient connects all the separate cients and creates
         * usable action flows. For example, authentication is a complex flow consisting of the actual auth
         * profile photos download, saving the registration response to the local database and starting up
         * the initial sync.
         *
         */
        ,
        business_service___metadata("design:paramtypes", [db_client_DBClient,
            rest_client_RESTClient,
            sync_client_SyncClient,
            push_client_PushClient,
            __WEBPACK_IMPORTED_MODULE_8__ionic_native_network__["a" /* Network */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_native_transfer__["a" /* Transfer */]])
    ], BussinessClient);
    return BussinessClient;
}());

//# sourceMappingURL=business-service.js.map
// CONCATENATED MODULE: ./src/util/validator.ts
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_forms__ = __webpack_require__(6);

function isPresent(obj) {
    return obj !== undefined && obj !== null;
}
var CustomValidators = (function () {
    function CustomValidators() {
    }
    /**
     * Validator that requires controls to have a value of a range length.
     */
    CustomValidators.rangeLength = function (rangeLength) {
        return function (control) {
            if (isPresent(__WEBPACK_IMPORTED_MODULE_0__angular_forms__["Validators"].required(control)))
                return null;
            var v = control.value;
            return v.length >= rangeLength[0] && v.length <= rangeLength[1] ? null : { 'rangeLength': true };
        };
    };
    /**
     * Validator that requires controls to have a value of a min value.
     */
    CustomValidators.min = function (min) {
        return function (control) {
            if (isPresent(__WEBPACK_IMPORTED_MODULE_0__angular_forms__["Validators"].required(control)))
                return null;
            var v = control.value;
            return v >= min ? null : { 'min': true };
        };
    };
    /**
     * Validator that requires controls to have a value of a max value.
     */
    CustomValidators.max = function (max) {
        return function (control) {
            if (isPresent(__WEBPACK_IMPORTED_MODULE_0__angular_forms__["Validators"].required(control)))
                return null;
            var v = control.value;
            return v <= max ? null : { 'max': true };
        };
    };
    /**
     * Validator that requires controls to have a value of a range value.
     */
    CustomValidators.range = function (range) {
        return function (control) {
            if (isPresent(__WEBPACK_IMPORTED_MODULE_0__angular_forms__["Validators"].required(control)))
                return null;
            var v = control.value;
            return v >= range[0] && v <= range[1] ? null : { 'range': true };
        };
    };
    /**
     * Validator that requires controls to have a value of digits.
     */
    CustomValidators.digits = function (control) {
        if (isPresent(__WEBPACK_IMPORTED_MODULE_0__angular_forms__["Validators"].required(control)))
            return null;
        var v = control.value;
        return /^\d+$/.test(v) ? null : { 'digits': true };
    };
    /**
     * Validator that requires controls to have a value of number.
     */
    CustomValidators.number = function (control) {
        if (isPresent(__WEBPACK_IMPORTED_MODULE_0__angular_forms__["Validators"].required(control)))
            return null;
        var v = control.value;
        return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(v) ? null : { 'number': true };
    };
    /**
     * Validator that requires controls to have a value of url.
     */
    CustomValidators.url = function (control) {
        if (isPresent(__WEBPACK_IMPORTED_MODULE_0__angular_forms__["Validators"].required(control)))
            return null;
        var v = control.value;
        return /^(https?:\/\/){0,1}([a-z0-9]([-a-z0-9]*[a-z0-9])?\.)+((a[cdefgilmnoqrstuwxz]|aero|arpa)|(b[abdefghijmnorstvwyz]|biz)|(c[acdfghiklmnorsuvxyz]|cat|com|coop)|d[ejkmoz]|(e[ceghrstu]|edu)|f[ijkmor]|(g[abdefghilmnpqrstuwy]|gov)|h[kmnrtu]|(i[delmnoqrst]|info|int)|(j[emop]|jobs)|k[eghimnprwyz]|l[abcikrstuvy]|(m[acdghklmnopqrstuvwxyz]|mil|mobi|museum)|(n[acefgilopruz]|name|net)|(om|org)|(p[aefghklmnrstwy]|pro)|qa|r[eouw]|s[abcdeghijklmnortvyz]|(t[cdfghjklmnoprtvwz]|travel)|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw])(.*)$/i.test(v) ? null : { 'url': true };
    };
    /**
     * Validator that requires controls to have a value of email.
     */
    CustomValidators.email = function (control) {
        if (isPresent(__WEBPACK_IMPORTED_MODULE_0__angular_forms__["Validators"].required(control)))
            return null;
        var v = control.value;
        return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(v) ? null : { 'email': true };
    };
    /**
     * Validator that requires controls to have a value of date.
     */
    CustomValidators.date = function (control) {
        if (isPresent(__WEBPACK_IMPORTED_MODULE_0__angular_forms__["Validators"].required(control)))
            return null;
        var v = control.value;
        return !/Invalid|NaN/.test(new Date(v).toString()) ? null : { 'date': true };
    };
    /**
     * Validator that requires controls to have a value of dateISO.
     */
    CustomValidators.dateISO = function (control) {
        if (isPresent(__WEBPACK_IMPORTED_MODULE_0__angular_forms__["Validators"].required(control)))
            return null;
        var v = control.value;
        return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(v) ? null : { 'dateISO': true };
    };
    /**
     * Validator that requires controls to have a value of creditCard.
     */
    CustomValidators.creditCard = function (control) {
        if (isPresent(__WEBPACK_IMPORTED_MODULE_0__angular_forms__["Validators"].required(control)))
            return null;
        var v = control.value;
        var sanitized = v.replace(/[^0-9]+/g, '');
        // problem with chrome
        if (!(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/.test(sanitized))) {
            return { 'creditCard': true };
        }
        var sum = 0;
        var digit;
        var tmpNum;
        var shouldDouble;
        for (var i = sanitized.length - 1; i >= 0; i--) {
            digit = sanitized.substring(i, (i + 1));
            tmpNum = parseInt(digit, 10);
            if (shouldDouble) {
                tmpNum *= 2;
                if (tmpNum >= 10) {
                    sum += ((tmpNum % 10) + 1);
                }
                else {
                    sum += tmpNum;
                }
            }
            else {
                sum += tmpNum;
            }
            shouldDouble = !shouldDouble;
        }
        if (Boolean((sum % 10) === 0 ? sanitized : false)) {
            return null;
        }
        return { 'creditCard': true };
    };
    /**
     * Validator that requires controls to have a value of JSON.
     */
    CustomValidators.json = function (control) {
        if (isPresent(__WEBPACK_IMPORTED_MODULE_0__angular_forms__["Validators"].required(control)))
            return null;
        var v = control.value;
        try {
            var obj = JSON.parse(v);
            if (Boolean(obj) && typeof obj === 'object') {
                return null;
            }
        }
        catch (e) {
        }
        return { 'json': true };
    };
    /**
     * Validator that requires controls to have a value of base64.
     */
    CustomValidators.base64 = function (control) {
        if (isPresent(__WEBPACK_IMPORTED_MODULE_0__angular_forms__["Validators"].required(control)))
            return null;
        var v = control.value;
        return /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i.test(v) ? null : { 'base64': true };
    };
    /**
     * Validator that requires controls to have a value of phone.
     */
    CustomValidators.phone = function (locale) {
        var phones = {
            'zh-CN': /^(\+?0?86\-?)?((13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7})$/,
            'zh-TW': /^(\+?886\-?|0)?9\d{8}$/,
            'en-ZA': /^(\+?27|0)\d{9}$/,
            'en-AU': /^(\+?61|0)4\d{8}$/,
            'en-HK': /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/,
            'fr-FR': /^(\+?33|0)[67]\d{8}$/,
            'de-DE': /^(\+?49|0)[1-9]\d{10}$/,
            'pt-PT': /^(\+351)?9[1236]\d{7}$/,
            'el-GR': /^(\+?30)?(69\d{8})$/,
            'en-GB': /^(\+?44|0)7\d{9}$/,
            'en-US': /^[1-9][0-9]{9}$/,
            'en-ZM': /^(\+26)?09[567]\d{7}$/,
            'ru-RU': /^(\+?7|8)?9\d{9}$/,
            'nb-NO': /^(\+?47)?[49]\d{7}$/,
            'nn-NO': /^(\+?47)?[49]\d{7}$/,
            'vi-VN': /^(0|\+?84)?((1(2([0-9])|6([2-9])|88|99))|(9((?!5)[0-9])))([0-9]{7})$/,
            'en-NZ': /^(\+?64|0)2\d{7,9}$/
        };
        return function (control) {
            if (isPresent(__WEBPACK_IMPORTED_MODULE_0__angular_forms__["Validators"].required(control)))
                return null;
            var v = control.value;
            var pattern = phones[locale] || phones['en-US'];
            return (new RegExp(pattern)).test(v) ? null : { 'phone': true };
        };
    };
    /**
     * Validator that requires controls to have a value of uuid.
     */
    CustomValidators.uuid = function (version) {
        var uuid = {
            '3': /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
            '4': /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
            '5': /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
            'all': /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
        };
        return function (control) {
            if (isPresent(__WEBPACK_IMPORTED_MODULE_0__angular_forms__["Validators"].required(control)))
                return null;
            var v = control.value;
            var pattern = uuid[version] || uuid.all;
            return (new RegExp(pattern)).test(v) ? null : { 'uuid': true };
        };
    };
    /**
     * Validator that requires controls to have a value to equal another value.
     */
    CustomValidators.equal = function (val) {
        return function (control) {
            if (isPresent(__WEBPACK_IMPORTED_MODULE_0__angular_forms__["Validators"].required(control)))
                return null;
            var v = control.value;
            return val === v ? null : { equal: true };
        };
    };
    /**
     * Validator that requires controls to have a value to equal another control.
     */
    CustomValidators.equalTo = function (group) {
        var keys = Object.keys(group.controls);
        var len = keys.length;
        if (!len)
            return null;
        var firstKey = keys[0];
        for (var i = 1; i < len; i++) {
            if (group.controls[firstKey].value !== group.controls[keys[i]].value) {
                return { equalTo: true };
            }
        }
        return null;
    };
    return CustomValidators;
}());

//# sourceMappingURL=validator.js.map
// CONCATENATED MODULE: ./src/components/form-view/form-view.ts
/* harmony import */ var form_view___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(6);
var form_view___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var form_view___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var form_view_FormView = (function () {
    function FormView(fb, zone) {
        this.fb = fb;
        this.zone = zone;
        this.onChange = new form_view___WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.onValidationChange = new form_view___WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.readOnly = false;
        this.theForm = null;
        this.displayForm = {};
    }
    FormView.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
            var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
            _this.dateTimes.changes.subscribe(function (dateTime) {
                _this.dateTimes.forEach(function (dt) {
                    dt.setValue(localISOTime);
                });
            });
        });
    };
    FormView.prototype.hasChanges = function () {
        return this.theForm.dirty;
    };
    FormView.prototype.getValues = function () {
        var data = {};
        var parse = function (form, data) {
            for (var id in form.controls) {
                var control = form.controls[id];
                if (control instanceof __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormGroup"]) {
                    parse(control, data);
                }
                else {
                    data[id] = control.value;
                }
            }
        };
        this.theForm && parse(this.theForm, data);
        return data;
    };
    FormView.prototype.ngOnChanges = function (changes) {
        if (changes['form'] || changes['submission']) {
            if (this.form && this.submission) {
                this.readOnly = this.submission.isSubmitted();
                this.setupFormGroup();
            }
            else {
                this.theForm = new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormGroup"]({});
                this.displayForm = {};
            }
        }
        else if (changes['prospect'] && this.prospect) {
            var foundEmail, foundName;
            for (var i = 0; i < this.form.elements.length; i++) {
                if (this.form.elements[i].type == "email" && !foundEmail) {
                    this.theForm.get("element_" + this.form.elements[i].id).setValue(this.prospect.fields["Email"]);
                    foundEmail = true;
                }
                else if (this.form.elements[i].type == "simple_name" && !foundName) {
                    var id = "element_" + this.form.elements[i].id;
                    this.theForm.get(id).get(id + "_1").setValue(this.prospect.fields["FirstName"]);
                    this.theForm.get(id).get(id + "_2").setValue(this.prospect.fields["LastName"]);
                    foundName = true;
                }
            }
        }
    };
    FormView.prototype.setupFormGroup = function () {
        var _this = this;
        if (this.sub) {
            this.sub.unsubscribe();
        }
        this.data = this.getValues();
        if (this.submission && this.submission.fields) {
            this.data = Object.assign(Object.assign({}, this.submission.fields), this.data);
        }
        var f = this.fb.group({});
        /*this.form.elements.push({
            id : 3234,
            title : "sdfsdf",
            guidelines : "",
            field_error_message : "2323r",
            size : "123",
            is_required : false,
            is_always_display : true,
            is_conditional : false,
            is_not_prefilled : false,
            is_scan_cards_and_prefill_form: 1,
            is_hidden : false,
            is_readonly : false,
            type : "barcode",
            position : 134,
            default_value : "",
            total_child : 1,
            options : [],
            mapping : []
        });*/
        this.form.elements.forEach(function (element) {
            var identifier = "element_" + element.id;
            element["identifier"] = identifier;
            var control = null;
            if (element.mapping.length > 1) {
                var opts = {};
                element.mapping.forEach(function (entry, index) {
                    entry["identifier"] = identifier + "_" + (index + 1);
                    opts[entry["identifier"]] = new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormControl"]({ value: _this.data[entry["identifier"]] ? _this.data[entry["identifier"]] : element.default_value, disabled: element.is_readonly || _this.readOnly }, _this.makeValidators(element));
                });
                control = _this.fb.group(opts);
            }
            else {
                control = _this.fb.control({ value: _this.data[identifier] || element.default_value, disabled: element.is_readonly || _this.readOnly });
                control.setValidators(_this.makeValidators(element));
            }
            f.addControl(identifier, control);
        });
        this.theForm = f;
        //console.log(this.form, f);
        this.sub = this.theForm.statusChanges.subscribe(function () {
            _this.onValidationChange.emit(_this.theForm.valid);
        });
        setTimeout(function () {
            _this.zone.run(function () {
                _this.displayForm = _this.form;
            });
        }, 150);
    };
    FormView.prototype.makeValidators = function (element) {
        var validators = [];
        if (element.is_required) {
            validators.push(__WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].required);
        }
        switch (element.type) {
            case "email":
                validators.push(CustomValidators.email);
                break;
            case "url":
                validators.push(CustomValidators.url);
                break;
            case "text":
                validators.push(__WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].maxLength(255));
                break;
            case "phone":
                validators.push(CustomValidators.phone());
                break;
        }
        return validators;
    };
    FormView.prototype.onInputChange = function () {
    };
    FormView.prototype.setHour = function (event) {
    };
    FormView.prototype.setDate = function (event) {
        //console.log(event);
    };
    form_view___decorate([
        form_view___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        form_view___metadata("design:type", Form)
    ], FormView.prototype, "form", void 0);
    form_view___decorate([
        form_view___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        form_view___metadata("design:type", form_submission_FormSubmission)
    ], FormView.prototype, "submission", void 0);
    form_view___decorate([
        form_view___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        form_view___metadata("design:type", DeviceFormMembership)
    ], FormView.prototype, "prospect", void 0);
    form_view___decorate([
        form_view___WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"](),
        form_view___metadata("design:type", Object)
    ], FormView.prototype, "onChange", void 0);
    form_view___decorate([
        form_view___WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"](),
        form_view___metadata("design:type", Object)
    ], FormView.prototype, "onValidationChange", void 0);
    form_view___decorate([
        form_view___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        form_view___metadata("design:type", Boolean)
    ], FormView.prototype, "readOnly", void 0);
    form_view___decorate([
        form_view___WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChildren"](__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* DateTime */]),
        form_view___metadata("design:type", form_view___WEBPACK_IMPORTED_MODULE_0__angular_core__["QueryList"])
    ], FormView.prototype, "dateTimes", void 0);
    FormView = form_view___decorate([
        form_view___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'form-view',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\form-view.html"*/'<div class="form-view">\n\n	<form [formGroup]="theForm" style="width:100%;" novalidate>\n\n		<div class="" *ngFor="let element of displayForm.elements" [ngSwitch]="element.type">\n\n			<ion-item *ngSwitchCase="\'email\'">\n\n				<ion-label stacked [class.required]="element.is_required">{{element.title}}</ion-label>\n\n				<ion-input type="email" [attr.name]="element.id" [formControlName]="element.identifier"></ion-input>\n\n			</ion-item>\n\n			<div *ngSwitchCase="\'page_break\'"></div>\n\n			<div *ngSwitchCase="\'section\'"></div>\n\n			<ion-item *ngSwitchCase="\'url\'">\n\n				<ion-label stacked [class.required]="element.is_required">{{element.title}}</ion-label>\n\n				<ion-input type="url" [attr.name]="element.id" [formControlName]="element.identifier"></ion-input>\n\n			</ion-item>\n\n			<ion-item *ngSwitchCase="\'text\'">\n\n				<ion-label stacked [class.required]="element.is_required">{{element.title}}</ion-label>\n\n				<ion-input type="text" [attr.name]="element.id" [formControlName]="element.identifier"></ion-input>\n\n			</ion-item>\n\n			<dropdown [readonly]="readOnly" *ngSwitchCase="\'select\'" [element]="element" [formGroup]="theForm" [formControlName]="element.identifier"></dropdown>\n\n			<ion-item *ngSwitchCase="\'radio\'">\n\n				<ion-label stacked [class.required]="element.is_required">{{element.title}}</ion-label>\n\n				<radios item-content [element]="element" [readonly]="readOnly" [formGroup]="theForm" [formControlName]="element.identifier"></radios>\n\n			</ion-item>\n\n			<simple-name *ngSwitchCase="\'simple_name\'" [element]="element" [rootGroup]="theForm"></simple-name>\n\n			<ion-item *ngSwitchCase="\'textarea\'">\n\n				<ion-label stacked [class.required]="element.is_required">{{element.title}}</ion-label>\n\n				<ion-textarea [attr.name]="element.id" [formControlName]="element.identifier"></ion-textarea>\n\n			</ion-item>\n\n			<ion-item *ngSwitchCase="\'time\'">\n\n				<ion-label stacked [class.required]="element.is_required">{{element.title}}</ion-label>\n\n				<ion-datetime (click)="setHour($event)" displayFormat="hh:mm A" pickerFormat="hh:mm"  [attr.name]="element.id" [formControlName]="element.identifier"></ion-datetime>\n\n			</ion-item>\n\n			<address *ngSwitchCase="\'address\'" [element]="element" [rootGroup]="theForm"></address>\n\n			<ion-item *ngSwitchCase="\'money\'">\n\n				<ion-label stacked [class.required]="element.is_required">{{element.title}}</ion-label>\n\n				<ion-input pattern="[0-9\.\$\,]*" [attr.name]="element.id" [formControlName]="element.identifier" myCurrency></ion-input>\n\n			</ion-item>\n\n			<ion-item *ngSwitchCase="\'number\'">\n\n				<ion-label stacked [class.required]="element.is_required">{{element.title}}</ion-label>\n\n				<ion-input type="number" [attr.name]="element.id" [formControlName]="element.identifier"></ion-input>\n\n			</ion-item>\n\n			<ion-item *ngSwitchCase="\'date\'">\n\n				<ion-label stacked [class.required]="element.is_required">{{element.title}}</ion-label>\n\n				<ion-datetime (click)="setDate($event)" displayFormat="MMMM DD, YYYY" pickerFormat="DD MMMM YYYY"  [attr.name]="element.id" [formControlName]="element.identifier"></ion-datetime>\n\n			</ion-item>\n\n			<ion-item *ngSwitchCase="\'phone\'">\n\n				<ion-label stacked [class.required]="element.is_required">{{element.title}}</ion-label>\n\n				<ion-input [readonly]="readOnly" type="tel" [attr.name]="element.id" [formControlName]="element.identifier"></ion-input>\n\n			</ion-item>\n\n			<ion-item *ngSwitchCase="\'checkbox\'">\n\n				<ion-label stacked [class.required]="element.is_required">{{element.title}}</ion-label>\n\n				<checkboxes [readonly]="readOnly" item-content [element]="element" [formGroup]="theForm" [formControlName]="element.identifier"></checkboxes>\n\n  			</ion-item>\n\n			<ion-item *ngSwitchCase="\'image\'">\n\n				<ion-label stacked [class.required]="element.is_required">{{element.title}}</ion-label>\n\n				<image [readonly]="readOnly" item-content [element]="element" [formGroup]="theForm" [formControlName]="element.identifier"></image>\n\n			</ion-item>\n\n			<ion-item *ngSwitchCase="\'business_card\'">\n\n				<ion-label stacked [class.required]="element.is_required">{{element.title}}</ion-label>\n\n				<business-card [readonly]="readOnly" item-content [element]="element" [formGroup]="theForm" [formControlName]="element.identifier" [form]="form"></business-card>\n\n			</ion-item>\n\n			<ion-item *ngSwitchCase="\'signature\'">\n\n				<ion-label stacked [class.required]="element.is_required">{{element.title}}</ion-label>\n\n				<signature [readonly]="readOnly" item-content [element]="element" [formGroup]="theForm" [formControlName]="element.identifier"></signature>\n\n			</ion-item>\n\n			<barcoder padding *ngSwitchCase="\'barcode\'" [readonly]="readOnly" item-content [element]="element" [formGroup]="theForm" [formControlName]="element.identifier"></barcoder>\n\n			<ion-item *ngSwitchDefault>\n\n				<ion-label>Coming soon! A component for {{element.type}}</ion-label>\n\n			</ion-item>\n\n		</div>\n\n	</form>\n\n</div>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\form-view.html"*/
        }),
        form_view___metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormBuilder"], form_view___WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"]])
    ], FormView);
    return FormView;
}());

//# sourceMappingURL=form-view.js.map
// CONCATENATED MODULE: ./src/components/form-view/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/views/prospect-search/prospect-search.ts
/* harmony import */ var prospect_search___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var prospect_search___WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
var prospect_search___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var prospect_search___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var prospect_search_ProspectSearch = (function () {
    function ProspectSearch(navCtrl, viewCtrl, navParams, client, zone) {
        this.navCtrl = navCtrl;
        this.viewCtrl = viewCtrl;
        this.navParams = navParams;
        this.client = client;
        this.zone = zone;
        this.selectedContact = null;
        this.loading = true;
        this.searchFilter = "";
        this.contacts = [];
        this.filteredContacts = [];
    }
    ProspectSearch_1 = ProspectSearch;
    ProspectSearch.prototype.cancel = function () {
        this.viewCtrl.dismiss(null);
    };
    ProspectSearch.prototype.done = function () {
        if (this.selectedContact) {
            this.viewCtrl.dismiss(this.selectedContact);
        }
    };
    ProspectSearch.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.form = this.navParams.get("form");
        this.loading = true;
        this.client.getContacts(this.form).subscribe(function (contacts) {
            _this.zone.run(function () {
                _this.loading = false;
                _this.contacts = contacts;
                ProspectSearch_1.list = contacts;
                ProspectSearch_1.formId = _this.form.form_id + "";
                _this.onInput({ target: { value: "" } });
            });
        });
    };
    ProspectSearch.prototype.onInput = function (event) {
        var val = event.target.value;
        var regexp = new RegExp(val, "i");
        this.filteredContacts = this.contacts.filter(function (contact) {
            return !val || regexp.test(contact["search"]);
        });
    };
    ProspectSearch.list = [];
    ProspectSearch.formId = "";
    ProspectSearch = ProspectSearch_1 = prospect_search___decorate([
        prospect_search___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'prospect-search',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\prospect-search\prospect-search.html"*/'<ion-header>\n\n	<ion-navbar>\n\n		<ion-buttons start>\n\n			<button ion-button (click)="cancel()">\n\n				<ion-icon name="close" class="capture"></ion-icon>\n\n			</button>\n\n		</ion-buttons>\n\n		<ion-title>Select prospect</ion-title>\n\n		<ion-buttons end>\n\n			<button ion-button [disabled]="!selectedContact" (click)="done()">\n\n				<ion-icon name="checkmark" class="capture"></ion-icon>\n\n			</button>\n\n		</ion-buttons>\n\n	</ion-navbar>\n\n	<ion-toolbar>\n\n		<ion-searchbar [(ngModel)]="searchFilter" (ionInput)="onInput($event)">\n\n		</ion-searchbar>\n\n	</ion-toolbar>\n\n</ion-header>\n\n<ion-content>\n\n	<ion-list [virtualScroll]="filteredContacts" approxItemHeight="75px">\n\n		<a ion-item detail-none *virtualItem="let contact"  approxItemHeight="75px" [class.selected]="contact == selectedContact" (click)="selectedContact = contact">\n\n			<h1>{{contact.fields.FirstName + " " + contact.fields.LastName}}</h1>\n\n			<h2>{{contact.fields.Email}}</h2>\n\n		</a>\n\n	</ion-list>\n\n</ion-content>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\prospect-search\prospect-search.html"*/
        }),
        prospect_search___metadata("design:paramtypes", [prospect_search___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */],
            prospect_search___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ViewController */],
            prospect_search___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavParams */],
            business_service_BussinessClient,
            prospect_search___WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"]])
    ], ProspectSearch);
    return ProspectSearch;
    var ProspectSearch_1;
}());

//# sourceMappingURL=prospect-search.js.map
// CONCATENATED MODULE: ./src/views/prospect-search/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/views/form-capture/form-capture.ts
/* harmony import */ var form_capture___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var form_capture___WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
var form_capture___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var form_capture___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var form_capture_FormCapture = (function () {
    function FormCapture(navCtrl, navParams, client, zone, modal, menuCtrl, alertCtrl, platform) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.client = client;
        this.zone = zone;
        this.modal = modal;
        this.menuCtrl = menuCtrl;
        this.alertCtrl = alertCtrl;
        this.platform = platform;
        console.log("FormCapture");
    }
    FormCapture.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.form = this.navParams.get("form");
        this.submission = this.navParams.get("submission");
        this.dispatch = this.navParams.get("dispatch");
        if (this.dispatch) {
            this.form = this.dispatch.form;
        }
        if (!this.submission) {
            this.submission = new form_submission_FormSubmission();
            this.submission.form_id = this.dispatch ? this.dispatch.form_id : this.form.form_id;
        }
        else {
            this.client.getContact(this.form, this.submission.prospect_id).subscribe(function (contact) {
                _this.prospect = contact;
            });
        }
        this.menuCtrl.enable(false);
    };
    FormCapture.prototype.isReadOnly = function (submission) {
        return submission && submission.status == SubmissionStatus.Submitted;
    };
    FormCapture.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.backUnregister = this.platform.registerBackButtonAction(function () {
            _this.doBack();
        }, Number.MAX_VALUE);
        this["oldClick"] = this.navbar.backButtonClick;
        this.navbar.backButtonClick = function () {
            _this.doBack();
        };
        if (this.form.is_mobile_kiosk_mode) {
            this.client.hasKioskPassword().subscribe(function (hasPwd) {
                if (!hasPwd) {
                    _this.alertCtrl.create({
                        title: 'Set kiosk mode pass code',
                        inputs: [
                            {
                                name: 'passcode',
                                placeholder: 'Kiosk Mode Pass Code',
                                value: ""
                            }
                        ],
                        buttons: [
                            {
                                text: 'Cancel',
                                role: 'cancel',
                                handler: function () {
                                }
                            },
                            {
                                text: 'Ok',
                                handler: function (data) {
                                    var password = data.passcode;
                                    _this.client.setKioskPassword(password).subscribe(function (valid) {
                                    });
                                }
                            }
                        ]
                    }).present();
                }
            });
        }
    };
    FormCapture.prototype.ionViewWillLeave = function () {
        if (this.backUnregister) {
            this.backUnregister();
        }
        this.navbar.backButtonClick = this["oldClick"];
    };
    FormCapture.prototype.ionViewDidLeave = function () {
        this.menuCtrl.enable(true);
    };
    FormCapture.prototype.doRefresh = function (refresher) {
    };
    FormCapture.prototype.doBack = function () {
        var _this = this;
        if (this.form.is_mobile_kiosk_mode) {
            var alert_1 = this.alertCtrl.create({
                title: 'Enter pass code',
                inputs: [
                    {
                        name: 'passcode',
                        placeholder: 'Kiosk Mode Pass Code',
                        value: ""
                    }
                ],
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: function () {
                        }
                    },
                    {
                        text: 'Ok',
                        handler: function (data) {
                            var password = data.passcode;
                            _this.client.validateKioskPassword(password).subscribe(function (valid) {
                                if (valid) {
                                    _this.internalBack();
                                }
                                else {
                                    return false;
                                }
                            });
                        }
                    }
                ]
            });
            alert_1.present();
        }
        else {
            this.internalBack();
        }
    };
    FormCapture.prototype.internalBack = function () {
        var _this = this;
        if (!this.formView.hasChanges()) {
            this.navCtrl.pop();
            return;
        }
        var alert = this.alertCtrl.create({
            title: 'Confirm exit',
            message: 'You have unsaved changes. Are you sure you want to go back?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        //console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Go back',
                    handler: function () {
                        _this.navCtrl.pop();
                    }
                }
            ]
        });
        alert.present();
    };
    FormCapture.prototype.doSave = function () {
        var _this = this;
        if (!this.valid) {
            return;
        }
        this.submission.fields = this.formView.getValues();
        if (!this.submission.id) {
            this.submission.id = new Date().getTime();
        }
        var valid = true;
        this.form.elements.forEach(function (element) {
            if (element.is_required && !_this.submission.fields[element.identifier]) {
                valid = false;
            }
        });
        if (!valid) {
            this.submission.status = SubmissionStatus.OnHold;
        }
        else if (this.submission.status != SubmissionStatus.Blocked) {
            this.submission.status = SubmissionStatus.ToSubmit;
        }
        this.client.saveSubmission(this.submission, this.form).subscribe(function (sub) {
            if (_this.form.is_mobile_kiosk_mode) {
                _this.submission = null;
                _this.form = null;
                _this.dispatch = null;
                setTimeout(function () {
                    _this.zone.run(function () {
                        _this.ionViewWillEnter();
                    });
                }, 10);
            }
            else {
                _this.navCtrl.pop();
            }
        }, function (err) {
        });
    };
    FormCapture.prototype.onValidationChange = function (valid) {
        this.valid = valid;
    };
    FormCapture.prototype.searchProspect = function () {
        var _this = this;
        var search = this.modal.create(prospect_search_ProspectSearch, { form: this.form });
        search.onDidDismiss(function (data) {
            if (data) {
                _this.prospect = data;
                _this.submission.prospect_id = data.prospect_id;
                _this.submission.email = data.fields["Email"];
                _this.submission.first_name = data.fields["FirstName"];
                _this.submission.last_name = data.fields["LastName"];
                var id = null;
                for (var field in data.fields) {
                    id = _this.form.getIdByUniqueFieldName(field);
                    if (id) {
                        _this.submission.fields[id] = data.fields[field];
                    }
                }
            }
        });
        search.present();
    };
    form_capture___decorate([
        form_capture___WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"]("formView"),
        form_capture___metadata("design:type", form_view_FormView)
    ], FormCapture.prototype, "formView", void 0);
    form_capture___decorate([
        form_capture___WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"]("navbar"),
        form_capture___metadata("design:type", form_capture___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Navbar */])
    ], FormCapture.prototype, "navbar", void 0);
    FormCapture = form_capture___decorate([
        form_capture___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'form-capture',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\form-capture\form-capture.html"*/'<ion-header>\n\n	<ion-navbar color="orange" #navbar>\n\n		<ion-title>{{form ? form.name : \'\'}}</ion-title>\n\n		<ion-buttons end>\n\n			<button ion-button (click)="doSave()" *ngIf="!isReadOnly(submission)">\n\n				<ion-icon name="checkmark" class="capture"></ion-icon>\n\n			</button>\n\n		</ion-buttons>\n\n	</ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="form-summary">\n\n	<ion-grid>\n\n		<ion-row *ngIf="form && form.list_id > 0 && !isReadOnly(submission)">\n\n			<ion-col>\n\n				<button ion-button block color="light" (click)="searchProspect()"><ion-icon name="search"></ion-icon>&nbsp;&nbsp;&nbsp;Pre-fill from List</button>\n\n			</ion-col>\n\n		</ion-row>\n\n		<ion-row>\n\n			<form-view #formView \n\n						[form]="form"\n\n						[prospect]="prospect" \n\n						[submission]="submission"\n\n						(onValidationChange)="onValidationChange($event)"\n\n						[readOnly]="isReadOnly(submission)"></form-view>\n\n		</ion-row>\n\n	</ion-grid>\n\n</ion-content>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\form-capture\form-capture.html"*/
        }),
        form_capture___metadata("design:paramtypes", [form_capture___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */],
            form_capture___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavParams */],
            business_service_BussinessClient,
            form_capture___WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"],
            form_capture___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* ModalController */],
            form_capture___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* MenuController */],
            form_capture___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            form_capture___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* Platform */]])
    ], FormCapture);
    return FormCapture;
}());

//# sourceMappingURL=form-capture.js.map
// CONCATENATED MODULE: ./src/views/form-capture/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/views/form-review/form-review.ts
/* harmony import */ var form_review___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var form_review___WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
var form_review___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var form_review___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var form_review_FormReview = (function () {
    function FormReview(navCtrl, navParams, client, zone, syncClient, toast) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.client = client;
        this.zone = zone;
        this.syncClient = syncClient;
        this.toast = toast;
        this.form = new Form();
        this.filter = "";
        this.submissions = [];
        this.loading = true;
        this.syncing = false;
        this.filteredSubmissions = [];
        this.hasSubmissionsToSend = false;
    }
    FormReview.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.form = this.navParams.get("form");
        this.isDispatch = this.navParams.get("isDispatch");
        this.loading = true;
        this.doRefresh();
        this.syncing = this.syncClient.isSyncing();
        this.sub = this.syncClient.onSync.subscribe(function (stats) { }, function (err) { }, function () {
            _this.syncing = _this.syncClient.isSyncing();
            _this.doRefresh();
        });
    };
    FormReview.prototype.ionViewDidLeave = function () {
        this.sub.unsubscribe();
        this.sub = null;
    };
    FormReview.prototype.getColor = function (submission) {
        var result = "";
        switch (submission.status) {
            case SubmissionStatus.OnHold:
                result = "orange";
                break;
            case SubmissionStatus.Blocked:
                result = "danger";
                break;
            case SubmissionStatus.ToSubmit:
                result = "secondary";
                break;
            case SubmissionStatus.Submitted:
                result = "primary";
                break;
        }
        return result;
    };
    FormReview.prototype.goToEntry = function (submission) {
        this.navCtrl.push(form_capture_FormCapture, { form: this.form, submission: submission });
    };
    FormReview.prototype.doRefresh = function () {
        var _this = this;
        this.client.getSubmissions(this.form, this.isDispatch).subscribe(function (submissions) {
            _this.submissions = submissions;
            _this.loading = false;
            _this.onFilterChanged();
        });
    };
    FormReview.prototype.onFilterChanged = function () {
        var _this = this;
        this.zone.run(function () {
            var f = _this.filter;
            _this.filteredSubmissions = _this.submissions.filter(function (sub) {
                return !f || sub.status + "" == f + "";
            }).reverse();
            _this.hasSubmissionsToSend = _this.submissions.filter(function (sub) { return sub.status == SubmissionStatus.ToSubmit; }).length > 0;
        });
    };
    FormReview.prototype.sync = function () {
        var _this = this;
        this.syncing = true;
        this.client.doSync(this.form.form_id).subscribe(function (data) {
            _this.zone.run(function () {
                _this.syncing = false;
                _this.doRefresh();
            });
        }, function (err) {
            _this.zone.run(function () {
                _this.syncing = false;
                _this.doRefresh();
                var toaster = _this.toast.create({
                    message: "There was an error sync-ing the submissions",
                    duration: 5000,
                    position: "top",
                    cssClass: "error"
                });
                toaster.present();
            });
        });
    };
    FormReview.prototype.statusClick = function (event, submission) {
        var _this = this;
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
        var initialState = null;
        if (submission.status == SubmissionStatus.ToSubmit) {
            initialState = submission.status;
            submission.status = SubmissionStatus.Blocked;
        }
        else if (submission.status == SubmissionStatus.Blocked) {
            initialState = submission.status;
            submission.status = SubmissionStatus.ToSubmit;
        }
        if (initialState) {
            this.client.saveSubmission(submission, this.form).subscribe(function () {
                _this.onFilterChanged();
            }, function (err) {
                submission.status = initialState;
            });
        }
        return false;
    };
    FormReview = form_review___decorate([
        form_review___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'form-review',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\form-review\form-review.html"*/'<ion-header style="background-color: transparent;">\n\n	<ion-navbar color="orange">\n\n		<ion-buttons start>\n\n			<button ion-button>\n\n				<ion-icon name="back"></ion-icon>\n\n			</button>\n\n		</ion-buttons>\n\n		<ion-title>{{form.name}}</ion-title>\n\n		<ion-buttons end>\n\n			<button ion-button (click)="sync()" [disabled]="syncing || !hasSubmissionsToSend">\n\n				<ion-icon name="cloud-upload" class="sync-submissions"></ion-icon>\n\n			</button>\n\n		</ion-buttons>\n\n	</ion-navbar>\n\n	<ion-grid style="background-color: white;">\n\n		<ion-row>\n\n			<ion-col>\n\n				<h4>Touch an entry to edit. Check red to skip upload</h4>\n\n			</ion-col>\n\n		</ion-row>\n\n		<ion-row>\n\n			<ion-col>\n\n				<ion-segment [(ngModel)]="filter"  (ionChange)="onFilterChanged()" color="dark" class="segment">\n\n					<ion-segment-button value="" class="all" >\n\n						All\n\n					</ion-segment-button>\n\n					<ion-segment-button value="1"class="all" >\n\n						Submitted\n\n					</ion-segment-button>\n\n					<ion-segment-button value="2" class="all">\n\n						On Hold\n\n					</ion-segment-button>\n\n					<ion-segment-button value="3" class="all">\n\n						Blocked\n\n					</ion-segment-button>\n\n				</ion-segment>\n\n			</ion-col>\n\n		</ion-row>\n\n	</ion-grid>\n\n</ion-header>\n\n\n\n<ion-content class="form-summary">\n\n	<div [hidden]="filteredSubmissions.length == 0">\n\n		<!-- [virtualScroll]="filteredSubmissions" approxItemHeight="84px"-->\n\n		<ion-list >\n\n			<ion-item *ngFor="let submission of filteredSubmissions" (click)="goToEntry(submission)">\n\n				<h1>{{submission.first_name + " " + submission.last_name}}</h1>\n\n				<h2>{{submission.company }}</h2>\n\n				<h2>{{submission.email}}</h2>\n\n				<h2>{{submission.telephone}}</h2>\n\n				<button ion-button item-right icon-only clear (click)="statusClick($event, submission)" [disabled]="syncing">\n\n					<ion-icon name="checkmark-circle" [color]="getColor(submission)"></ion-icon>\n\n				</button>\n\n			</ion-item>\n\n		</ion-list>\n\n	</div>\n\n	<!--ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n\n		<ion-infinite-scroll-content></ion-infinite-scroll-content>\n\n	</ion-infinite-scroll-->\n\n</ion-content>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\form-review\form-review.html"*/
        }),
        form_review___metadata("design:paramtypes", [form_review___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */],
            form_review___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavParams */],
            business_service_BussinessClient,
            form_review___WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"],
            sync_client_SyncClient,
            form_review___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ToastController */]])
    ], FormReview);
    return FormReview;
}());

//# sourceMappingURL=form-review.js.map
// CONCATENATED MODULE: ./src/views/form-review/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/pipes/form-control-pipe.ts
/* harmony import */ var form_control_pipe___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var form_control_pipe___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var FormControlPipe = (function () {
    function FormControlPipe() {
    }
    FormControlPipe.prototype.transform = function (array, args) {
        var arr = array.filter(function (value) {
            return !value.archive_date || new Date(value.archive_date) > new Date();
        }).sort(function (a, b) {
            var dateA = new Date(a.updated_at);
            var dateB = new Date(b.updated_at);
            if (dateA < dateB) {
                return 1;
            }
            else if (dateA > dateB) {
                return -1;
            }
            else {
                return 0;
            }
        });
        return arr;
    };
    FormControlPipe = form_control_pipe___decorate([
        form_control_pipe___WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"]({
            name: "formControl"
        })
    ], FormControlPipe);
    return FormControlPipe;
}());

//# sourceMappingURL=form-control-pipe.js.map
// CONCATENATED MODULE: ./src/views/forms/forms.ts
/* harmony import */ var forms___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_animations__ = __webpack_require__(26);
/* harmony import */ var forms___WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
var forms___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var forms___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var forms_Forms = (function () {
    function Forms(navCtrl, navParams, client, zone, actionCtrl, syncClient) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.client = client;
        this.zone = zone;
        this.actionCtrl = actionCtrl;
        this.syncClient = syncClient;
        this.searchMode = false;
        this.searchTrigger = "hidden";
        this.forms = [];
        this.filteredForms = [];
        this.filterPipe = new FormControlPipe();
    }
    Forms.prototype.doRefresh = function (refresher) {
        var _this = this;
        this.client.getForms().subscribe(function (forms) {
            _this.zone.run(function () {
                _this.forms = _this.filterPipe.transform(forms, "");
                _this.getItems({ target: { value: "" } });
            });
        });
    };
    Forms.prototype.toggleSearch = function () {
        var _this = this;
        this.searchMode = !this.searchMode;
        this.searchTrigger = this.searchMode ? "visible" : "hidden";
        if (this.searchMode) {
            setTimeout(function () {
                _this.searchbar.setFocus();
            }, 100);
        }
    };
    Forms.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        this.client.getForms().subscribe(function (forms) {
            _this.forms = _this.forms.concat(forms);
            if (infiniteScroll) {
                infiniteScroll.complete();
            }
        });
    };
    Forms.prototype.sync = function () {
        this.client.getUpdates().subscribe(function () { });
    };
    Forms.prototype.getItems = function (event) {
        var val = event.target.value;
        var regexp = new RegExp(val, "i");
        this.filteredForms = [].concat(this.forms.filter(function (form) {
            return !val || regexp.test(form.name);
        }));
    };
    Forms.prototype.presentActionSheet = function (form) {
        var _this = this;
        var actionSheet = this.actionCtrl.create({
            title: form.name,
            buttons: [
                {
                    text: 'Capture',
                    icon: "magnet",
                    handler: function () {
                        //console.log('capture clicked');
                        _this.navCtrl.push(form_capture_FormCapture, { form: form });
                    }
                }, {
                    text: 'Review Submissions',
                    icon: "eye",
                    handler: function () {
                        //console.log('review clicked');
                        _this.navCtrl.push(form_review_FormReview, { form: form, isDispatch: false });
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        //console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    };
    Forms.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.doRefresh();
        this.sub = this.syncClient.entitySynced.subscribe(function (type) {
            if (type == "Forms" || type == "Submissions") {
                _this.doRefresh();
            }
        });
    };
    Forms.prototype.ionViewDidLeave = function () {
        this.sub.unsubscribe();
    };
    forms___decorate([
        forms___WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"]("search"),
        forms___metadata("design:type", forms___WEBPACK_IMPORTED_MODULE_2_ionic_angular__["o" /* Searchbar */])
    ], Forms.prototype, "searchbar", void 0);
    Forms = forms___decorate([
        forms___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'forms',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\forms\forms.html"*/'<ion-header>\n\n	<ion-navbar color="orange">\n\n		<button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n		<ion-title>Forms</ion-title>\n\n		<ion-buttons end>\n\n			<button ion-button (click)="sync()" class="larger" >\n\n				<ion-icon name="sync"></ion-icon>\n\n			</button>\n\n			<button ion-button (click)="toggleSearch()" class="larger" [class.search]="searchMode">\n\n        <ion-icon name="search"></ion-icon>\n\n      </button>\n\n		</ion-buttons>\n\n	</ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="forms">\n\n	<ion-searchbar #search (ionInput)="getItems($event)" *ngIf="searchMode" [@visibleTrigger]="searchTrigger"></ion-searchbar>\n\n	<ion-list approxItemHeight="77px">\n\n		<a ion-item detail-none (click)="presentActionSheet(form)" *ngFor="let form of filteredForms">\n\n			<h1>{{form.name}}</h1>\n\n			<h2>{{form.total_submissions}} Entries &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span ion-text color="secondary">{{form.total_sent}} Sent</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-danger" *ngIf="form.total_hold > 0">{{form.total_hold}} Unsent</span></h2>\n\n		</a>\n\n	</ion-list>\n\n	<!--ion-refresher (ionRefresh)="doRefresh($event)">\n\n		<ion-refresher-content pull-max="200"></ion-refresher-content>\n\n	</ion-refresher>\n\n	<ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n\n		<ion-infinite-scroll-content></ion-infinite-scroll-content>\n\n	</ion-infinite-scroll-->\n\n</ion-content>\n\n'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\forms\forms.html"*/,
            animations: [
                // Define an animation that adjusts the opactiy when a new item is created
                //  in the DOM. We use the 'visible' string as the hard-coded value in the 
                //  trigger.
                //
                // When an item is added we wait for 300ms, and then increase the opacity to 1
                //  over a 200ms time interval. When the item is removed we don't delay anything
                //  and use a 200ms interval.
                //
                __WEBPACK_IMPORTED_MODULE_1__angular_animations__["j" /* trigger */]('visibleTrigger', [
                    __WEBPACK_IMPORTED_MODULE_1__angular_animations__["g" /* state */]('visible', __WEBPACK_IMPORTED_MODULE_1__angular_animations__["h" /* style */]({ opacity: '1', height: '5.8rem' })),
                    __WEBPACK_IMPORTED_MODULE_1__angular_animations__["g" /* state */]('hidden', __WEBPACK_IMPORTED_MODULE_1__angular_animations__["h" /* style */]({ opacity: '0', height: '0' })),
                    __WEBPACK_IMPORTED_MODULE_1__angular_animations__["i" /* transition */]('visible => hidden', [__WEBPACK_IMPORTED_MODULE_1__angular_animations__["e" /* animate */]('300ms 200ms')]),
                    __WEBPACK_IMPORTED_MODULE_1__angular_animations__["i" /* transition */]('hidden => visible', [__WEBPACK_IMPORTED_MODULE_1__angular_animations__["e" /* animate */]('300ms 100ms')])
                ]),
                __WEBPACK_IMPORTED_MODULE_1__angular_animations__["j" /* trigger */]('loadingTrigger', [
                    __WEBPACK_IMPORTED_MODULE_1__angular_animations__["g" /* state */]('visible', __WEBPACK_IMPORTED_MODULE_1__angular_animations__["h" /* style */]({ transform: 'translateY(256px)' })),
                    __WEBPACK_IMPORTED_MODULE_1__angular_animations__["g" /* state */]('hidden', __WEBPACK_IMPORTED_MODULE_1__angular_animations__["h" /* style */]({ transform: 'translateY(300px)' })),
                    __WEBPACK_IMPORTED_MODULE_1__angular_animations__["i" /* transition */]('visible => hidden', [__WEBPACK_IMPORTED_MODULE_1__angular_animations__["e" /* animate */]('300ms 200ms')]),
                    __WEBPACK_IMPORTED_MODULE_1__angular_animations__["i" /* transition */]('hidden => visible', [__WEBPACK_IMPORTED_MODULE_1__angular_animations__["e" /* animate */]('300ms 100ms')])
                ])
            ]
        }),
        forms___metadata("design:paramtypes", [forms___WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* NavController */],
            forms___WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* NavParams */],
            business_service_BussinessClient,
            forms___WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"],
            forms___WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* ActionSheetController */],
            sync_client_SyncClient])
    ], Forms);
    return Forms;
}());

//# sourceMappingURL=forms.js.map
// CONCATENATED MODULE: ./src/views/forms/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/services/log-client.ts
/* harmony import */ var log_client___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var log_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(15);
/* harmony import */ var log_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(log_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);
var log_client___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var log_client___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var log_client_LogClient = (function () {
    function LogClient() {
        this.logs = [];
        this.consoleHandler = window.console;
        var c = "console";
        window[c] = this.makeConsole();
        this.logSource = new log_client___WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["BehaviorSubject"](null);
        this.log = this.logSource.asObservable();
    }
    LogClient.prototype.getLogs = function () {
        return this.logs;
    };
    LogClient.prototype.makeConsole = function () {
        return {
            log: Util.proxy(function (message) {
                this.logEntry(arguments, LogSeverity.LOG);
            }, this),
            error: Util.proxy(function (message) {
                this.logEntry(arguments, LogSeverity.ERROR);
            }, this),
            info: Util.proxy(function (message) {
                this.logEntry(arguments, LogSeverity.INFO);
            }, this),
            warn: Util.proxy(function (message) {
                this.logEntry(arguments, LogSeverity.WARN);
            }, this)
        };
    };
    LogClient.prototype.logEntry = function (messages, severity) {
        this.consoleHandler[severity.name].apply(this.consoleHandler, messages);
        var message = messages[0];
        if (typeof (message) == "object") {
            var cache = [];
            message = JSON.stringify(message, function (key, value) {
                if (value instanceof Date) {
                    if (!value.toISOString) {
                        return "<DATE>";
                    }
                    return value;
                }
                if (typeof value === 'object' && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        return "<CIRCULAR_REF>";
                    }
                    cache.push(value);
                }
                return value;
            }, 2);
            cache = null;
        }
        this.logs.push(new LogEntry(message, severity));
        this.logSource.next(this.logs[this.logs.length - 1]);
    };
    LogClient = log_client___decorate([
        log_client___WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"](),
        log_client___metadata("design:paramtypes", [])
    ], LogClient);
    return LogClient;
}());

var LogEntry = (function () {
    function LogEntry(message, severity) {
        this.message = message;
        this.severity = severity;
        this.date = new Date();
    }
    return LogEntry;
}());

var LogSeverity = (function () {
    function LogSeverity(name) {
        this.name = name;
    }
    LogSeverity.WARN = new LogSeverity("warn");
    LogSeverity.LOG = new LogSeverity("log");
    LogSeverity.INFO = new LogSeverity("info");
    LogSeverity.ERROR = new LogSeverity("error");
    return LogSeverity;
}());

//# sourceMappingURL=log-client.js.map
// CONCATENATED MODULE: ./src/views/log/log.ts
/* harmony import */ var log___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var log___WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_clipboard__ = __webpack_require__(103);
var log___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var log___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var log_LogView = (function () {
    function LogView(logClient, zone, viewCtrl, clipboard) {
        this.logClient = logClient;
        this.zone = zone;
        this.viewCtrl = viewCtrl;
        this.clipboard = clipboard;
    }
    LogView.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.sub = this.logClient.log.subscribe(function (logEntry) {
            _this.logs = _this.logClient.getLogs();
        });
    };
    LogView.prototype.ionViewDidLeave = function () {
        this.sub.unsubscribe();
        this.sub = null;
    };
    LogView.prototype.getColor = function (log) {
        if (log.severity == LogSeverity.ERROR) {
            return "danger";
        }
        else if (log.severity == LogSeverity.INFO) {
            return "primary";
        }
        else if (log.severity == LogSeverity.LOG) {
            return "primary";
        }
        else if (log.severity == LogSeverity.WARN) {
            return "orange";
        }
        return "";
    };
    LogView.prototype.getIcon = function (log) {
        if (log.severity == LogSeverity.ERROR) {
            return "bug";
        }
        else if (log.severity == LogSeverity.INFO) {
            return "information-circle";
        }
        else if (log.severity == LogSeverity.LOG) {
            return "information-circle";
        }
        else if (log.severity == LogSeverity.WARN) {
            return "warning";
        }
        return "";
    };
    LogView.prototype.cancel = function () {
        this.viewCtrl.dismiss(null);
    };
    LogView.prototype.done = function () {
        this.viewCtrl.dismiss(null);
    };
    LogView.prototype.copy = function () {
        var result = "";
        this.logs.forEach(function (log) {
            result += "[" + log.severity.name + "] - " + log.message + "\n\n";
        });
        this.clipboard.copy(result)
            .then(function (data) {
        })
            .catch(function (err) {
            console.error(err);
        });
    };
    LogView = log___decorate([
        log___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'log',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\log\log.html"*/'<ion-header>\n\n	<ion-navbar>\n\n		<ion-title>Logs</ion-title>\n\n		<ion-buttons end>\n\n			<button ion-button (click)="done()">\n\n				<ion-icon name="close" class="capture" color="orange"></ion-icon>\n\n			</button>\n\n		</ion-buttons>\n\n	</ion-navbar>\n\n</ion-header>\n\n<ion-content class="log">\n\n	<ion-list>\n\n		<ion-item *ngFor="let log of logs" (click)="log.style = !log.style">\n\n			<ion-icon [color]="getColor(log)" [name]="getIcon(log)"></ion-icon>\n\n			<ion-label [class.showAll]="!!log.style" [color]="getColor(log)">{{log.message}}</ion-label>\n\n		</ion-item>\n\n	</ion-list>\n\n</ion-content>\n\n<ion-footer>\n\n  <ion-toolbar>\n\n    <ion-buttons class="text-center">\n\n			<button ion-button (click)="copy()">\n\n				<ion-icon name="copy" class="capture smaller" color="orange"></ion-icon>\n\n			</button>\n\n		</ion-buttons>\n\n  </ion-toolbar>\n\n</ion-footer>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\log\log.html"*/
        }),
        log___metadata("design:paramtypes", [log_client_LogClient,
            log___WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"],
            log___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_clipboard__["a" /* Clipboard */]])
    ], LogView);
    return LogView;
}());

//# sourceMappingURL=log.js.map
// CONCATENATED MODULE: ./src/views/log/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/views/settings/settings.ts
/* harmony import */ var settings___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var settings___WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_app_version__ = __webpack_require__(102);
var settings___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var settings___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var settings_Settings = (function () {
    function Settings(navCtrl, navParams, db, client, alertCtrl, modalCtrl, appVersion) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.db = db;
        this.client = client;
        this.alertCtrl = alertCtrl;
        this.modalCtrl = modalCtrl;
        this.appVersion = appVersion;
        this.settings = {};
        this.user = {};
        this.shouldSave = false;
        this.appVersion.getVersionNumber().then(function (version) {
            _this.version = version;
        });
    }
    Settings.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.db.getAllConfig().subscribe(function (settings) {
            _this.settings = settings;
            _this.db.getRegistration().subscribe(function (user) {
                _this.user = user;
                _this.shouldSave = false;
            });
        });
    };
    Settings.prototype.showLogs = function () {
        var modal = this.modalCtrl.create(log_LogView);
        modal.present();
    };
    Settings.prototype.onChange = function () {
        var _this = this;
        this.shouldSave = true;
        setTimeout(function () {
            _this.saveSettings();
        }, 1);
    };
    Settings.prototype.saveSettings = function () {
        var _this = this;
        this.db.saveConfig("autoUpload", this.settings.autoUpload).subscribe(function () {
            _this.db.saveConfig("enableLogging", _this.settings.enableLogging).subscribe(function () {
                _this.db.saveConfig("kioskModePassword", _this.settings.kioskModePassword).subscribe(function () {
                    _this.shouldSave = false;
                });
            });
        });
    };
    Settings.prototype.sync = function () {
        this.client.getUpdates().subscribe(function () { });
    };
    Settings.prototype.unauthenticate = function () {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: 'Unauthenticate?',
            message: 'Are you sure you want to unauthenticate this device?',
            buttons: [
                {
                    text: 'Cancel',
                    handler: function () {
                    }
                },
                {
                    text: 'Unauthenticate',
                    handler: function () {
                        _this.client.unregister(_this.user).subscribe(function () {
                            _this.user = {};
                            setTimeout(function () {
                                _this.navCtrl.setRoot(login_Login);
                            }, 300);
                        });
                    }
                }
            ]
        });
        confirm.present();
    };
    Settings = settings___decorate([
        settings___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'settings',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\settings\settings.html"*/'<ion-header>\n\n	<ion-navbar color="orange">\n\n		<button ion-button menuToggle>\n\n      		<ion-icon name="menu"></ion-icon>\n\n    	</button>\n\n		<ion-title>Settings</ion-title>\n\n		<ion-buttons end class="hide">\n\n			<button ion-button [disabled]="!shouldSave" (click)="saveSettings()">\n\n				<ion-icon name="checkmark"></ion-icon>\n\n			</button>\n\n		</ion-buttons>\n\n	</ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="settings">\n\n	<ion-list>\n\n		<ion-list-header>\n\n			Organization\n\n		</ion-list-header>\n\n		<ion-item>\n\n			<ion-label>Name</ion-label>\n\n			<ion-label class="align-right">{{user.customer_name}}</ion-label>\n\n		</ion-item>\n\n		<ion-item>\n\n			<ion-label>Key</ion-label>\n\n			<ion-label class="align-right"></ion-label>\n\n		</ion-item>\n\n		<ion-item class="last">\n\n			<ion-label>Operator</ion-label>\n\n			<ion-label class="align-right">{{user.first_name + " " + user.last_name}}</ion-label>\n\n		</ion-item>\n\n		<ion-list-header>\n\n			Operations\n\n		</ion-list-header>\n\n		<ion-item class="last">\n\n			<ion-label>Automatic Upload</ion-label>\n\n			<ion-toggle [(ngModel)]="settings.autoUpload" (ionChange)="onChange()" checked="false"></ion-toggle>\n\n		</ion-item>\n\n		<ion-list-header>\n\n			Kiosk Mode\n\n		</ion-list-header>\n\n		<ion-item class="last">\n\n			<ion-label>Pass code</ion-label>\n\n			<ion-input type="password" class="align-right" [(ngModel)]="settings.kioskModePassword" (ionChange)="onChange()"></ion-input>\n\n		</ion-item>\n\n		<ion-list-header>\n\n			Diagnostics\n\n		</ion-list-header>\n\n		<ion-item>\n\n			<ion-label>App version</ion-label>\n\n			<ion-label class="align-right">{{version}}</ion-label>\n\n		</ion-item>\n\n		<ion-item class="last">\n\n			<ion-label>Enable logging</ion-label>\n\n			<ion-toggle [(ngModel)]="settings.enableLogging" (ionChange)="onChange()" checked="false"></ion-toggle>\n\n		</ion-item>\n\n		<ion-item>\n\n			<button ion-button full large color="light" (click)="showLogs()">View log</button>\n\n		</ion-item>\n\n		<ion-item>\n\n			<button ion-button full large color="danger" (click)="unauthenticate()">Unauthenticate Device</button>\n\n		</ion-item>\n\n	</ion-list>\n\n\n\n</ion-content>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\settings\settings.html"*/
        }),
        settings___metadata("design:paramtypes", [settings___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */],
            settings___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavParams */],
            db_client_DBClient,
            business_service_BussinessClient,
            settings___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            settings___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_app_version__["a" /* AppVersion */]])
    ], Settings);
    return Settings;
}());

//# sourceMappingURL=settings.js.map
// CONCATENATED MODULE: ./src/views/settings/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/components/ion-pullup/ion-pullup.ts
/* harmony import */ var ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular_gestures_gesture__ = __webpack_require__(68);
/* harmony import */ var ion_pullup___WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/*
ionic-pullup v2 for Ionic/Angular 2
 
Copyright 2016 Ariel Faur (https://github.com/arielfaur)
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var ion_pullup___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ion_pullup___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var IonPullUpFooterState;
(function (IonPullUpFooterState) {
    IonPullUpFooterState[IonPullUpFooterState["Collapsed"] = 0] = "Collapsed";
    IonPullUpFooterState[IonPullUpFooterState["Expanded"] = 1] = "Expanded";
    IonPullUpFooterState[IonPullUpFooterState["Minimized"] = 2] = "Minimized";
})(IonPullUpFooterState || (IonPullUpFooterState = {}));
var IonPullUpFooterBehavior;
(function (IonPullUpFooterBehavior) {
    IonPullUpFooterBehavior[IonPullUpFooterBehavior["Hide"] = 0] = "Hide";
    IonPullUpFooterBehavior[IonPullUpFooterBehavior["Expand"] = 1] = "Expand";
})(IonPullUpFooterBehavior || (IonPullUpFooterBehavior = {}));
var IonPullUpComponent = (function () {
    function IonPullUpComponent(platform, el, renderer) {
        this.platform = platform;
        this.el = el;
        this.renderer = renderer;
        this.stateChange = new ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.onExpand = new ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.onCollapse = new ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.onMinimize = new ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.pop = false;
        this._footerMeta = {
            height: 0,
            posY: 0,
            lastPosY: 0
        };
        this._currentViewMeta = {};
        this.state = IonPullUpFooterState.Minimized;
        // sets initial state
        this.initialState = this.initialState || IonPullUpFooterState.Minimized;
        this.defaultBehavior = this.defaultBehavior || IonPullUpFooterBehavior.Expand;
        this.maxHeight = this.maxHeight || 0;
    }
    IonPullUpComponent.prototype.ngOnChanges = function (changes) {
        if (changes['pop']) {
        }
    };
    IonPullUpComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.addEventListener("orientationchange", function () {
            console.info('Changed orientation => updating');
            _this.updateUI();
        });
        this.platform.resume.subscribe(function () {
            console.info('Resumed from background => updating');
            _this.updateUI();
        });
        /*window.addEventListener("resume", () => {
            this.updateUI();
        });*/
    };
    IonPullUpComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.computeDefaults();
        // TODO: test with tabs template (if it is a valid use case at all)
        /*if (this._currentViewMeta.tabs && this._currentViewMeta.hasBottomTabs) {
          this.renderer.setElementStyle(this.el.nativeElement, 'bottom', this._currentViewMeta.tabsHeight + 'px');
        }*/
        var barGesture = new __WEBPACK_IMPORTED_MODULE_1_ionic_angular_gestures_gesture__["a" /* Gesture */](this.childToolbar.getElementRef().nativeElement);
        barGesture.listen();
        barGesture.on('tap', function (e) {
            _this.onTap(e);
        });
        barGesture.on('pan panstart panend', function (e) {
            _this.onDrag(e);
        });
        this.state = IonPullUpFooterState.Minimized;
        this.updateUI(true); // need to indicate whether it's first run to avoid emitting events twice due to change detection
    };
    Object.defineProperty(IonPullUpComponent.prototype, "expandedHeight", {
        get: function () {
            return window.innerHeight - this._currentViewMeta.headerHeight; // - this._currentViewMeta.tabsHeight; 
        },
        enumerable: true,
        configurable: true
    });
    IonPullUpComponent.prototype.computeDefaults = function () {
        this._footerMeta.defaultHeight = this.childFooter.nativeElement.offsetHeight;
        // TODO: still need to test with tabs template (not convinced it is a valid use case...)
        //this._currentViewMeta.tabs = this.el.nativeElement.closest('ion-tabs');
        //this._currentViewMeta.hasBottomTabs = this._currentViewMeta.tabs && this._currentViewMeta.tabs.classList.contains('tabs-bottom');
        //this._currentViewMeta.tabsHeight = this._currentViewMeta.tabs ? (<HTMLElement> this._currentViewMeta.tabs.querySelector('ion-tabbar-section')).offsetHeight : 0;
        this._currentViewMeta.header = document.querySelector('ion-navbar.toolbar');
        this._currentViewMeta.headerHeight = this._currentViewMeta.header ? this._currentViewMeta.header.offsetHeight : 0;
    };
    IonPullUpComponent.prototype.computeHeights = function (isInit) {
        if (isInit === void 0) { isInit = false; }
        this._footerMeta.height = this.maxHeight > 0 ? this.maxHeight : this.expandedHeight;
        this.renderer.setElementStyle(this.childFooter.nativeElement, 'height', this._footerMeta.height + 'px');
        // TODO: implement minimize mode
        //this.renderer.setElementStyle(this.el.nativeElement, 'min-height', this._footerMeta.height + 'px'); 
        //if (this.initialState == IonPullUpFooterState.Minimized) {
        //  this.minimize()  
        //} else {
        if (this.state == IonPullUpFooterState.Minimized) {
            this.minimize();
        }
        else {
            this.collapse(isInit);
        }
        //} 
    };
    IonPullUpComponent.prototype.updateUI = function (isInit) {
        var _this = this;
        if (isInit === void 0) { isInit = false; }
        setTimeout(function () {
            _this.computeHeights(isInit);
        }, 300);
        this.renderer.setElementStyle(this.childFooter.nativeElement, 'transition', 'none'); // avoids flickering when changing orientation
    };
    IonPullUpComponent.prototype.expand = function () {
        this._footerMeta.lastPosY = 0;
        this.renderer.setElementStyle(this.childFooter.nativeElement, '-webkit-transform', 'translate3d(0, 0, 0)');
        this.renderer.setElementStyle(this.childFooter.nativeElement, 'transform', 'translate3d(0, 0, 0)');
        this.renderer.setElementStyle(this.childFooter.nativeElement, 'transition', '300ms ease-in-out');
        this.onExpand.emit(null);
    };
    IonPullUpComponent.prototype.collapse = function (isInit) {
        if (isInit === void 0) { isInit = false; }
        this._footerMeta.lastPosY = this._footerMeta.height - this._footerMeta.defaultHeight;
        this.renderer.setElementStyle(this.childFooter.nativeElement, '-webkit-transform', 'translate3d(0, ' + this._footerMeta.lastPosY + 'px, 0)');
        this.renderer.setElementStyle(this.childFooter.nativeElement, 'transform', 'translate3d(0, ' + this._footerMeta.lastPosY + 'px, 0)');
        if (!isInit)
            this.onCollapse.emit(null);
    };
    IonPullUpComponent.prototype.minimize = function () {
        this._footerMeta.lastPosY = this._footerMeta.height;
        this.renderer.setElementStyle(this.childFooter.nativeElement, '-webkit-transform', 'translate3d(0, ' + this._footerMeta.lastPosY + 'px, 0)');
        this.renderer.setElementStyle(this.childFooter.nativeElement, 'transform', 'translate3d(0, ' + this._footerMeta.lastPosY + 'px, 0)');
        this.onMinimize.emit(null);
    };
    IonPullUpComponent.prototype.onTap = function (e) {
        e.preventDefault();
        if (this.state == IonPullUpFooterState.Collapsed) {
            if (this.defaultBehavior == IonPullUpFooterBehavior.Hide)
                this.state = IonPullUpFooterState.Minimized;
            else
                this.state = IonPullUpFooterState.Expanded;
        }
        else {
            if (this.state == IonPullUpFooterState.Minimized) {
                if (this.defaultBehavior == IonPullUpFooterBehavior.Hide)
                    this.state = IonPullUpFooterState.Collapsed;
                else
                    this.state = IonPullUpFooterState.Expanded;
            }
            else {
                // footer is expanded
                this.state = IonPullUpFooterState.Collapsed;
            }
        }
    };
    IonPullUpComponent.prototype.onDrag = function (e) {
        e.preventDefault();
        switch (e.type) {
            case 'panstart':
                this.renderer.setElementStyle(this.childFooter.nativeElement, 'transition', 'none');
                break;
            case 'pan':
                this._footerMeta.posY = Math.round(e.deltaY) + this._footerMeta.lastPosY;
                if (this._footerMeta.posY < 0 || this._footerMeta.posY > this._footerMeta.height)
                    return;
                this.renderer.setElementStyle(this.childFooter.nativeElement, '-webkit-transform', 'translate3d(0, ' + this._footerMeta.posY + 'px, 0)');
                this.renderer.setElementStyle(this.childFooter.nativeElement, 'transform', 'translate3d(0, ' + this._footerMeta.posY + 'px, 0)');
                break;
            case 'panend':
                this.renderer.setElementStyle(this.childFooter.nativeElement, 'transition', '300ms ease-in-out');
                if (this._footerMeta.lastPosY > this._footerMeta.posY) {
                    this.state = IonPullUpFooterState.Expanded;
                }
                else if (this._footerMeta.lastPosY < this._footerMeta.posY) {
                    this.state = (this.initialState == IonPullUpFooterState.Minimized) ? IonPullUpFooterState.Minimized : IonPullUpFooterState.Collapsed;
                }
                break;
        }
    };
    IonPullUpComponent.prototype.ngDoCheck = function () {
        var _this = this;
        if (!Object.is(this.state, this._oldState)) {
            switch (this.state) {
                case IonPullUpFooterState.Collapsed:
                    this.collapse();
                    break;
                case IonPullUpFooterState.Expanded:
                    this.expand();
                    break;
                case IonPullUpFooterState.Minimized:
                    this.minimize();
                    break;
            }
            this._oldState = this.state;
            // TODO: fix hack due to BUG (https://github.com/angular/angular/issues/6005)
            window.setTimeout(function () {
                _this.stateChange.emit(_this.state);
            });
        }
    };
    ion_pullup___decorate([
        ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        ion_pullup___metadata("design:type", Number)
    ], IonPullUpComponent.prototype, "state", void 0);
    ion_pullup___decorate([
        ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"](),
        ion_pullup___metadata("design:type", ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
    ], IonPullUpComponent.prototype, "stateChange", void 0);
    ion_pullup___decorate([
        ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        ion_pullup___metadata("design:type", Number)
    ], IonPullUpComponent.prototype, "initialState", void 0);
    ion_pullup___decorate([
        ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        ion_pullup___metadata("design:type", Number)
    ], IonPullUpComponent.prototype, "defaultBehavior", void 0);
    ion_pullup___decorate([
        ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        ion_pullup___metadata("design:type", Number)
    ], IonPullUpComponent.prototype, "maxHeight", void 0);
    ion_pullup___decorate([
        ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"](),
        ion_pullup___metadata("design:type", Object)
    ], IonPullUpComponent.prototype, "onExpand", void 0);
    ion_pullup___decorate([
        ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"](),
        ion_pullup___metadata("design:type", Object)
    ], IonPullUpComponent.prototype, "onCollapse", void 0);
    ion_pullup___decorate([
        ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"](),
        ion_pullup___metadata("design:type", Object)
    ], IonPullUpComponent.prototype, "onMinimize", void 0);
    ion_pullup___decorate([
        ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChild"]('toolbar'),
        ion_pullup___metadata("design:type", Object)
    ], IonPullUpComponent.prototype, "childToolbar", void 0);
    ion_pullup___decorate([
        ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"]('footer'),
        ion_pullup___metadata("design:type", Object)
    ], IonPullUpComponent.prototype, "childFooter", void 0);
    ion_pullup___decorate([
        ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        ion_pullup___metadata("design:type", Boolean)
    ], IonPullUpComponent.prototype, "pop", void 0);
    IonPullUpComponent = ion_pullup___decorate([
        ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'ion-pullup',
            changeDetection: ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush,
            template: "\n    <ion-footer #footer>\n      <ng-content></ng-content>\n    </ion-footer>\n    "
        }),
        ion_pullup___metadata("design:paramtypes", [ion_pullup___WEBPACK_IMPORTED_MODULE_2_ionic_angular__["n" /* Platform */], ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], ion_pullup___WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"]])
    ], IonPullUpComponent);
    return IonPullUpComponent;
}());

//# sourceMappingURL=ion-pullup.js.map
// CONCATENATED MODULE: ./src/components/ion-pullup/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/views/main/main.ts
/* harmony import */ var main___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var main___WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
var main___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var main___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var main_Main = (function () {
    function Main(navCtrl, navParams, client, syncClient) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.client = client;
        this.syncClient = syncClient;
        this.rootPage = forms_Forms;
        this.user = new User();
        this.uploading = true;
        this.loadingTrigger = false;
        this.statuses = [];
        this.pages = [
            /*{ title: 'Home', component: Dashboard, icon: "home" },*/
            { title: 'Forms', component: forms_Forms, icon: "document" },
            //{ title: 'Dispatches', component: Dispatches, icon: "megaphone" },
            { title: 'Settings', component: settings_Settings, icon: "cog" }
        ];
    }
    Main.prototype.openPage = function (page) {
        this.nav.setRoot(page.component);
    };
    Main.prototype.ngOnInit = function () {
        var _this = this;
        this.client.getRegistration().subscribe(function (user) {
            _this.user = user;
            _this.client.setupNotifications();
        });
    };
    Main.prototype.footerExpanded = function () {
    };
    Main.prototype.footerCollapsed = function () {
    };
    Main.prototype.ionViewDidEnter = function () {
        var _this = this;
        if (this.syncClient.isSyncing) {
            this.pullup.collapse();
            this.statuses = this.syncClient.getLastSync();
            this.currentSyncForm = this.getCurrentUploadingForm();
        }
        this.sub = this.handleSync();
        window["TesseractPlugin"] && TesseractPlugin.loadLanguage("eng", function (response) {
            console.log(response);
        }, function (reason) {
            console.error(reason);
        });
        this.client.getUpdates().subscribe(function (done) {
            setTimeout(function () {
                _this.client.doAutoSync();
            }, 350);
        }, function (err) {
            setTimeout(function () {
                _this.client.doAutoSync();
            }, 350);
        });
    };
    Main.prototype.handleSync = function () {
        var _this = this;
        return this.syncClient.onSync.subscribe(function (stats) {
            if (stats == null) {
                return;
            }
            _this.statuses = stats;
            //console.log(stats);
            _this.currentSyncForm = _this.getCurrentUploadingForm();
            if (_this.pullup.state == IonPullUpFooterState.Minimized) {
                _this.pullup.collapse();
            }
        }, function (err) {
            setTimeout(function () {
                _this.pullup.minimize();
                _this.sub.unsubscribe();
                _this.sub = _this.handleSync();
            }, 200);
        }, function () {
            setTimeout(function () {
                _this.pullup.minimize();
                _this.sub.unsubscribe();
                _this.sub = _this.handleSync();
            }, 300);
        });
    };
    Main.prototype.ionViewDidLeave = function () {
        this.sub.unsubscribe();
        this.sub = null;
    };
    Main.prototype.getCurrentUploadingForm = function () {
        if (this.statuses) {
            for (var i = 0; i < this.statuses.length; i++) {
                if (this.statuses[i].loading) {
                    return this.statuses[i].formName;
                }
            }
        }
        return "";
    };
    Main.prototype.getIcon = function (loading, complete) {
        if (loading) {
            return "refresh";
        }
        if (complete) {
            return "checkmark";
        }
        return "flag";
    };
    Main.prototype.getColor = function (loading, complete) {
        if (loading) {
            return "primary";
        }
        if (complete) {
            return "secondary";
        }
        return "orange";
    };
    Main.prototype.getStateLabel = function (loading, complete, formName) {
        if (loading) {
            return "Syncing " + formName;
        }
        if (complete) {
            return "Sync-ed " + formName;
        }
        return formName;
    };
    main___decorate([
        main___WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"](main___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Nav */]),
        main___metadata("design:type", main___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Nav */])
    ], Main.prototype, "nav", void 0);
    main___decorate([
        main___WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"]('pullup'),
        main___metadata("design:type", IonPullUpComponent)
    ], Main.prototype, "pullup", void 0);
    Main = main___decorate([
        main___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'main',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\main\main.html"*/'<ion-menu [content]="content">\n\n  <ion-content class="sidemenu">\n\n    <div class="profile">\n\n      <ion-item>\n\n      <ion-avatar item-left>\n\n        <img src="" *ngIf="!user.user_profile_picture"/>\n\n		<img [src]="user.user_profile_picture" *ngIf="user.user_profile_picture"/>\n\n      </ion-avatar>\n\n	  <h1>Hi, {{user.first_name}}</h1>\n\n	  <h3>Welcome back</h3>\n\n      </ion-item>\n\n    </div>\n\n    <ion-list color="dark">\n\n      <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n\n        <ion-icon  item-left [name]="p.icon"></ion-icon>\n\n        {{p.title}}\n\n      </button>\n\n    </ion-list>\n\n  </ion-content>\n\n\n\n</ion-menu>\n\n\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>\n\n\n\n\n\n<ion-pullup #pullup maxHeight="300" (onExpand)="footerExpanded()" (onCollapse)="footerCollapsed()">\n\n	<ion-toolbar #toolbar class="sync-header" color="orange">\n\n		<ion-spinner></ion-spinner>\n\n		<div class="action">Syncing...</div>\n\n		<div class="element">{{currentSyncForm}}</div>\n\n	</ion-toolbar>\n\n	<ion-content class="sync-content">\n\n		<ion-list class="sync-list">\n\n			<ion-item *ngFor="let status of statuses">\n\n				<ion-icon [name]="getIcon(status.loading, status.complete)" [color]="getColor(status.loading, status.complete)"></ion-icon>\n\n				<h3>{{getStateLabel(status.loading, status.complete, status.formName)}}</h3>\n\n			</ion-item>\n\n		</ion-list>\n\n	</ion-content>\n\n</ion-pullup>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\main\main.html"*/
        }),
        main___metadata("design:paramtypes", [main___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */],
            main___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavParams */],
            business_service_BussinessClient,
            sync_client_SyncClient])
    ], Main);
    return Main;
}());

//# sourceMappingURL=main.js.map
// CONCATENATED MODULE: ./src/views/main/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/views/login/login.ts
/* harmony import */ var login___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var login___WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
var login___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var login___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var login_Login = (function () {
    function Login(navCtrl, navParams, client, loading, toast) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.client = client;
        this.loading = loading;
        this.toast = toast;
        this.doAuth = null;
        this.user = {};
    }
    Login.prototype.ngOnInit = function () {
        var _this = this;
        if (this.navParams.data.unauthorized == true) {
            this.doAuth = true;
            var toaster = this.toast.create({
                message: "Authorization failed. Please obtain a new Authentication Code",
                duration: 5000,
                position: "top",
                cssClass: "error"
            });
            toaster.present();
            return;
        }
        this.client.getRegistration()
            .subscribe(function (user) {
            if (!user) {
                _this.doAuth = true;
            }
            else {
                _this.doAuth = false;
                _this.user = user;
            }
        });
    };
    Login.prototype.onClick = function () {
        var _this = this;
        if (this.doAuth) {
            if (!this.authCode) {
                return;
            }
            var loader_1 = this.loading.create({
                content: "Authenticating..."
            });
            loader_1.present();
            this.client.authenticate(this.authCode).subscribe(function (data) {
                loader_1.setContent(data.message);
            }, function (err) {
                loader_1.dismiss();
                var toaster = _this.toast.create({
                    message: err,
                    duration: 5000,
                    position: "top",
                    cssClass: "error"
                });
                toaster.present();
            }, function () {
                loader_1.dismiss();
                _this.navCtrl.setRoot(main_Main);
            });
        }
        else {
            this.navCtrl.setRoot(main_Main);
        }
    };
    Login = login___decorate([
        login___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'login',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\login\login.html"*/'<ion-content scroll="false" class="login">\n\n	<div class="top-content row" *ngIf="doAuth == false">\n\n		<div class="col padding col-center">\n\n			<img [src]="user.customer_logo">\n\n		</div>\n\n	</div>\n\n	<div class="bottom-content row">\n\n		<div class="col col-center">\n\n			<form *ngIf="doAuth == true">\n\n				<ion-list padding>\n\n					<ion-item>\n\n						<ion-label class="tagline">Please contact your company administrator to obtain an Authentication Code.<br/>Enter your Authentication Code below.</ion-label>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-input type="text" name="authCode" required placeholder="Enter Authentication Code" [(ngModel)]="authCode"></ion-input>\n\n					</ion-item>\n\n					<ion-item>\n\n						<button ion-button full large color="orange" (click)="onClick()">\n\n              Authenticate\n\n            </button>\n\n					</ion-item>\n\n				</ion-list>\n\n			</form>\n\n      <ion-list padding *ngIf="doAuth == false">\n\n					<ion-item>\n\n						<button ion-button full large color="orange" (click)="onClick()">\n\n              Continue\n\n            </button>\n\n					</ion-item>\n\n      </ion-list>\n\n		</div>\n\n	</div>\n\n</ion-content>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\login\login.html"*/
        }),
        login___metadata("design:paramtypes", [login___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */],
            login___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavParams */],
            business_service_BussinessClient,
            login___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */],
            login___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ToastController */]])
    ], Login);
    return Login;
}());

//# sourceMappingURL=login.js.map
// CONCATENATED MODULE: ./src/views/login/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/app/app.component.ts
/* harmony import */ var app_component___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var app_component___WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_file__ = __webpack_require__(27);
var app_component___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var app_component___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};













var app_component_MyApp = (function () {
    function MyApp(platform, db, rest, client, sync, logClient, file, toast) {
        this.platform = platform;
        this.db = db;
        this.rest = rest;
        this.client = client;
        this.sync = sync;
        this.logClient = logClient;
        this.file = file;
        this.toast = toast;
        this.initializeApp();
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            console.log("ready!");
            _this.client.getRegistration(true).subscribe(function (user) {
                if (user) {
                    _this.nav.setRoot(main_Main);
                }
                else {
                    _this.nav.setRoot(login_Login);
                }
            });
            _this.hideSplashScreen();
            //StatusBar.hide();
            if (!window["cordova"]) {
                return;
            }
            //ensure folders exist
            _this.file.checkDir(cordova.file.dataDirectory, "leadliaison")
                .then(function (exists) {
                _this.file.checkDir(cordova.file.dataDirectory + "leadliaison/", "images")
                    .then(function (exists) {
                    console.log("Images folder present");
                }).catch(function (err) {
                    _this.file.createDir(cordova.file.dataDirectory + "leadliaison/", "images", true)
                        .then(function (ok) {
                        console.log("Created images folder");
                    }).catch(function (err) {
                        console.error("Can't create " + cordova.file.dataDirectory + "leadliaison" + ":\n" + JSON.stringify(err, null, 2));
                    });
                });
            }).catch(function (err) {
                _this.file.createDir(cordova.file.dataDirectory, "leadliaison", true)
                    .then(function (ok) {
                    _this.file.createDir(cordova.file.dataDirectory + "leadliaison/", "images", true)
                        .then(function (ok) {
                        console.log("Created images folder");
                    }).catch(function (err) {
                        console.error("Can't create " + cordova.file.dataDirectory + "leadliaison" + ":\n" + JSON.stringify(err, null, 2));
                    });
                }).catch(function (err) {
                    console.error("Can't create " + cordova.file.dataDirectory + "leadliaison" + ":\n" + JSON.stringify(err, null, 2));
                });
            });
        });
        this.rest.error.subscribe(function (resp) {
            if (resp && resp.status == 401) {
                _this.nav.setRoot(login_Login, { "unauthorized": true });
            }
        });
        this.client.error.subscribe(function (resp) {
            var toaster = _this.toast.create({
                message: resp,
                duration: 5000,
                position: "top",
                cssClass: "error"
            });
            toaster.present();
        });
        this.sync.error.subscribe(function (resp) {
            var toaster = _this.toast.create({
                message: resp,
                duration: 5000,
                position: "top",
                cssClass: "error"
            });
            toaster.present();
        });
    };
    MyApp.prototype.hideSplashScreen = function () {
        if (navigator && navigator["splashscreen"]) {
            setTimeout(function () {
                navigator["splashscreen"].hide();
            }, 200);
        }
    };
    app_component___decorate([
        app_component___WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"](app_component___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Nav */]),
        app_component___metadata("design:type", app_component___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = app_component___decorate([
        app_component___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            template: '<ion-nav #nav></ion-nav>'
        }),
        app_component___metadata("design:paramtypes", [app_component___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* Platform */],
            db_client_DBClient,
            rest_client_RESTClient,
            business_service_BussinessClient,
            sync_client_SyncClient,
            log_client_LogClient,
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_file__["a" /* File */],
            app_component___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ToastController */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map
// CONCATENATED MODULE: ./src/views/dashboard/dashboard.ts
/* harmony import */ var dashboard___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var dashboard___WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
var dashboard___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var dashboard___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var Dashboard = (function () {
    function Dashboard(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    Dashboard = dashboard___decorate([
        dashboard___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'dashboard',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\dashboard\dashboard.html"*/'<ion-header>\n\n  <ion-navbar color="orange">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Home</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <h3>Good things will happen here</h3>\n\n</ion-content>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\dashboard\dashboard.html"*/
        }),
        dashboard___metadata("design:paramtypes", [dashboard___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], dashboard___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavParams */]])
    ], Dashboard);
    return Dashboard;
}());

//# sourceMappingURL=dashboard.js.map
// CONCATENATED MODULE: ./src/views/dashboard/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/views/form-summary/form-summary.ts
/* harmony import */ var form_summary___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var form_summary___WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
var form_summary___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var form_summary___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var form_summary_FormSummary = (function () {
    function FormSummary(navCtrl, navParams, client, zone) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.client = client;
        this.zone = zone;
        this.form = new Form();
    }
    FormSummary.prototype.ionViewWillEnter = function () {
        this.form = this.navParams.get("form");
    };
    FormSummary.prototype.doRefresh = function (refresher) {
    };
    FormSummary = form_summary___decorate([
        form_summary___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'form-summary',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\form-summary\form-summary.html"*/'<ion-header>\n\n	<ion-navbar color="orange">\n\n		<ion-buttons start>\n\n			<button ion-button>\n\n				<ion-icon name="back"></ion-icon>\n\n			</button>\n\n		</ion-buttons>\n\n		<ion-title>{{form.name}}</ion-title>\n\n	</ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="form-summary">\n\n	<ion-grid>\n\n		<ion-row>\n\n			<ion-col><h1>Summary</h1></ion-col>\n\n		</ion-row>\n\n	</ion-grid>\n\n	<ion-scroll scrollY="true" class="adaptable-height">\n\n		<p>{{form.description}}</p>\n\n	</ion-scroll>\n\n</ion-content>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\form-summary\form-summary.html"*/
        }),
        form_summary___metadata("design:paramtypes", [form_summary___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */],
            form_summary___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavParams */],
            rest_client_RESTClient,
            form_summary___WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"]])
    ], FormSummary);
    return FormSummary;
}());

//# sourceMappingURL=form-summary.js.map
// CONCATENATED MODULE: ./src/views/form-summary/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/views/dispatches/dispatches.ts
/* harmony import */ var dispatches___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var dispatches___WEBPACK_IMPORTED_MODULE_1__angular_animations__ = __webpack_require__(26);
/* harmony import */ var dispatches___WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
var dispatches___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var dispatches___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var dispatches_Dispatches = (function () {
    function Dispatches(navCtrl, navParams, client, actionCtrl, zone) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.client = client;
        this.actionCtrl = actionCtrl;
        this.zone = zone;
        this.searchMode = false;
        this.searchTrigger = "hidden";
        this.dispatches = [];
        this.filteredDispatches = [];
        this.doInfinite();
    }
    Dispatches.prototype.doRefresh = function (refresher) {
        var _this = this;
        this.client.getDispatches().subscribe(function (forms) {
            _this.dispatches = forms;
            if (refresher) {
                refresher.complete();
            }
        });
    };
    Dispatches.prototype.toggleSearch = function () {
        this.searchMode = !this.searchMode;
        this.searchTrigger = this.searchMode ? "visible" : "hidden";
    };
    Dispatches.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        this.client.getDispatches().subscribe(function (forms) {
            _this.dispatches = _this.dispatches.concat(forms);
            if (infiniteScroll) {
                infiniteScroll.complete();
            }
        });
    };
    Dispatches.prototype.getItems = function (event) {
        var val = event.target.value;
        var regexp = new RegExp(val, "i");
        this.filteredDispatches = this.dispatches.filter(function (form) {
            return !val || regexp.test(form.name);
        });
    };
    Dispatches.prototype.sync = function () {
        this.client.getUpdates().subscribe(function () { });
    };
    Dispatches.prototype.presentActionSheet = function (form) {
        var _this = this;
        var actionSheet = this.actionCtrl.create({
            title: form.name,
            buttons: [
                {
                    text: 'Capture',
                    icon: "magnet",
                    handler: function () {
                        //console.log('capture clicked');
                        var sub = new form_submission_FormSubmission();
                        sub.prospect_id = form.prospect_id;
                        sub.form_id = form.form_id;
                        Object.keys(form.fields_values).forEach(function (key) {
                            sub.fields[key] = form.fields_values[key];
                        });
                        _this.navCtrl.push(form_capture_FormCapture, { form: form.form, submission: sub, dispatch: form });
                    }
                }, {
                    text: 'Review Submissions',
                    icon: "eye",
                    handler: function () {
                        //console.log('review clicked');
                        _this.navCtrl.push(form_review_FormReview, { form: form, isDispatch: true, dispatch: form });
                    }
                }, {
                    text: 'Share',
                    icon: "share",
                    handler: function () {
                        //console.log('share clicked');
                    }
                }, {
                    text: 'Summary',
                    icon: "megaphone",
                    handler: function () {
                        //console.log('summary clicked');
                        _this.navCtrl.push(form_summary_FormSummary, { form: form });
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        //console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    };
    Dispatches.prototype.ionViewDidEnter = function () {
        this.doRefresh();
    };
    dispatches___decorate([
        dispatches___WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"]("search"),
        dispatches___metadata("design:type", Object)
    ], Dispatches.prototype, "searchbar", void 0);
    Dispatches = dispatches___decorate([
        dispatches___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'dispatches',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\dispatches\dispatches.html"*/'<ion-header>\n\n	<ion-navbar color="orange">\n\n		<button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n		<ion-title>Dispatch Forms</ion-title>\n\n		<ion-buttons end>\n\n			<button ion-button (click)="sync()" class="larger" >\n\n				<ion-icon name="sync"></ion-icon>\n\n			</button>\n\n			<button ion-button (click)="toggleSearch()" class="larger" [class.search]="searchMode">\n\n        <ion-icon name="search"></ion-icon>\n\n      </button>\n\n		</ion-buttons>\n\n	</ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="dispatches">\n\n	<ion-searchbar #search (ionInput)="getItems($event)" *ngIf="searchMode" [@visibleTrigger]="searchTrigger"></ion-searchbar>\n\n  <ion-list [virtualScroll]="dispatches" approxItemHeight="50px">\n\n		<a ion-item detail-none *virtualItem="let dispatch" (click)="presentActionSheet(dispatch)">\n\n			<h1>{{dispatch.name}}</h1>\n\n			<h2>{{dispatch.total_submissions}} submissions &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-danger" *ngIf="dispatch.total_hold > 0">{{dispatch.total_hold}} on Hold</span></h2>\n\n		</a>\n\n	</ion-list>\n\n	<!--ion-refresher (ionRefresh)="doRefresh($event)">\n\n    <ion-refresher-content pull-max="200"></ion-refresher-content>\n\n  </ion-refresher>\n\n	<ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n\n		<ion-infinite-scroll-content></ion-infinite-scroll-content>\n\n	</ion-infinite-scroll-->\n\n</ion-content>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\views\dispatches\dispatches.html"*/,
            animations: [
                // Define an animation that adjusts the opactiy when a new item is created
                //  in the DOM. We use the 'visible' string as the hard-coded value in the 
                //  trigger.
                //
                // When an item is added we wait for 300ms, and then increase the opacity to 1
                //  over a 200ms time interval. When the item is removed we don't delay anything
                //  and use a 200ms interval.
                //
                dispatches___WEBPACK_IMPORTED_MODULE_1__angular_animations__["j" /* trigger */]('visibleTrigger', [
                    dispatches___WEBPACK_IMPORTED_MODULE_1__angular_animations__["g" /* state */]('visible', dispatches___WEBPACK_IMPORTED_MODULE_1__angular_animations__["h" /* style */]({ opacity: '1', height: '5.8rem' })),
                    dispatches___WEBPACK_IMPORTED_MODULE_1__angular_animations__["g" /* state */]('hidden', dispatches___WEBPACK_IMPORTED_MODULE_1__angular_animations__["h" /* style */]({ opacity: '0', height: '0' })),
                    dispatches___WEBPACK_IMPORTED_MODULE_1__angular_animations__["i" /* transition */]('visible => hidden', [dispatches___WEBPACK_IMPORTED_MODULE_1__angular_animations__["e" /* animate */]('300ms 200ms')]),
                    dispatches___WEBPACK_IMPORTED_MODULE_1__angular_animations__["i" /* transition */]('hidden => visible', [dispatches___WEBPACK_IMPORTED_MODULE_1__angular_animations__["e" /* animate */]('300ms 100ms')])
                ])
            ]
        }),
        dispatches___metadata("design:paramtypes", [dispatches___WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* NavController */],
            dispatches___WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* NavParams */],
            business_service_BussinessClient,
            dispatches___WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* ActionSheetController */],
            dispatches___WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"]])
    ], Dispatches);
    return Dispatches;
}());

//# sourceMappingURL=dispatches.js.map
// CONCATENATED MODULE: ./src/views/dispatches/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/services/image-processor.ts
/* harmony import */ var image_processor___WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__ = __webpack_require__(15);
/* harmony import */ var image_processor___WEBPACK_IMPORTED_MODULE_0_rxjs_Rx___default = __webpack_require__.n(image_processor___WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
var image_processor___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var ImageProcessor = (function () {
    function ImageProcessor() {
    }
    ImageProcessor.prototype.ensureLandscape = function (url, preserveCanvas) {
        var _this = this;
        return new image_processor___WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__["Observable"](function (obs) {
            var image = document.createElement("img");
            var t = _this;
            image.onload = function (event) {
                if (image.naturalWidth >= image.naturalHeight) {
                    obs.next({
                        width: image.naturalWidth,
                        height: image.naturalHeight,
                        dataUrl: url,
                        data: null,
                        isDataUrl: false
                    });
                    obs.complete();
                    return;
                }
                t.setupCanvas(image.naturalHeight, image.naturalWidth);
                t.ctx.translate(t.canvas.width / 2, t.canvas.height / 2);
                t.ctx.rotate(Math.PI / 2);
                t.ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
                obs.next({
                    width: t.canvas.width,
                    height: t.canvas.height,
                    dataUrl: t.canvas.toDataURL(),
                    data: null,
                    isDataUrl: true
                });
                obs.complete();
                //if(!preserveCanvas){
                t.ctx.clearRect(0, 0, t.canvas.width, t.canvas.height);
                //}				
            };
            image.src = url;
        });
    };
    ImageProcessor.prototype.flip = function (url) {
        var _this = this;
        return new image_processor___WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__["Observable"](function (obs) {
            var image = document.createElement("img");
            var t = _this;
            image.onload = function (event) {
                t.setupCanvas(image.naturalWidth, image.naturalHeight);
                t.ctx.translate(t.canvas.width / 2, t.canvas.height / 2);
                t.ctx.rotate(Math.PI);
                t.ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
                obs.next({
                    width: t.canvas.width,
                    height: t.canvas.height,
                    dataUrl: t.canvas.toDataURL(),
                    data: null,
                    isDataUrl: true
                });
                obs.complete();
                t.ctx.clearRect(0, 0, t.canvas.width, t.canvas.height);
            };
            image.src = url.replace(/\?.*/, "?" + parseInt(((1 + Math.random()) * 1000) + ""));
        });
    };
    ImageProcessor.prototype.dataURItoBlob = function (dataURI) {
        var arr = dataURI.split(',');
        var byteString = atob(arr[1]);
        var mimeString = arr[0].split(':')[1].split(';')[0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ab], { type: mimeString });
        return blob;
    };
    ImageProcessor.prototype.recognize = function (data) {
        return new image_processor___WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__["Observable"](function (obs) {
            if (window["TesseractPlugin"]) {
                /*TesseractPlugin.recognizeWords(this.processCurrentImage().split("base64,")[1], "eng", function (data) {
                    obs.next(<RecognitionResult>JSON.parse(<any>data));
                    obs.complete();
                }, function (reason) {
                    obs.error(reason);
                });*/
                TesseractPlugin.recognizeWordsFromPath(data, "eng", function (data) {
                    obs.next(JSON.parse(data));
                    obs.complete();
                }, function (reason) {
                    obs.error(reason);
                });
            }
            else {
                setTimeout(function () {
                    obs.next({ "recognizedText": "Kayla Egan ‘ Q TAS\n\nBusiness Development Manager ENVIRONMENTAL\n\nkagan@taslp.com\n\n3929 California Parkway E\n\nFort Worth, TX 761 19\n\nO 817.535.7222 Emergency Response\n7 F 817.535.8187 1.888.654.0111\n\nC 817.253.1855 www.taslp.com", "words": [{ "word": "Kayla", "box": "122 467 211 69", "confidence": 80.52796173095703 }, { "word": "Egan", "box": "351 465 189 68", "confidence": 68.43997955322266 }, { "word": "‘", "box": "823 465 3 2", "confidence": 62.74388885498047 }, { "word": "Q", "box": "929 351 316 253", "confidence": 62.69871139526367 }, { "word": "TAS", "box": "1310 338 464 166", "confidence": 69.00736236572266 }, { "word": "Business", "box": "122 555 189 39", "confidence": 87.80379486083984 }, { "word": "Development", "box": "324 552 306 47", "confidence": 88.68340301513672 }, { "word": "Manager", "box": "644 549 206 48", "confidence": 86.97967529296875 }, { "word": "ENVIRONMENTAL", "box": "1209 547 648 60", "confidence": 73.26774597167969 }, { "word": "kagan@taslp.com", "box": "122 616 403 52", "confidence": 86.98858642578125 }, { "word": "3929", "box": "137 887 122 43", "confidence": 85.84361267089844 }, { "word": "California", "box": "280 885 269 45", "confidence": 82.29283142089844 }, { "word": "Parkway", "box": "566 883 241 55", "confidence": 83.30488586425781 }, { "word": "E", "box": "824 881 35 43", "confidence": 89.27845764160156 }, { "word": "Fort", "box": "136 967 106 43", "confidence": 86.860107421875 }, { "word": "Worth,", "box": "258 967 183 50", "confidence": 89.03996276855469 }, { "word": "TX", "box": "461 966 74 43", "confidence": 89.64755249023438 }, { "word": "761", "box": "553 964 90 44", "confidence": 90.46473693847656 }, { "word": "19", "box": "658 963 55 44", "confidence": 92.0013427734375 }, { "word": "O", "box": "138 1047 42 43", "confidence": 92.50652313232422 }, { "word": "817.535.7222", "box": "199 1046 354 44", "confidence": 84.44401550292969 }, { "word": "Emergency", "box": "1227 1036 349 56", "confidence": 80.78169250488281 }, { "word": "Response", "box": "1592 1033 284 54", "confidence": 87.1631851196289 }, { "word": "7", "box": "19 1185 3 1", "confidence": 10.920455932617188 }, { "word": "F", "box": "136 1127 32 43", "confidence": 88.34750366210938 }, { "word": "817.535.8187", "box": "199 1127 354 44", "confidence": 92.27437591552734 }, { "word": "1.888.654.0111", "box": "1450 1112 425 50", "confidence": 86.51805877685547 }, { "word": "C", "box": "138 1207 40 43", "confidence": 93.28943634033203 }, { "word": "817.253.1855", "box": "197 1207 356 45", "confidence": 84.16748046875 }, { "word": "www.taslp.com", "box": "1351 1195 532 62", "confidence": 86.11317443847656 }] });
                    obs.complete();
                }, 500);
            }
        });
    };
    ImageProcessor.prototype.processCurrentImage = function () {
        var pix = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0; i < pix.data.length; i += 4) {
            var contrastF = 1.36;
            var saturate = -1;
            //up the contrast
            //pix.data[i] = contrastF * (pix.data[i] - 128) + 128;
            //pix.data[i + 1] = contrastF * (pix.data[i + 1] - 128) + 128;
            //pix.data[i + 2] = contrastF * (pix.data[i + 2] - 128) + 128;
            //desaturate
            var max = Math.max(pix.data[i], pix.data[i + 1], pix.data[i + 2]);
            pix.data[i] += max !== pix.data[i] ? (max - pix.data[i]) * saturate : 0;
            pix.data[i + 1] += max !== pix.data[i + 1] ? (max - pix.data[i + 1]) * saturate : 0;
            pix.data[i + 2] += max !== pix.data[i + 2] ? (max - pix.data[i + 2]) * saturate : 0;
        }
        this.ctx.putImageData(pix, 0, 0);
        var base64 = this.canvas.toDataURL();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return base64;
    };
    ImageProcessor.prototype.setupCanvas = function (width, height) {
        this.canvas = null;
        if (!this.canvas) {
            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext('2d');
        }
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
    ImageProcessor = image_processor___decorate([
        __WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"]()
    ], ImageProcessor);
    return ImageProcessor;
}());

var Info = (function () {
    function Info() {
        this.isDataUrl = false;
    }
    return Info;
}());

var RecognitionResult = (function () {
    function RecognitionResult() {
    }
    return RecognitionResult;
}());

var RecognizedWord = (function () {
    function RecognizedWord() {
    }
    return RecognizedWord;
}());

//# sourceMappingURL=image-processor.js.map
// CONCATENATED MODULE: ./src/components/ocr-selector/ocr-selector.ts
/* harmony import */ var ocr_selector___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var ocr_selector___WEBPACK_IMPORTED_MODULE_1__angular_animations__ = __webpack_require__(26);
/* harmony import */ var ocr_selector___WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_file__ = __webpack_require__(27);
var ocr_selector___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ocr_selector___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ocr_selector_OcrSelector = (function () {
    function OcrSelector(params, viewCtrl, zone, actionSheetCtrl, alertCtrl, imageProc) {
        this.params = params;
        this.viewCtrl = viewCtrl;
        this.zone = zone;
        this.actionSheetCtrl = actionSheetCtrl;
        this.alertCtrl = alertCtrl;
        this.imageProc = imageProc;
        this.multiselect = false;
        this.selectedWords = {};
        this.wordElements = [];
        this.loading = true;
        this.isLoading = this.loading + "";
        this.changedValues = {};
        this.oldWidth = 0;
        this.restrictedTypes = [
            "page_break",
            "section",
            "image",
            "business_card",
            "signature"
        ];
        this.info = params.get("imageInfo");
        this.form = params.get("form") || { "id": 42, "form_id": 42, "description": "This is your form description. Click here to edit.", "title": "Untitled Form", "list_id": 0, "name": "Device Form - Collector", "archive_date": "2017-05-22T12:41:00+00:00", "created_at": "2016-02-22T10:45:21+00:00", "updated_at": "2016-02-22T15:54:11+00:00", "success_message": "Success! Your submission has been saved!", "submit_error_message": "Form not submitted.", "submit_button_text": "Submit", "elements": [{ "id": 1, "title": "Name", "field_error_message": "", "size": "small", "is_required": false, "is_always_display": false, "is_conditional": false, "is_not_prefilled": false, "is_hidden": false, "is_readonly": false, "type": "simple_name", "position": 0, "default_value": "", "total_child": 1, "options": [], "mapping": [{ "ll_field_id": "17", "ll_field_unique_identifier": "LastName", "ll_field_type": "Standard", "ll_field_data_type": "string", "identifier": "element_1_1" }, { "ll_field_id": "16", "ll_field_unique_identifier": "FirstName", "ll_field_type": "Standard", "ll_field_data_type": "string", "identifier": "element_1_2" }], "identifier": "element_1" }, { "id": 2, "title": "Email", "field_error_message": "", "size": "medium", "is_required": false, "is_always_display": false, "is_conditional": false, "is_not_prefilled": false, "is_hidden": false, "is_readonly": false, "type": "email", "position": 1, "default_value": "", "total_child": 0, "options": [], "mapping": [{ "ll_field_id": "21", "ll_field_unique_identifier": "Email", "ll_field_type": "Standard", "ll_field_data_type": "string" }], "identifier": "element_2" }, { "id": 3, "title": "Company", "field_error_message": "", "size": "medium", "is_required": false, "is_always_display": false, "is_conditional": false, "is_not_prefilled": false, "is_hidden": false, "is_readonly": false, "type": "text", "position": 2, "default_value": "", "total_child": 0, "options": [], "mapping": [{ "ll_field_id": "22", "ll_field_unique_identifier": "Company", "ll_field_type": "Standard", "ll_field_data_type": "string" }], "identifier": "element_3" }], "total_submissions": 1, "total_hold": 0 };
        this.image = this.info.dataUrl;
    }
    OcrSelector.prototype.ionViewDidEnter = function () {
        var z = this.zone;
        var t = this;
        this.oldWidth = this.elementView.nativeElement.width;
        setTimeout(function () {
            t.imageProc.recognize(t.info.dataUrl).subscribe(function (data) {
                z.run(function () {
                    t.result = data;
                    t.positionWords(data);
                    t.loading = false;
                    t.isLoading = t.loading + "";
                });
            });
        }, 1);
    };
    OcrSelector.prototype.flip = function () {
        var _this = this;
        var z = this.zone;
        var t = this;
        var image = this.info.dataUrl;
        this.loading = true;
        this.isLoading = this.loading + "";
        this.imageProc.flip(this.info.dataUrl).subscribe(function (info) {
            var name = image.substr(image.lastIndexOf("/") + 1).replace(/\?.*/, "");
            var folder = image.substr(0, image.lastIndexOf("/"));
            new __WEBPACK_IMPORTED_MODULE_4__ionic_native_file__["a" /* File */]().writeFile(folder, name, _this.imageProc.dataURItoBlob(info.dataUrl), { replace: true }).then(function (entry) {
                z.run(function () {
                    t.image = t.info.dataUrl.replace(/\?.*/, "") + "?" + parseInt(((1 + Math.random()) * 1000) + "");
                    t.info.dataUrl = t.image;
                    t.ionViewDidEnter();
                });
            });
        });
    };
    OcrSelector.prototype.onResize = function (event) {
        if (this.elementView.nativeElement.width != this.oldWidth && this.result) {
            this.oldWidth = this.elementView.nativeElement.width;
            console.log("repositioning");
            this.positionWords(this.result);
        }
    };
    OcrSelector.prototype.positionWords = function (data) {
        var wRatio = 1;
        100 / this.info.width; //this.elementView.nativeElement.width / this.info.width;
        var hRatio = 1;
        100 / this.info.height; //this.elementView.nativeElement.height / this.info.height;
        var ratio = this.elementView.nativeElement.width / this.info.width;
        var list = [];
        var w;
        var uom = "px";
        data.words.forEach(function (element) {
            w = new Word();
            w.word = element.word;
            w.confidence = element.confidence;
            var coords = element.box.split(" ");
            w.nLeft = (parseFloat(coords[0]) * ratio - 2);
            w.nTop = (parseFloat(coords[1]) * ratio - 2);
            w.nWidth = (parseFloat(coords[2]) * ratio + 4);
            w.nHeight = (parseFloat(coords[3]) * ratio + 4);
            w.left = w.nLeft + uom;
            w.top = w.nTop + uom;
            w.width = w.nWidth + uom;
            w.height = w.nHeight + uom;
            list.push(w);
        });
        this.wordElements = list;
    };
    OcrSelector.prototype.wordClicked = function (word, cb) {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: word.word,
            cssClass: "word-actions",
            subTitle: word.assigned ? "Assigned to field " + word.assigned.label : "Not assigned to a field",
            buttons: [
                {
                    text: 'Edit',
                    icon: "create",
                    handler: function () {
                        var alert = _this.alertCtrl.create({
                            title: '<i class="pull-left icon icon-md ion-md-create"></i>  ' + word.word,
                            cssClass: "edit-word",
                            inputs: [
                                {
                                    name: 'word',
                                    placeholder: 'word',
                                    value: word.word
                                }
                            ],
                            buttons: [
                                {
                                    text: 'Cancel',
                                    role: 'cancel',
                                    handler: function (data) {
                                        _this.wordElements.forEach(function (element) {
                                            element.selected = false;
                                        });
                                    }
                                },
                                {
                                    text: 'Update',
                                    handler: function (data) {
                                        word.word = data.word;
                                        actionSheet.setTitle(word.word);
                                        cb && cb(word);
                                    }
                                }
                            ]
                        });
                        alert.present();
                        return false;
                    }
                }, {
                    text: word.assigned ? 'Assign to another field' : 'Assign to field',
                    icon: "eye",
                    handler: function () {
                        var inputs = [];
                        var nameMap = {
                            "FirstName": "First Name",
                            "LastName": "Last Name"
                        };
                        _this.form.elements.forEach(function (element) {
                            if (_this.restrictedTypes.indexOf(element.type) > -1) {
                                return;
                            }
                            if (element.mapping && element.mapping.length > 1) {
                                element.mapping.forEach(function (mapping) {
                                    inputs.push({
                                        type: 'radio',
                                        label: nameMap[mapping.ll_field_unique_identifier] || mapping.ll_field_unique_identifier,
                                        value: mapping["identifier"]
                                    });
                                });
                            }
                            else {
                                inputs.push({
                                    type: 'radio',
                                    label: element.title,
                                    value: element["identifier"]
                                });
                            }
                        });
                        console.log(inputs);
                        inputs[0].checked = true;
                        var alert = _this.alertCtrl.create({
                            title: '<i class="pull-left icon icon-md ion-md-eye"></i>  ' + word.word,
                            //subTitle: "Assign to field",
                            cssClass: "assign-field",
                            inputs: inputs,
                            buttons: [
                                {
                                    text: 'Cancel',
                                    role: 'cancel',
                                    handler: function (data) {
                                        console.log('Cancel clicked');
                                        _this.wordElements.forEach(function (element) {
                                            element.selected = false;
                                        });
                                    }
                                },
                                {
                                    text: 'Update',
                                    handler: function (data) {
                                        cb && cb(word);
                                        if (data) {
                                            var title = "";
                                            for (var i = 0; i < _this.form.elements.length; i++) {
                                                if (_this.form.elements[i]["identifier"] == data) {
                                                    title = _this.form.elements[i].title;
                                                    break;
                                                }
                                            }
                                            _this.changedValues[data] = word.word;
                                            word.assigned = new Assigned(data, title);
                                        }
                                    }
                                }
                            ]
                        });
                        alert.present();
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        _this.wordElements.forEach(function (element) {
                            element.selected = false;
                        });
                    }
                }
            ]
        });
        actionSheet.present();
    };
    OcrSelector.prototype.cancel = function () {
        this.viewCtrl.dismiss(null);
    };
    OcrSelector.prototype.done = function () {
        this.viewCtrl.dismiss(this.changedValues);
    };
    OcrSelector.prototype.onPressStart = function (event) {
        var _this = this;
        this.zone.run(function () {
            _this.multiselect = true;
            var w = {};
            _this.wordElements.forEach(function (element, index) {
                w[index] = false;
                element.selected = false;
            });
            _this.selectedWords = w;
        });
    };
    OcrSelector.prototype.onPressEnd = function (event) {
        var _this = this;
        if (!this.multiselect) {
            return;
        }
        this.multiselect = false;
        var words = [];
        for (var index in this.selectedWords) {
            this.selectedWords[index] && words.push(this.wordElements[index]);
        }
        var word = this.buildWordGroup(words);
        this.wordClicked(word, function (word) {
            var words = [];
            var done = false;
            _this.wordElements.forEach(function (w, index) {
                if (!_this.selectedWords[index]) {
                    words.push(w);
                }
                else if (!done) {
                    words.push(word);
                    done = true;
                }
            });
            _this.wordElements = words;
        });
    };
    OcrSelector.prototype.buildWordGroup = function (words) {
        var w = new Word();
        w.word = "";
        var uom = "px";
        var minx = Infinity, maxx = 0, miny = Infinity, maxy = 0;
        words.forEach(function (word) {
            if (w.word) {
                w.word += " ";
            }
            w.word += word.word;
            minx = minx > word.nLeft ? word.nLeft : minx;
            miny = miny > word.nTop ? word.nTop : miny;
            maxx = maxx < word.nLeft + word.nWidth ? word.nLeft + word.nWidth : maxx;
            maxy = maxy < word.nTop + word.nHeight ? word.nTop + word.nHeight : maxy;
        });
        w.nTop = miny;
        w.nLeft = minx;
        w.nWidth = maxx - minx;
        w.nHeight = maxy - miny;
        w.left = w.nLeft + uom;
        w.top = w.nTop + uom;
        w.width = w.nWidth + uom;
        w.height = w.nHeight + uom;
        return w;
    };
    OcrSelector.prototype.onTouchMove = function (event) {
        var _this = this;
        if (this.multiselect && event.touches.length > 0) {
            var t = event.touches.item(0);
            var elem = document.elementFromPoint(t.pageX, t.pageY);
            var index_1 = parseInt(elem.id);
            if (index_1 > 0 && !this.selectedWords[index_1]) {
                this.zone.run(function () {
                    _this.selectedWords[index_1] = true;
                    if (_this.wordElements[index_1]) {
                        _this.wordElements[index_1].selected = true;
                    }
                });
            }
        }
    };
    ocr_selector___decorate([
        ocr_selector___WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"](ocr_selector___WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* Content */]),
        ocr_selector___metadata("design:type", ocr_selector___WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* Content */])
    ], OcrSelector.prototype, "content", void 0);
    ocr_selector___decorate([
        ocr_selector___WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"]('card'),
        ocr_selector___metadata("design:type", ocr_selector___WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], OcrSelector.prototype, "elementView", void 0);
    ocr_selector___decorate([
        ocr_selector___WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"]("window:resize", ["$event"]),
        ocr_selector___metadata("design:type", Function),
        ocr_selector___metadata("design:paramtypes", [Object]),
        ocr_selector___metadata("design:returntype", void 0)
    ], OcrSelector.prototype, "onResize", null);
    OcrSelector = ocr_selector___decorate([
        ocr_selector___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'ocr-selector',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\ocr-selector\ocr-selector.html"*/'<ion-header>\n\n	<ion-navbar>\n\n		<ion-buttons start>\n\n			<button ion-button (click)="cancel()">\n\n				<ion-icon name="close" class="capture"></ion-icon>\n\n			</button>\n\n		</ion-buttons>\n\n		<ion-title>Recognized text</ion-title>\n\n		<ion-buttons end>\n\n			<button ion-button (click)="flip()" [disabled]="loading">\n\n				<ion-icon name="repeat" class="capture"></ion-icon>\n\n			</button>\n\n			<button ion-button (click)="done()" [disabled]="loading">\n\n				<ion-icon name="checkmark" class="capture"></ion-icon>\n\n			</button>\n\n		</ion-buttons>\n\n	</ion-navbar>\n\n</ion-header>\n\n<ion-content class="text-center">\n\n	<div class="ocr-layout">\n\n		<div class="holder">\n\n			<img #card [src]="image">\n\n			<div class="words-wrapper" [class.overlay]="multiselect">\n\n				<div class="words" (press)="onPressStart($event)" (touchmove)="onTouchMove($event)" (touchend)="onPressEnd($event)">\n\n					<div class="word" [class.assigned]="word.assigned" [class.selected]="word.selected" *ngFor="let word of wordElements; let i = index" [id]="i" (click)="wordClicked(word)" [style.width]="word.width"\n\n					 [style.height]="word.height" [style.top]="word.top" [style.left]="word.left">\n\n						{{word.word}}\n\n					</div>\n\n				</div>\n\n			</div>\n\n		</div>\n\n		<div class="loading" [@isVisibleChanged]="isLoading">\n\n			<ion-spinner></ion-spinner>\n\n		</div>\n\n	</div>\n\n</ion-content>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\ocr-selector\ocr-selector.html"*/,
            animations: [
                ocr_selector___WEBPACK_IMPORTED_MODULE_1__angular_animations__["j" /* trigger */]('isVisibleChanged', [
                    ocr_selector___WEBPACK_IMPORTED_MODULE_1__angular_animations__["g" /* state */]('true', ocr_selector___WEBPACK_IMPORTED_MODULE_1__angular_animations__["h" /* style */]({ opacity: 1, "z-index": 1 })),
                    ocr_selector___WEBPACK_IMPORTED_MODULE_1__angular_animations__["g" /* state */]('false', ocr_selector___WEBPACK_IMPORTED_MODULE_1__angular_animations__["h" /* style */]({ opacity: 0, "z-index": -1 })),
                    ocr_selector___WEBPACK_IMPORTED_MODULE_1__angular_animations__["i" /* transition */]('* => *', ocr_selector___WEBPACK_IMPORTED_MODULE_1__angular_animations__["e" /* animate */]('350ms'))
                ])
            ]
        }),
        ocr_selector___metadata("design:paramtypes", [ocr_selector___WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* NavParams */],
            ocr_selector___WEBPACK_IMPORTED_MODULE_2_ionic_angular__["q" /* ViewController */],
            ocr_selector___WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"],
            ocr_selector___WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* ActionSheetController */],
            ocr_selector___WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */],
            ImageProcessor])
    ], OcrSelector);
    return OcrSelector;
}());

var Word = (function () {
    function Word() {
        this.selected = false;
    }
    return Word;
}());
var Assigned = (function () {
    function Assigned(field, label) {
        this.label = label;
        this.field = field;
    }
    return Assigned;
}());
//# sourceMappingURL=ocr-selector.js.map
// CONCATENATED MODULE: ./src/components/ocr-selector/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/base-element.ts
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_file__ = __webpack_require__(27);


var BaseElement = (function () {
    function BaseElement() {
        this.readonly = false;
        this.propagateChange = function () { };
        this.validateFn = function () { };
        this.currentVal = "";
        this.file = new __WEBPACK_IMPORTED_MODULE_1__ionic_native_file__["a" /* File */]();
    }
    BaseElement.prototype.ngOnChanges = function (changes) {
        if (this.element) {
            this.name = this.element.id + "";
            this.formControlName = this.element["identifier"];
        }
    };
    BaseElement.prototype.writeValue = function (obj) {
        this.currentVal = obj;
    };
    BaseElement.prototype.registerOnChange = function (fn) {
        this.propagateChange = fn;
    };
    BaseElement.prototype.registerOnTouched = function (fn) {
    };
    BaseElement.prototype.setDisabledState = function (isDisabled) {
    };
    BaseElement.prototype.onChange = function (value) {
        this.currentVal = value;
        this.propagateChange(value);
    };
    BaseElement.prototype.moveFile = function (filePath, newFolder) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Observable"](function (obs) {
            var name = filePath.substr(filePath.lastIndexOf("/") + 1);
            var ext = name.split(".").pop();
            var oldFolder = filePath.substr(0, filePath.lastIndexOf("/"));
            var newName = new Date().getTime() + "." + ext;
            var doMove = function (d) {
                _this.file.moveFile(oldFolder, name, newFolder, newName)
                    .then(function (entry) {
                    obs.next(newFolder + "/" + newName);
                    obs.complete();
                })
                    .catch(function (err) {
                    obs.error(err);
                });
            };
            //console.log(newFolder.substring(0, newFolder.lastIndexOf("/")), newFolder.substr(newFolder.lastIndexOf("/") + 1));
            _this.file.createDir(newFolder.substring(0, newFolder.lastIndexOf("/")), newFolder.substr(newFolder.lastIndexOf("/") + 1), false)
                .then(doMove)
                .catch(doMove);
        });
    };
    return BaseElement;
}());

//# sourceMappingURL=base-element.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/business-card/business-card.ts
/* harmony import */ var business_card___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var business_card___WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_forms__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_camera__ = __webpack_require__(52);
var business_card___extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var business_card___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var business_card___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var business_card_BusinessCard = (function (_super) {
    business_card___extends(BusinessCard, _super);
    function BusinessCard(actionCtrl, alertCtrl, camera, zone, modalCtrl, imageProc) {
        var _this = _super.call(this) || this;
        _this.actionCtrl = actionCtrl;
        _this.alertCtrl = alertCtrl;
        _this.camera = camera;
        _this.zone = zone;
        _this.modalCtrl = modalCtrl;
        _this.imageProc = imageProc;
        _this.readonly = false;
        _this.front = "assets/images/business-card-front.svg";
        _this.back = "assets/images/business-card-back.svg";
        _this.backLoading = false;
        _this.frontLoading = false;
        _this.FRONT = 0;
        _this.BACK = 1;
        _this.currentVal = {
            front: _this.front,
            back: _this.back
        };
        _this.theVal = {
            front: _this.front,
            back: _this.back
        };
        return _this;
    }
    BusinessCard_1 = BusinessCard;
    BusinessCard.prototype.captureImage = function (type) {
        var _this = this;
        if (this.readonly) {
            return;
        }
        if ((type == this.FRONT && this.currentVal.front != this.front) ||
            (type == this.BACK && this.currentVal.back != this.back)) {
            var sheet = this.actionCtrl.create({
                title: "",
                buttons: [
                    {
                        text: 'Remove',
                        role: 'destructive',
                        handler: function () {
                            if (type == _this.FRONT) {
                                _this.currentVal.front = _this.front;
                            }
                            else {
                                _this.currentVal.back = _this.back;
                            }
                        }
                    },
                    {
                        text: 'Flip image',
                        handler: function () {
                            _this.flip(type);
                        }
                    },
                    {
                        text: 'Camera',
                        handler: function () {
                            _this.doCapture(type, 1);
                        }
                    },
                    {
                        text: 'Choose from Library',
                        handler: function () {
                            _this.doCapture(type, 2);
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel'
                    }
                ]
            });
            sheet.present();
        }
        else {
            this.doCapture(type);
        }
    };
    BusinessCard.prototype.doCapture = function (type, captureType) {
        var _this = this;
        if (captureType === void 0) { captureType = 1; }
        //screen.orientation.lock && screen.orientation.lock("landscape");
        this.camera.getPicture({
            sourceType: captureType,
            correctOrientation: true,
            encodingType: this.camera.EncodingType.JPEG,
            targetWidth: 1280,
            targetHeight: 1000
        }).then(function (imageData) {
            if (type == _this.FRONT) {
                _this.frontLoading = true;
            }
            else {
                _this.backLoading = true;
            }
            _this.imageProc.ensureLandscape(imageData, _this.element.is_scan_cards_and_prefill_form == 1).subscribe(function (info) {
                var newFolder = cordova.file.dataDirectory + "leadliaison/images";
                var name = imageData.substr(imageData.lastIndexOf("/") + 1);
                var newName = new Date().getTime() + name.substring(name.lastIndexOf("."));
                var folder = imageData.substr(0, imageData.lastIndexOf("/"));
                var promise;
                if (info.isDataUrl) {
                    promise = _this.file.writeFile(newFolder, newName, _this.imageProc.dataURItoBlob(info.dataUrl));
                }
                else {
                    promise = _this.file.moveFile(folder, name, newFolder, newName);
                }
                promise.then(function (entry) {
                    _this.setValue(type, newFolder + "/" + newName);
                    info.dataUrl = newFolder + "/" + newName;
                    _this.frontLoading = false;
                    _this.backLoading = false;
                    if (_this.element.is_scan_cards_and_prefill_form == 1 && type == _this.FRONT) {
                        _this.recognizeText(info);
                    } /*else{
                        screen.orientation.unlock && screen.orientation.unlock();
                    }*/
                }, function (err) {
                    console.error(err);
                    //screen.orientation.unlock && screen.orientation.unlock();
                });
            });
        }).catch(function (err) {
            console.error(err);
            //screen.orientation.unlock && screen.orientation.unlock();
        });
    };
    BusinessCard.prototype.recognizeText = function (info) {
        var _this = this;
        var modal = this.modalCtrl.create(ocr_selector_OcrSelector, { imageInfo: info, form: this.form, submission: this.submission });
        modal.onDidDismiss(function (changedValues) {
            //this.currentVal.front = this.currentVal.front + "?" + parseInt(((1 + Math.random())*1000) + "");
            screen.orientation.unlock && screen.orientation.unlock();
            if (changedValues) {
                var vals = {};
                for (var id_1 in _this.formGroup.controls) {
                    if (_this.formGroup.controls[id_1]["controls"]) {
                        vals[id_1] = {};
                        for (var subid in _this.formGroup.controls[id_1]["controls"]) {
                            vals[id_1][subid] = _this.formGroup.controls[id_1]["controls"][subid].value;
                        }
                    }
                    else {
                        vals[id_1] = _this.formGroup.controls[id_1].value;
                    }
                }
                var ctrl = null;
                for (var id in changedValues) {
                    var match = /(\w+\_\d+)\_\d+/g.exec(id);
                    if (match && match.length > 0) {
                        if (!vals[match[1]]) {
                            vals[match[1]] = {};
                        }
                        vals[match[1]][id] = changedValues[id];
                        ctrl = _this.formGroup.get(match[1]).get(id);
                        ctrl.markAsTouched();
                        ctrl.markAsDirty();
                    }
                    else {
                        vals[id] = changedValues[id];
                        ctrl = _this.formGroup.get(id);
                        ctrl.markAsTouched();
                        ctrl.markAsDirty();
                    }
                }
                _this.formGroup.setValue(vals);
            }
        });
        modal.present();
        //screen.orientation.lock && screen.orientation.lock("landscape");
    };
    BusinessCard.prototype.setValue = function (type, newPath) {
        if (type == this.FRONT) {
            this.currentVal.front = newPath;
        }
        else {
            this.currentVal.back = newPath;
        }
        var v = {
            front: null,
            back: null
        };
        if (this.currentVal.front && this.currentVal.front != this.front) {
            v.front = this.currentVal.front;
            this.theVal.front = this.currentVal.front.replace(/\?.*/, "") + "?" + parseInt(((1 + Math.random()) * 1000) + "");
        }
        if (this.currentVal.back && this.currentVal.back != this.back) {
            v.back = this.currentVal.back;
            this.theVal.back = this.currentVal.back.replace(/\?.*/, "") + "?" + parseInt(((1 + Math.random()) * 1000) + "");
        }
        this.propagateChange(v);
    };
    BusinessCard.prototype.onImageLoaded = function (event, front) {
        if (front) {
            this.frontLoading = false;
        }
        else {
            this.backLoading = false;
        }
    };
    BusinessCard.prototype.flip = function (type) {
        var _this = this;
        var image = "";
        if (type == this.FRONT) {
            image = this.currentVal.front;
        }
        else {
            image = this.currentVal.back;
        }
        var z = this.zone;
        var t = this;
        this.imageProc.flip(image).subscribe(function (info) {
            var name = image.substr(image.lastIndexOf("/") + 1).replace(/\?.*/, "");
            var folder = image.substr(0, image.lastIndexOf("/"));
            _this.file.writeFile(folder, name, _this.imageProc.dataURItoBlob(info.dataUrl), { replace: true }).then(function (entry) {
                z.run(function () {
                    t.setValue(type, folder + "/" + name);
                });
            });
        });
    };
    BusinessCard.prototype.writeValue = function (obj) {
        if (!obj) {
            this.currentVal = {
                front: this.front,
                back: this.back
            };
        }
        else {
            this.currentVal = JSON.parse(JSON.stringify(obj));
            if (!this.currentVal.front) {
                this.currentVal.front = this.front;
            }
            if (!this.currentVal.back) {
                this.currentVal.back = this.back;
            }
        }
    };
    business_card___decorate([
        business_card___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        business_card___metadata("design:type", FormElement)
    ], BusinessCard.prototype, "element", void 0);
    business_card___decorate([
        business_card___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        business_card___metadata("design:type", __WEBPACK_IMPORTED_MODULE_6__angular_forms__["FormGroup"])
    ], BusinessCard.prototype, "formGroup", void 0);
    business_card___decorate([
        business_card___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        business_card___metadata("design:type", Boolean)
    ], BusinessCard.prototype, "readonly", void 0);
    business_card___decorate([
        business_card___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        business_card___metadata("design:type", Form)
    ], BusinessCard.prototype, "form", void 0);
    business_card___decorate([
        business_card___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        business_card___metadata("design:type", form_submission_FormSubmission)
    ], BusinessCard.prototype, "submission", void 0);
    BusinessCard = BusinessCard_1 = business_card___decorate([
        business_card___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'business-card',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\business-card\business-card.html"*/'<div class="business card">\n\n	<ion-row>\n\n		<ion-col>\n\n			<button ion-button color="light" (click)="captureImage(FRONT)">\n\n				<img [class.hidden]="frontLoading" [src]="theVal.front" (load)="onImageLoaded($event, true)">\n\n				<ion-spinner [class.hidden]="!frontLoading"></ion-spinner>\n\n			</button>\n\n		</ion-col>\n\n		<ion-col>\n\n			<button ion-button color="light" (click)="captureImage(BACK)">\n\n				<img [class.hidden]="backLoading" [src]="theVal.back" (load)="onImageLoaded($event, false)">\n\n				<ion-spinner [class.hidden]="!backLoading"></ion-spinner>\n\n			</button>\n\n		</ion-col>\n\n	</ion-row>\n\n</div>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\business-card\business-card.html"*/,
            providers: [
                { provide: __WEBPACK_IMPORTED_MODULE_6__angular_forms__["NG_VALUE_ACCESSOR"], useExisting: business_card___WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"](function () { return BusinessCard_1; }), multi: true }
            ]
        }),
        business_card___metadata("design:paramtypes", [business_card___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */],
            business_card___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_native_camera__["a" /* Camera */],
            business_card___WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"],
            business_card___WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* ModalController */],
            ImageProcessor])
    ], BusinessCard);
    return BusinessCard;
    var BusinessCard_1;
}(BaseElement));

//# sourceMappingURL=business-card.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/business-card/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/image/image.ts
/* harmony import */ var image___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__ = __webpack_require__(52);
var image___extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var image___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var image___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var image_Image = (function (_super) {
    image___extends(Image, _super);
    function Image(fb, actionCtrl, camera) {
        var _this = _super.call(this) || this;
        _this.fb = fb;
        _this.actionCtrl = actionCtrl;
        _this.camera = camera;
        _this.readonly = false;
        _this.images = {
            true: "trash",
            false: "images"
        };
        _this.colors = {
            true: "danger",
            false: "dark"
        };
        _this.selectionEnabled = false;
        _this.selection = [];
        _this.max = 5;
        _this.currentVal = [];
        return _this;
        /*setTimeout(()=>{
            this.currentVal = ["http://www.w3schools.com/css/img_fjords.jpg", "http://www.w3schools.com/css/img_fjords.jpg", "http://www.w3schools.com/css/img_fjords.jpg"];
        }, 1000);*/
    }
    Image_1 = Image;
    Image.prototype.chooseType = function () {
        var _this = this;
        if (this.readonly) {
            return;
        }
        if (this.selectionEnabled) {
            for (var i = this.selection.length - 1; i > -1; i--) {
                if (this.selection[i]) {
                    this.currentVal.splice(i, 1);
                }
            }
            this.propagateChange(this.currentVal);
            this.selection = [];
            this.selectionEnabled = false;
            return;
        }
        if (this.currentVal.length >= this.max) {
            return;
        }
        var onImageReceived = function (imageData) {
            //console.log(imageData);
            if (!_this.currentVal) {
                _this.currentVal = [];
            }
            var t = _this;
            if (imageData.indexOf("content://") == 0 && window["FilePath"]) {
                window["FilePath"].resolveNativePath(imageData, function (path) {
                    t.moveFile(path, cordova.file.dataDirectory + "leadliaison/images").subscribe(function (newPath) {
                        t.currentVal.unshift(newPath);
                        t.propagateChange(t.currentVal);
                    });
                }, function (err) {
                    console.error(err);
                });
            }
            else {
                _this.moveFile(imageData, cordova.file.dataDirectory + "leadliaison/images").subscribe(function (newPath) {
                    _this.currentVal.unshift(newPath);
                    _this.propagateChange(_this.currentVal);
                });
            }
        };
        var camera = this.camera;
        var sheet = this.actionCtrl.create({
            title: "",
            buttons: [
                {
                    text: 'Use Camera',
                    handler: function () {
                        camera.getPicture({
                            sourceType: 1
                        }).then(onImageReceived)
                            .catch(function (err) {
                            //hmmm, what to do
                            console.error(err);
                        });
                    }
                },
                {
                    text: 'Choose from Album',
                    handler: function () {
                        camera.getPicture({
                            sourceType: 0,
                            destinationType: 2
                        }).then(onImageReceived)
                            .catch(function (err) {
                            //hmmm, what to do
                            console.error(err);
                        });
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        sheet.present();
    };
    Image.prototype.toggleSelection = function (index) {
        if (this.readonly) {
            return;
        }
        this.selection[index] = !this.selection[index];
        this.selectionEnabled = false;
        for (var i = 0; i < this.selection.length; i++) {
            if (!!this.selection[i]) {
                this.selectionEnabled = true;
                break;
            }
        }
    };
    Image.prototype.writeValue = function (obj) {
        if (!obj) {
            this.currentVal = [];
        }
        else {
            this.currentVal = obj;
        }
    };
    image___decorate([
        image___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        image___metadata("design:type", FormElement)
    ], Image.prototype, "element", void 0);
    image___decorate([
        image___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        image___metadata("design:type", __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormGroup"])
    ], Image.prototype, "formGroup", void 0);
    image___decorate([
        image___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        image___metadata("design:type", Boolean)
    ], Image.prototype, "readonly", void 0);
    Image = Image_1 = image___decorate([
        image___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'image',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\image\image.html"*/'<div class="image">\n\n	<ion-row>\n\n		<ion-col col-3>\n\n			<button ion-button icon-only large full color="light" style="padding: 20px 0 !important;" (click)="chooseType()">\n\n				<ion-icon [name]="images[selectionEnabled]" [color]="colors[selectionEnabled]"></ion-icon>\n\n			</button>\n\n		</ion-col>\n\n		<ion-col col-9>\n\n			<ion-scroll scrollX="true">\n\n				<div class="img" (click)="toggleSelection(i)" *ngFor="let image of currentVal; let i = index">\n\n					<img [src]="image"/>\n\n					<div class="overlay" *ngIf="selection[i]">\n\n						<ion-icon name="checkmark"></ion-icon>\n\n					</div>\n\n				</div>\n\n			</ion-scroll>\n\n		</ion-col>\n\n	</ion-row>\n\n</div>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\image\image.html"*/,
            providers: [
                { provide: __WEBPACK_IMPORTED_MODULE_2__angular_forms__["NG_VALUE_ACCESSOR"], useExisting: image___WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"](function () { return Image_1; }), multi: true }
            ]
        }),
        image___metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormBuilder"],
            __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__["a" /* Camera */]])
    ], Image);
    return Image;
    var Image_1;
}(BaseElement));

//# sourceMappingURL=image.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/image/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/base-group-element.ts
/* harmony import */ var base_group_element___WEBPACK_IMPORTED_MODULE_0__angular_forms__ = __webpack_require__(6);

var BaseGroupElement = (function () {
    function BaseGroupElement() {
        this.mapping = [];
        this.group = new base_group_element___WEBPACK_IMPORTED_MODULE_0__angular_forms__["FormGroup"]({});
        this.readonly = false;
    }
    BaseGroupElement.prototype.ngOnChanges = function (changes) {
        //console.log("group", this.element, this.group, this.rootGroup);
        if (changes['element'] || changes['rootGroup']) {
            this.config();
        }
    };
    BaseGroupElement.prototype.config = function () {
        var _this = this;
        if (this.element && this.element.mapping && this.rootGroup) {
            var elemIdentifier_1 = "element_" + this.element.id;
            this.group = this.rootGroup.get(elemIdentifier_1);
            this.element.mapping.forEach(function (map, index) {
                _this.mapping.push({
                    id: index + 1,
                    identifier: elemIdentifier_1 + "_" + (index + 1),
                    label: map.ll_field_unique_identifier
                });
            });
        }
    };
    return BaseGroupElement;
}());

//# sourceMappingURL=base-group-element.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/simple-name/simple-name.ts
/* harmony import */ var simple_name___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var simple_name___WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(6);
var simple_name___extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var simple_name___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var simple_name___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var simple_name_SimpleName = (function (_super) {
    simple_name___extends(SimpleName, _super);
    function SimpleName() {
        var _this = _super.call(this) || this;
        _this.readonly = false;
        _this.nameMap = {
            "FirstName": "First Name",
            "LastName": "Last Name"
        };
        return _this;
    }
    SimpleName.prototype.ngOnChanges = function (changes) {
        _super.prototype.ngOnChanges.call(this, changes);
    };
    SimpleName.prototype.config = function () {
        _super.prototype.config.call(this);
        if (this.mapping && this.mapping[0].label == "LastName") {
            this.mapping.reverse();
        }
    };
    simple_name___decorate([
        simple_name___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        simple_name___metadata("design:type", FormElement)
    ], SimpleName.prototype, "element", void 0);
    simple_name___decorate([
        simple_name___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        simple_name___metadata("design:type", simple_name___WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormGroup"])
    ], SimpleName.prototype, "rootGroup", void 0);
    simple_name___decorate([
        simple_name___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        simple_name___metadata("design:type", Boolean)
    ], SimpleName.prototype, "readonly", void 0);
    SimpleName = simple_name___decorate([
        simple_name___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'simple-name',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\simple-name\simple-name.html"*/'<ion-row class="simpleName" [formGroup]="group">\n\n	<ion-col *ngFor="let map of mapping">\n\n		<ion-item>\n\n			<ion-label stacked [class.required]="element.is_required">{{nameMap[map.label]}}</ion-label>\n\n			<ion-input type="text" [attr.name]="map.id" [formControlName]="map.identifier"></ion-input>\n\n		</ion-item>\n\n	</ion-col>\n\n</ion-row>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\simple-name\simple-name.html"*/
        }),
        simple_name___metadata("design:paramtypes", [])
    ], SimpleName);
    return SimpleName;
}(BaseGroupElement));

//# sourceMappingURL=simple-name.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/simple-name/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/signature/signature-pad.ts
/* harmony import */ var signature_pad___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);

var signature_pad___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var signature_pad___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SignaturePad = (function () {
    function SignaturePad(elementRef) {
        // no op
        this.elementRef = elementRef;
        this.options = this.options || {};
        this.onBeginEvent = new signature_pad___WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.onEndEvent = new signature_pad___WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    SignaturePad.prototype.ngAfterViewInit = function () {
        var sp = __webpack_require__(381).default;
        var canvas = this.elementRef.nativeElement.querySelector('canvas');
        if (this.options['canvasHeight']) {
            canvas.height = this.options['canvasHeight'];
        }
        if (this.options['canvasWidth']) {
            canvas.width = this.options['canvasWidth'];
        }
        this.signaturePad = new sp(canvas, this.options);
        this.signaturePad.onBegin = this.onBegin.bind(this);
        this.signaturePad.onEnd = this.onEnd.bind(this);
    };
    SignaturePad.prototype.resizeCanvas = function () {
        // When zoomed out to less than 100%, for some very strange reason,
        // some browsers report devicePixelRatio as less than 1
        // and only part of the canvas is cleared then.
        var ratio = Math.max(window.devicePixelRatio || 1, 1);
        var canvas = this.signaturePad._canvas;
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext('2d').scale(ratio, ratio);
        this.signaturePad.clear(); // otherwise isEmpty() might return incorrect value
    };
    // Returns signature image as data URL (see https://mdn.io/todataurl for the list of possible paramters)
    SignaturePad.prototype.toDataURL = function (imageType, quality) {
        return this.signaturePad.toDataURL(imageType, quality); // save image as data URL
    };
    // Draws signature image from data URL
    SignaturePad.prototype.fromDataURL = function (dataURL) {
        this.signaturePad.fromDataURL(dataURL);
    };
    // Clears the canvas
    SignaturePad.prototype.clear = function () {
        this.signaturePad.clear();
    };
    // Returns true if canvas is empty, otherwise returns false
    SignaturePad.prototype.isEmpty = function () {
        return this.signaturePad.isEmpty();
    };
    // Unbinds all event handlers
    SignaturePad.prototype.off = function () {
        this.signaturePad.off();
    };
    // Rebinds all event handlers
    SignaturePad.prototype.on = function () {
        this.signaturePad.on();
    };
    // set an option on the signaturePad - e.g. set('minWidth', 50);
    SignaturePad.prototype.set = function (option, value) {
        switch (option) {
            case 'canvasHeight':
                this.signaturePad._canvas.height = value;
                break;
            case 'canvasWidth':
                this.signaturePad._canvas.width = value;
                break;
            default:
                this.signaturePad[option] = value;
        }
    };
    // notify subscribers on signature begin
    SignaturePad.prototype.onBegin = function () {
        this.onBeginEvent.emit(true);
    };
    // notify subscribers on signature end
    SignaturePad.prototype.onEnd = function () {
        this.onEndEvent.emit(true);
    };
    signature_pad___decorate([
        signature_pad___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        signature_pad___metadata("design:type", Object)
    ], SignaturePad.prototype, "options", void 0);
    signature_pad___decorate([
        signature_pad___WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"](),
        signature_pad___metadata("design:type", signature_pad___WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
    ], SignaturePad.prototype, "onBeginEvent", void 0);
    signature_pad___decorate([
        signature_pad___WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"](),
        signature_pad___metadata("design:type", signature_pad___WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
    ], SignaturePad.prototype, "onEndEvent", void 0);
    SignaturePad = signature_pad___decorate([
        signature_pad___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            template: '<canvas></canvas>',
            selector: 'signature-pad',
        }),
        signature_pad___metadata("design:paramtypes", [signature_pad___WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]])
    ], SignaturePad);
    return SignaturePad;
}());

//# sourceMappingURL=signature-pad.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/signature/signature.modal.ts
/* harmony import */ var signature_modal___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var signature_modal___WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
var signature_modal___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var signature_modal___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var signature_modal_SignatureModal = (function () {
    function SignatureModal(zone, viewCtrl) {
        this.zone = zone;
        this.viewCtrl = viewCtrl;
        this.signaturePadOptions = {
            'minWidth': 5,
            'canvasWidth': 500,
            'canvasHeight': 300
        };
        this.hasSignature = false;
    }
    SignatureModal.prototype.ionViewDidEnter = function () {
        var _this = this;
        setTimeout(function () {
            var dim = _this.content.getContentDimensions();
            var width = dim.contentWidth - 32;
            var height = dim.contentHeight - 32;
            _this.signaturePad.set("canvasWidth", width);
            _this.signaturePad.set("canvasHeight", height);
        }, 800);
    };
    SignatureModal.prototype.ngAfterViewInit = function () {
        this.clear();
    };
    SignatureModal.prototype.drawComplete = function () {
        var _this = this;
        this.zone.run(function () {
            _this.hasSignature = true;
        });
        //console.log("Done");
    };
    SignatureModal.prototype.drawStart = function () {
        //console.log('begin drawing');
    };
    SignatureModal.prototype.clear = function () {
        this.signaturePad.clear();
    };
    SignatureModal.prototype.cancel = function () {
        this.viewCtrl.dismiss(null);
    };
    SignatureModal.prototype.done = function () {
        if (this.hasSignature) {
            var canvas = this.signaturePad["signaturePad"]._canvas;
            var img = this.cropSignatureCanvas(canvas);
            this.viewCtrl.dismiss(img);
        }
    };
    SignatureModal.prototype.cropSignatureCanvas = function (canvas) {
        // First duplicate the canvas to not alter the original
        var croppedCanvas = document.createElement('canvas'), croppedCtx = croppedCanvas.getContext('2d');
        croppedCanvas.width = canvas.width;
        croppedCanvas.height = canvas.height;
        croppedCtx.drawImage(canvas, 0, 0);
        // Next do the actual cropping
        var w = croppedCanvas.width, h = croppedCanvas.height, pix = { x: [], y: [] }, imageData = croppedCtx.getImageData(0, 0, croppedCanvas.width, croppedCanvas.height), x, y, index;
        for (y = 0; y < h; y++) {
            for (x = 0; x < w; x++) {
                index = (y * w + x) * 4;
                if (imageData.data[index + 3] > 0) {
                    pix.x.push(x);
                    pix.y.push(y);
                }
            }
        }
        pix.x.sort(function (a, b) { return a - b; });
        pix.y.sort(function (a, b) { return a - b; });
        var n = pix.x.length - 1;
        w = pix.x[n] - pix.x[0];
        h = pix.y[n] - pix.y[0];
        var cut = croppedCtx.getImageData(pix.x[0], pix.y[0], w, h);
        croppedCanvas.width = w;
        croppedCanvas.height = h;
        croppedCtx.putImageData(cut, 0, 0);
        return croppedCanvas.toDataURL();
    };
    signature_modal___decorate([
        signature_modal___WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"](SignaturePad),
        signature_modal___metadata("design:type", SignaturePad)
    ], SignatureModal.prototype, "signaturePad", void 0);
    signature_modal___decorate([
        signature_modal___WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"]("content"),
        signature_modal___metadata("design:type", signature_modal___WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* Content */])
    ], SignatureModal.prototype, "content", void 0);
    SignatureModal = signature_modal___decorate([
        signature_modal___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'signature-modal',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\signature\signature.modal.html"*/'<ion-header>\n\n	<ion-navbar>\n\n		<ion-buttons start>\n\n			<button ion-button (click)="cancel()">\n\n				<ion-icon name="close" class="capture" class="orange"></ion-icon>\n\n			</button>\n\n		</ion-buttons>\n\n		<ion-title>Signature</ion-title>\n\n		<ion-buttons end>\n\n			<button ion-button [disabled]="!hasSignature" (click)="done()">\n\n				<ion-icon name="checkmark" class="capture" color="orange"></ion-icon>\n\n			</button>\n\n		</ion-buttons>\n\n	</ion-navbar>\n\n</ion-header>\n\n<ion-content #content class="signature-modal">\n\n	<div  class="signature-guide"><div class="text">Sign above</div></div>\n\n	<signature-pad [options]="signaturePadOptions" (onBeginEvent)="drawStart()" (onEndEvent)="drawComplete()"></signature-pad>\n\n</ion-content>\n\n\n\n<ion-footer>\n\n  <ion-toolbar class="text-center">\n\n    <button ion-button icon-only clear block (click)="clear()">\n\n		<ion-icon name="trash" color="orange"></ion-icon>\n\n    </button>\n\n  </ion-toolbar>\n\n</ion-footer>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\signature\signature.modal.html"*/
        }),
        signature_modal___metadata("design:paramtypes", [signature_modal___WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"], signature_modal___WEBPACK_IMPORTED_MODULE_2_ionic_angular__["q" /* ViewController */]])
    ], SignatureModal);
    return SignatureModal;
}());

//# sourceMappingURL=signature.modal.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/signature/signature.ts
/* harmony import */ var signature___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_forms__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_screen_orientation__ = __webpack_require__(382);
var signature___extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var signature___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var signature___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var signature_Signature = (function (_super) {
    signature___extends(Signature, _super);
    function Signature(modalCtrl, screen) {
        var _this = _super.call(this) || this;
        _this.modalCtrl = modalCtrl;
        _this.screen = screen;
        _this.readonly = false;
        return _this;
    }
    Signature_1 = Signature;
    Signature.prototype.show = function () {
        var _this = this;
        if (this.readonly) {
            return;
        }
        var modal = this.modalCtrl.create(signature_modal_SignatureModal);
        modal.onDidDismiss(function (sigStr) {
            _this.screen.unlock();
            if (sigStr) {
                _this.onChange(sigStr);
            }
        });
        modal.present();
        this.screen.lock(this.screen.ORIENTATIONS.LANDSCAPE);
    };
    signature___decorate([
        signature___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        signature___metadata("design:type", FormElement)
    ], Signature.prototype, "element", void 0);
    signature___decorate([
        signature___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        signature___metadata("design:type", __WEBPACK_IMPORTED_MODULE_5__angular_forms__["FormGroup"])
    ], Signature.prototype, "formGroup", void 0);
    signature___decorate([
        signature___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        signature___metadata("design:type", Boolean)
    ], Signature.prototype, "readonly", void 0);
    Signature = Signature_1 = signature___decorate([
        signature___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'signature',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\signature\signature.html"*/'<div class="signature">\n\n	<img [src]="currentVal" *ngIf="currentVal">\n\n	<button ion-button full large clear (click)="show()">&nbsp;</button>\n\n</div>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\signature\signature.html"*/,
            providers: [
                { provide: __WEBPACK_IMPORTED_MODULE_5__angular_forms__["NG_VALUE_ACCESSOR"], useExisting: signature___WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"](function () { return Signature_1; }), multi: true }
            ]
        }),
        signature___metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["i" /* ModalController */], __WEBPACK_IMPORTED_MODULE_6__ionic_native_screen_orientation__["a" /* ScreenOrientation */]])
    ], Signature);
    return Signature;
    var Signature_1;
}(BaseElement));

//# sourceMappingURL=signature.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/signature/index.ts



//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/gps/gps.ts
/* harmony import */ var gps___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var gps___WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_geolocation__ = __webpack_require__(104);
var gps___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var gps___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var gps_Gps = (function () {
    function Gps(fb, geolocation) {
        this.fb = fb;
        this.geolocation = geolocation;
        this.onChange = new gps___WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.onValidationChange = new gps___WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.readonly = false;
        this.theForm = new gps___WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormGroup"]({});
        this.displayForm = {};
        this.loading = true;
    }
    Gps.prototype.ngOnInit = function () {
        this.refresh();
    };
    Gps.prototype.refresh = function () {
        var _this = this;
        this.loading = true;
        this.geolocation.getCurrentPosition()
            .then(function (pos) {
            _this.latitude = pos.coords.latitude + "";
            _this.longitude = pos.coords.longitude + "";
            _this.loading = false;
        }).catch(function (err) {
            _this.loading = false;
        });
    };
    gps___decorate([
        gps___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        gps___metadata("design:type", Form)
    ], Gps.prototype, "form", void 0);
    gps___decorate([
        gps___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        gps___metadata("design:type", form_submission_FormSubmission)
    ], Gps.prototype, "submission", void 0);
    gps___decorate([
        gps___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        gps___metadata("design:type", DeviceFormMembership)
    ], Gps.prototype, "prospect", void 0);
    gps___decorate([
        gps___WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"](),
        gps___metadata("design:type", Object)
    ], Gps.prototype, "onChange", void 0);
    gps___decorate([
        gps___WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"](),
        gps___metadata("design:type", Object)
    ], Gps.prototype, "onValidationChange", void 0);
    gps___decorate([
        gps___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        gps___metadata("design:type", Boolean)
    ], Gps.prototype, "readonly", void 0);
    Gps = gps___decorate([
        gps___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'gps',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\gps\gps.html"*/'<div class="geolocation">\n\n	<ion-row *ngIf="!loading">\n\n		<ion-col>\n\n		</ion-col>\n\n		<ion-col>\n\n			<button ion-button color="light" icon-only>\n\n				<ion-icon name="refresh"></ion-icon>\n\n			</button>\n\n		</ion-col>\n\n	</ion-row>\n\n	<ion-row *ngIf="loading">\n\n		<ion-col>\n\n			<ion-spinner>Getting location...</ion-spinner>\n\n		</ion-col>\n\n	</ion-row>\n\n</div>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\gps\gps.html"*/
        }),
        gps___metadata("design:paramtypes", [gps___WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormBuilder"], __WEBPACK_IMPORTED_MODULE_3__ionic_native_geolocation__["a" /* Geolocation */]])
    ], Gps);
    return Gps;
}());

//# sourceMappingURL=gps.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/gps/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/address/address.ts
/* harmony import */ var address___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(6);
var address___extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var address___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var address___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var Address = (function (_super) {
    address___extends(Address, _super);
    function Address() {
        var _this = _super.call(this) || this;
        _this.readonly = false;
        return _this;
    }
    Address.prototype.ngOnChanges = function (changes) {
        if (this.element) {
            for (var i = 1; i < 7; i++) {
                if (!this.group.get(this.element.identifier + "_" + i)) {
                    this.group.addControl(this.element.identifier + "_" + i, new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]());
                }
            }
        }
        _super.prototype.ngOnChanges.call(this, changes);
    };
    address___decorate([
        address___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        address___metadata("design:type", Object)
    ], Address.prototype, "element", void 0);
    address___decorate([
        address___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        address___metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormGroup"])
    ], Address.prototype, "rootGroup", void 0);
    address___decorate([
        address___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        address___metadata("design:type", Boolean)
    ], Address.prototype, "readonly", void 0);
    Address = address___decorate([
        address___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'address',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\address\address.html"*/'<div class="address" [formGroup]="group">\n\n	<ion-label class="address-label" stacked [class.required]="element.is_required">{{element.title}}</ion-label>\n\n	<ion-grid>\n\n		<ion-row responsive-sm>\n\n			<ion-col>\n\n				<ion-item>\n\n					<ion-label stacked>Street address</ion-label>\n\n					<ion-input type="text"[attr.name]="element.identifier + \'_1\'" [formControlName]="element.identifier + \'_1\'"></ion-input>\n\n				</ion-item>\n\n			</ion-col>\n\n		</ion-row>\n\n		<ion-row responsive-sm>\n\n			<ion-col>\n\n				<ion-item>\n\n					<ion-label stacked>Address line 2</ion-label>\n\n					<ion-input type="text" [attr.name]="element.identifier + \'_2\'" [formControlName]="element.identifier + \'_2\'"></ion-input>\n\n				</ion-item>\n\n			</ion-col>\n\n		</ion-row>\n\n		<ion-row responsive-sm>\n\n			<ion-col>\n\n				<ion-item>\n\n					<ion-label stacked>City</ion-label>\n\n					<ion-input type="text" [attr.name]="element.identifier + \'_3\'" [formControlName]="element.identifier + \'_3\'"></ion-input>\n\n				</ion-item>\n\n			</ion-col>\n\n			<ion-col>\n\n				<ion-item>\n\n					<ion-label stacked>State</ion-label>\n\n					<ion-input type="text" [attr.name]="element.identifier + \'_4\'" [formControlName]="element.identifier + \'_4\'"></ion-input>\n\n				</ion-item>\n\n			</ion-col>\n\n		</ion-row>\n\n		<ion-row responsive-sm>\n\n			<ion-col>\n\n				<ion-item>\n\n					<ion-label stacked>Zip code</ion-label>\n\n					<ion-input type="text" [attr.name]="element.identifier + \'_5\'" [formControlName]="element.identifier + \'_5\'"></ion-input>\n\n				</ion-item>\n\n			</ion-col>\n\n			<ion-col>\n\n				<ion-item>\n\n					<ion-label stacked >Country</ion-label>\n\n					<ion-select [attr.name]="element.identifier + \'_6\'" [formControlName]="element.identifier + \'_6\'">\n\n						<ion-option value="United States" >United States</ion-option>\n\n						<ion-option value="Afghanistan" >Afghanistan</ion-option>\n\n						<ion-option value="Albania" >Albania</ion-option>\n\n						<ion-option value="Algeria" >Algeria</ion-option>\n\n						<ion-option value="Andorra" >Andorra</ion-option>\n\n						<ion-option value="Antigua and Barbuda" >Antigua and Barbuda</ion-option>\n\n						<ion-option value="Argentina" >Argentina</ion-option>\n\n						<ion-option value="Armenia" >Armenia</ion-option>\n\n						<ion-option value="Australia" >Australia</ion-option>\n\n						<ion-option value="Austria" >Austria</ion-option>\n\n						<ion-option value="Azerbaijan" >Azerbaijan</ion-option>\n\n						<ion-option value="Bahamas" >Bahamas</ion-option>\n\n						<ion-option value="Bahrain" >Bahrain</ion-option>\n\n						<ion-option value="Bangladesh" >Bangladesh</ion-option>\n\n						<ion-option value="Barbados" >Barbados</ion-option>\n\n						<ion-option value="Belarus" >Belarus</ion-option>\n\n						<ion-option value="Belgium" >Belgium</ion-option>\n\n						<ion-option value="Belize" >Belize</ion-option>\n\n						<ion-option value="Benin" >Benin</ion-option>\n\n						<ion-option value="Bhutan" >Bhutan</ion-option>\n\n						<ion-option value="Bolivia" >Bolivia</ion-option>\n\n						<ion-option value="Bosnia and Herzegovina" >Bosnia and Herzegovina</ion-option>\n\n						<ion-option value="Botswana" >Botswana</ion-option>\n\n						<ion-option value="Brazil" >Brazil</ion-option>\n\n						<ion-option value="Brunei" >Brunei</ion-option>\n\n						<ion-option value="Bulgaria" >Bulgaria</ion-option>\n\n						<ion-option value="Burkina Faso" >Burkina Faso</ion-option>\n\n						<ion-option value="Burundi" >Burundi</ion-option>\n\n						<ion-option value="Cambodia" >Cambodia</ion-option>\n\n						<ion-option value="Cameroon" >Cameroon</ion-option>\n\n						<ion-option value="Canada" >Canada</ion-option>\n\n						<ion-option value="Cape Verde" >Cape Verde</ion-option>\n\n						<ion-option value="Central African Republic" >Central African Republic</ion-option>\n\n						<ion-option value="Chad" >Chad</ion-option>\n\n						<ion-option value="Chile" >Chile</ion-option>\n\n						<ion-option value="China" >China</ion-option>\n\n						<ion-option value="Colombia" >Colombia</ion-option>\n\n						<ion-option value="Comoros" >Comoros</ion-option>\n\n						<ion-option value="Congo" >Congo</ion-option>\n\n						<ion-option value="Costa Rica" >Costa Rica</ion-option>\n\n						<ion-option value="Côte d\'Ivoire" >Côte d\'Ivoire</ion-option>\n\n						<ion-option value="Croatia" >Croatia</ion-option>\n\n						<ion-option value="Cuba" >Cuba</ion-option>\n\n						<ion-option value="Cyprus" >Cyprus</ion-option>\n\n						<ion-option value="Czech Republic" >Czech Republic</ion-option>\n\n						<ion-option value="Denmark" >Denmark</ion-option>\n\n						<ion-option value="Djibouti" >Djibouti</ion-option>\n\n						<ion-option value="Dominica" >Dominica</ion-option>\n\n						<ion-option value="Dominican Republic" >Dominican Republic</ion-option>\n\n						<ion-option value="East Timor" >East Timor</ion-option>\n\n						<ion-option value="Ecuador" >Ecuador</ion-option>\n\n						<ion-option value="Egypt" >Egypt</ion-option>\n\n						<ion-option value="El Salvador" >El Salvador</ion-option>\n\n						<ion-option value="Equatorial Guinea" >Equatorial Guinea</ion-option>\n\n						<ion-option value="Eritrea" >Eritrea</ion-option>\n\n						<ion-option value="Estonia" >Estonia</ion-option>\n\n						<ion-option value="Ethiopia" >Ethiopia</ion-option>\n\n						<ion-option value="Fiji" >Fiji</ion-option>\n\n						<ion-option value="Finland" >Finland</ion-option>\n\n						<ion-option value="France" >France</ion-option>\n\n						<ion-option value="Gabon" >Gabon</ion-option>\n\n						<ion-option value="Gambia" >Gambia</ion-option>\n\n						<ion-option value="Georgia" >Georgia</ion-option>\n\n						<ion-option value="Germany" >Germany</ion-option>\n\n						<ion-option value="Ghana" >Ghana</ion-option>\n\n						<ion-option value="Greece" >Greece</ion-option>\n\n						<ion-option value="Grenada" >Grenada</ion-option>\n\n						<ion-option value="Guatemala" >Guatemala</ion-option>\n\n						<ion-option value="Guinea" >Guinea</ion-option>\n\n						<ion-option value="Guinea-Bissau" >Guinea-Bissau</ion-option>\n\n						<ion-option value="Guyana" >Guyana</ion-option>\n\n						<ion-option value="Haiti" >Haiti</ion-option>\n\n						<ion-option value="Honduras" >Honduras</ion-option>\n\n						<ion-option value="Hong Kong" >Hong Kong</ion-option>\n\n						<ion-option value="Hungary" >Hungary</ion-option>\n\n						<ion-option value="Iceland" >Iceland</ion-option>\n\n						<ion-option value="India" >India</ion-option>\n\n						<ion-option value="Indonesia" >Indonesia</ion-option>\n\n						<ion-option value="Iran" >Iran</ion-option>\n\n						<ion-option value="Iraq" >Iraq</ion-option>\n\n						<ion-option value="Ireland" >Ireland</ion-option>\n\n						<ion-option value="Israel" >Israel</ion-option>\n\n						<ion-option value="Italy" >Italy</ion-option>\n\n						<ion-option value="Jamaica" >Jamaica</ion-option>\n\n						<ion-option value="Japan" >Japan</ion-option>\n\n						<ion-option value="Jordan" >Jordan</ion-option>\n\n						<ion-option value="Kazakhstan" >Kazakhstan</ion-option>\n\n						<ion-option value="Kenya" >Kenya</ion-option>\n\n						<ion-option value="Kiribati" >Kiribati</ion-option>\n\n						<ion-option value="North Korea" >North Korea</ion-option>\n\n						<ion-option value="South Korea" >South Korea</ion-option>\n\n						<ion-option value="Kuwait" >Kuwait</ion-option>\n\n						<ion-option value="Kyrgyzstan" >Kyrgyzstan</ion-option>\n\n						<ion-option value="Laos" >Laos</ion-option>\n\n						<ion-option value="Latvia" >Latvia</ion-option>\n\n						<ion-option value="Lebanon" >Lebanon</ion-option>\n\n						<ion-option value="Lesotho" >Lesotho</ion-option>\n\n						<ion-option value="Liberia" >Liberia</ion-option>\n\n						<ion-option value="Libya" >Libya</ion-option>\n\n						<ion-option value="Liechtenstein" >Liechtenstein</ion-option>\n\n						<ion-option value="Lithuania" >Lithuania</ion-option>\n\n						<ion-option value="Luxembourg" >Luxembourg</ion-option>\n\n						<ion-option value="Macedonia" >Macedonia</ion-option>\n\n						<ion-option value="Madagascar" >Madagascar</ion-option>\n\n						<ion-option value="Malawi" >Malawi</ion-option>\n\n						<ion-option value="Malaysia" >Malaysia</ion-option>\n\n						<ion-option value="Maldives" >Maldives</ion-option>\n\n						<ion-option value="Mali" >Mali</ion-option>\n\n						<ion-option value="Malta" >Malta</ion-option>\n\n						<ion-option value="Marshall Islands" >Marshall Islands</ion-option>\n\n						<ion-option value="Mauritania" >Mauritania</ion-option>\n\n						<ion-option value="Mauritius" >Mauritius</ion-option>\n\n						<ion-option value="Mexico" >Mexico</ion-option>\n\n						<ion-option value="Micronesia" >Micronesia</ion-option>\n\n						<ion-option value="Moldova" >Moldova</ion-option>\n\n						<ion-option value="Monaco" >Monaco</ion-option>\n\n						<ion-option value="Mongolia" >Mongolia</ion-option>\n\n						<ion-option value="Montenegro" >Montenegro</ion-option>\n\n						<ion-option value="Morocco" >Morocco</ion-option>\n\n						<ion-option value="Mozambique" >Mozambique</ion-option>\n\n						<ion-option value="Myanmar" >Myanmar</ion-option>\n\n						<ion-option value="Namibia" >Namibia</ion-option>\n\n						<ion-option value="Nauru" >Nauru</ion-option>\n\n						<ion-option value="Nepal" >Nepal</ion-option>\n\n						<ion-option value="Netherlands" >Netherlands</ion-option>\n\n						<ion-option value="New Zealand" >New Zealand</ion-option>\n\n						<ion-option value="Nicaragua" >Nicaragua</ion-option>\n\n						<ion-option value="Niger" >Niger</ion-option>\n\n						<ion-option value="Nigeria" >Nigeria</ion-option>\n\n						<ion-option value="Norway" >Norway</ion-option>\n\n						<ion-option value="Oman" >Oman</ion-option>\n\n						<ion-option value="Pakistan" >Pakistan</ion-option>\n\n						<ion-option value="Palau" >Palau</ion-option>\n\n						<ion-option value="Panama" >Panama</ion-option>\n\n						<ion-option value="Papua New Guinea" >Papua New Guinea</ion-option>\n\n						<ion-option value="Paraguay" >Paraguay</ion-option>\n\n						<ion-option value="Peru" >Peru</ion-option>\n\n						<ion-option value="Philippines" >Philippines</ion-option>\n\n						<ion-option value="Poland" >Poland</ion-option>\n\n						<ion-option value="Portugal" >Portugal</ion-option>\n\n						<ion-option value="Puerto Rico" >Puerto Rico</ion-option>\n\n						<ion-option value="Qatar" >Qatar</ion-option>\n\n						<ion-option value="Romania" >Romania</ion-option>\n\n						<ion-option value="Russia" >Russia</ion-option>\n\n						<ion-option value="Rwanda" >Rwanda</ion-option>\n\n						<ion-option value="Saint Kitts and Nevis" >Saint Kitts and Nevis</ion-option>\n\n						<ion-option value="Saint Lucia" >Saint Lucia</ion-option>\n\n						<ion-option value="Saint Vincent and the Grenadines" >Saint Vincent and the Grenadines</ion-option>\n\n						<ion-option value="Samoa" >Samoa</ion-option>\n\n						<ion-option value="San Marino" >San Marino</ion-option>\n\n						<ion-option value="Sao Tome and Principe" >Sao Tome and Principe</ion-option>\n\n						<ion-option value="Saudi Arabia" >Saudi Arabia</ion-option>\n\n						<ion-option value="Senegal" >Senegal</ion-option>\n\n						<ion-option value="Serbia and Montenegro" >Serbia and Montenegro</ion-option>\n\n						<ion-option value="Seychelles" >Seychelles</ion-option>\n\n						<ion-option value="Sierra Leone" >Sierra Leone</ion-option>\n\n						<ion-option value="Singapore" >Singapore</ion-option>\n\n						<ion-option value="Slovakia" >Slovakia</ion-option>\n\n						<ion-option value="Slovenia" >Slovenia</ion-option>\n\n						<ion-option value="Solomon Islands" >Solomon Islands</ion-option>\n\n						<ion-option value="Somalia" >Somalia</ion-option>\n\n						<ion-option value="South Africa" >South Africa</ion-option>\n\n						<ion-option value="Spain" >Spain</ion-option>\n\n						<ion-option value="Sri Lanka" >Sri Lanka</ion-option>\n\n						<ion-option value="Sudan" >Sudan</ion-option>\n\n						<ion-option value="Suriname" >Suriname</ion-option>\n\n						<ion-option value="Swaziland" >Swaziland</ion-option>\n\n						<ion-option value="Sweden" >Sweden</ion-option>\n\n						<ion-option value="Switzerland" >Switzerland</ion-option>\n\n						<ion-option value="Syria" >Syria</ion-option>\n\n						<ion-option value="Taiwan" >Taiwan</ion-option>\n\n						<ion-option value="Tajikistan" >Tajikistan</ion-option>\n\n						<ion-option value="Tanzania" >Tanzania</ion-option>\n\n						<ion-option value="Thailand" >Thailand</ion-option>\n\n						<ion-option value="Togo" >Togo</ion-option>\n\n						<ion-option value="Tonga" >Tonga</ion-option>\n\n						<ion-option value="Trinidad and Tobago" >Trinidad and Tobago</ion-option>\n\n						<ion-option value="Tunisia" >Tunisia</ion-option>\n\n						<ion-option value="Turkey" >Turkey</ion-option>\n\n						<ion-option value="Turkmenistan" >Turkmenistan</ion-option>\n\n						<ion-option value="Tuvalu" >Tuvalu</ion-option>\n\n						<ion-option value="Uganda" >Uganda</ion-option>\n\n						<ion-option value="Ukraine" >Ukraine</ion-option>\n\n						<ion-option value="United Arab Emirates" >United Arab Emirates</ion-option>\n\n						<ion-option value="United Kingdom" >United Kingdom</ion-option>\n\n						<ion-option value="Uruguay" >Uruguay</ion-option>\n\n						<ion-option value="Uzbekistan" >Uzbekistan</ion-option>\n\n						<ion-option value="Vanuatu" >Vanuatu</ion-option>\n\n						<ion-option value="Vatican City" >Vatican City</ion-option>\n\n						<ion-option value="Venezuela" >Venezuela</ion-option>\n\n						<ion-option value="Vietnam" >Vietnam</ion-option>\n\n						<ion-option value="Yemen" >Yemen</ion-option>\n\n						<ion-option value="Zambia" >Zambia</ion-option>\n\n						<ion-option value="Zimbabwe" >Zimbabwe</ion-option>\n\n					</ion-select>\n\n				</ion-item>\n\n			</ion-col>\n\n		</ion-row>\n\n	</ion-grid>\n\n</div>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\address\address.html"*/
        }),
        address___metadata("design:paramtypes", [])
    ], Address);
    return Address;
}(BaseGroupElement));

//# sourceMappingURL=address.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/address/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/radios/radios.ts
/* harmony import */ var radios___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var radios___WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(6);
var radios___extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var radios___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var radios___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var radios_Radios = (function (_super) {
    radios___extends(Radios, _super);
    function Radios() {
        var _this = _super.call(this) || this;
        _this.readonly = false;
        return _this;
    }
    Radios_1 = Radios;
    Radios.prototype.writeValue = function (obj) {
        if (!obj) {
            for (var i = 0; i < this.element.options.length; i++) {
                if (this.element.options[i].is_default == 1) {
                    obj = this.element.options[i].option;
                    break;
                }
            }
        }
        else if (this.element.options.filter(function (entry) {
            return entry.option == obj;
        }).length == 0) {
            obj = this.element.options[parseInt(obj) - 1].option;
        }
        _super.prototype.writeValue.call(this, obj);
    };
    radios___decorate([
        radios___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        radios___metadata("design:type", FormElement)
    ], Radios.prototype, "element", void 0);
    radios___decorate([
        radios___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        radios___metadata("design:type", radios___WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormGroup"])
    ], Radios.prototype, "formGroup", void 0);
    radios___decorate([
        radios___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        radios___metadata("design:type", Boolean)
    ], Radios.prototype, "readonly", void 0);
    Radios = Radios_1 = radios___decorate([
        radios___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'radios',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\radios\radios.html"*/'<ion-grid radio-group (ionChange)="onChange($event)">\n\n	<ion-row>\n\n		<ion-col col-12 col-sm *ngFor="let option of element.options; let i = index">\n\n			<ion-item>\n\n				<ion-label>{{option.option}}</ion-label>\n\n				<ion-radio color="orange" [attr.name]="formControlName + index" \n\n						   [value]="option.option" \n\n						   [disabled]="readonly"\n\n						   [checked]="option.is_default == 1 || option.option == currentVal"></ion-radio>\n\n			</ion-item>\n\n		</ion-col>\n\n	</ion-row>\n\n</ion-grid>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\radios\radios.html"*/,
            providers: [
                { provide: radios___WEBPACK_IMPORTED_MODULE_3__angular_forms__["NG_VALUE_ACCESSOR"], useExisting: radios___WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"](function () { return Radios_1; }), multi: true }
            ]
        }),
        radios___metadata("design:paramtypes", [])
    ], Radios);
    return Radios;
    var Radios_1;
}(BaseElement));

//# sourceMappingURL=radios.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/radios/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/dropdown/dropdown.ts
/* harmony import */ var dropdown___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var dropdown___WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(6);
var dropdown___extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var dropdown___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var dropdown___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var dropdown_Dropdown = (function (_super) {
    dropdown___extends(Dropdown, _super);
    function Dropdown() {
        var _this = _super.call(this) || this;
        _this.element = {};
        _this.readonly = false;
        return _this;
    }
    Dropdown_1 = Dropdown;
    Dropdown.prototype.writeValue = function (obj) {
        if (!obj) {
            for (var i = 0; i < this.element.options.length; i++) {
                if (this.element.options[i].is_default == 1) {
                    obj = this.element.options[i].option;
                    break;
                }
            }
        }
        else if (this.element && this.element.options.filter(function (entry) {
            return entry.option == obj;
        }).length == 0) {
            obj = this.element.options[parseInt(obj) - 1].option;
        }
        _super.prototype.writeValue.call(this, obj);
    };
    dropdown___decorate([
        dropdown___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        dropdown___metadata("design:type", FormElement)
    ], Dropdown.prototype, "element", void 0);
    dropdown___decorate([
        dropdown___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        dropdown___metadata("design:type", dropdown___WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormGroup"])
    ], Dropdown.prototype, "formGroup", void 0);
    dropdown___decorate([
        dropdown___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        dropdown___metadata("design:type", Boolean)
    ], Dropdown.prototype, "readonly", void 0);
    Dropdown = Dropdown_1 = dropdown___decorate([
        dropdown___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'dropdown',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\dropdown\dropdown.html"*/'<ion-item>\n\n	<ion-label stacked [class.required]="element.is_required">{{element.title}}</ion-label>\n\n	<ion-select [disabled]="readonly" color="orange" [attr.name]="element.id" (ionChange)="onChange($event)" [ngModel]="currentVal">\n\n		<ion-option *ngFor="let option of element.options" [value]="option.option">{{option.option}}</ion-option>\n\n	</ion-select>\n\n</ion-item>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\dropdown\dropdown.html"*/,
            providers: [
                { provide: dropdown___WEBPACK_IMPORTED_MODULE_3__angular_forms__["NG_VALUE_ACCESSOR"], useExisting: dropdown___WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"](function () { return Dropdown_1; }), multi: true }
            ]
        }),
        dropdown___metadata("design:paramtypes", [])
    ], Dropdown);
    return Dropdown;
    var Dropdown_1;
}(BaseElement));

//# sourceMappingURL=dropdown.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/dropdown/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/checkboxes/checkboxes.ts
/* harmony import */ var checkboxes___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var checkboxes___WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(6);
var checkboxes___extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var checkboxes___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var checkboxes___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var checkboxes_Checkboxes = (function (_super) {
    checkboxes___extends(Checkboxes, _super);
    function Checkboxes() {
        var _this = _super.call(this) || this;
        _this.readonly = false;
        return _this;
    }
    Checkboxes_1 = Checkboxes;
    Checkboxes.prototype.writeValue = function (obj) {
        if (!obj) {
            obj = [];
            for (var i = 0; i < this.element.options.length; i++) {
                if (this.element.options[i].is_default == 1) {
                    obj.push(this.element.options[i].option);
                }
            }
        }
        this.currentVal = obj;
    };
    Checkboxes.prototype.onCheckChange = function (event, option) {
        //console.log(event);
        if (event.checked) {
            this.currentVal.push(option.option);
        }
        else {
            var idx = this.currentVal.indexOf(option.option);
            if (idx > -1) {
                this.currentVal.splice(idx, 1);
            }
        }
        this.propagateChange(this.currentVal);
    };
    Checkboxes.prototype.has = function (values, option) {
        return values && values.filter(function (val) {
            return val == option.option;
        }).length > 0;
    };
    checkboxes___decorate([
        checkboxes___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        checkboxes___metadata("design:type", FormElement)
    ], Checkboxes.prototype, "element", void 0);
    checkboxes___decorate([
        checkboxes___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        checkboxes___metadata("design:type", checkboxes___WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormGroup"])
    ], Checkboxes.prototype, "formGroup", void 0);
    checkboxes___decorate([
        checkboxes___WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"](),
        checkboxes___metadata("design:type", Boolean)
    ], Checkboxes.prototype, "readonly", void 0);
    Checkboxes = Checkboxes_1 = checkboxes___decorate([
        checkboxes___WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"]({
            selector: 'checkboxes',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\checkboxes\checkboxes.html"*/'<ion-grid>\n\n	<ion-row>\n\n		<ion-col col-12 col-sm *ngFor="let option of element.options; let i = index">\n\n			<ion-item>\n\n				<ion-label>{{option.option}}</ion-label>\n\n				<ion-checkbox [disabled]="readonly" color="orange" [checked]="has(currentVal, option)" (ionChange)="onCheckChange($event, option)"></ion-checkbox>\n\n			</ion-item>\n\n		</ion-col>\n\n	</ion-row>\n\n</ion-grid>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\checkboxes\checkboxes.html"*/,
            providers: [
                { provide: checkboxes___WEBPACK_IMPORTED_MODULE_3__angular_forms__["NG_VALUE_ACCESSOR"], useExisting: checkboxes___WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"](function () { return Checkboxes_1; }), multi: true }
            ]
        }),
        checkboxes___metadata("design:paramtypes", [])
    ], Checkboxes);
    return Checkboxes;
    var Checkboxes_1;
}(BaseElement));

//# sourceMappingURL=checkboxes.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/checkboxes/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/barcoder/barcoder.ts
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ionic_native_barcode_scanner__ = __webpack_require__(105);
/* harmony import */ var barcoder___WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var barcoder___WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(6);
var barcoder___extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var barcoder___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var barcoder___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var barcoder_Barcoder = (function (_super) {
    barcoder___extends(Barcoder, _super);
    function Barcoder(barcodeScanner) {
        var _this = _super.call(this) || this;
        _this.barcodeScanner = barcodeScanner;
        _this.readonly = false;
        return _this;
    }
    Barcoder_1 = Barcoder;
    Barcoder.prototype.ngOnInit = function () {
    };
    Barcoder.prototype.scan = function () {
        this.barcodeScanner.scan().then(function (scannedData) {
        }).catch(function (err) {
        });
    };
    barcoder___decorate([
        barcoder___WEBPACK_IMPORTED_MODULE_1__angular_core__["Input"](),
        barcoder___metadata("design:type", FormElement)
    ], Barcoder.prototype, "element", void 0);
    barcoder___decorate([
        barcoder___WEBPACK_IMPORTED_MODULE_1__angular_core__["Input"](),
        barcoder___metadata("design:type", barcoder___WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormGroup"])
    ], Barcoder.prototype, "formGroup", void 0);
    barcoder___decorate([
        barcoder___WEBPACK_IMPORTED_MODULE_1__angular_core__["Input"](),
        barcoder___metadata("design:type", Boolean)
    ], Barcoder.prototype, "readonly", void 0);
    Barcoder = Barcoder_1 = barcoder___decorate([
        barcoder___WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"]({
            selector: 'barcoder',template:/*ion-inline-start:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\barcoder\barcoder.html"*/'<button ion-button block padding color="light" (click)="scan()">Scan bar code</button>'/*ion-inline-end:"D:\Business\upwork\RyanSchefke\mobilitEASE\src\components\form-view\elements\barcoder\barcoder.html"*/,
            providers: [
                { provide: barcoder___WEBPACK_IMPORTED_MODULE_3__angular_forms__["NG_VALUE_ACCESSOR"], useExisting: barcoder___WEBPACK_IMPORTED_MODULE_1__angular_core__["forwardRef"](function () { return Barcoder_1; }), multi: true }
            ]
        }),
        barcoder___metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__ionic_native_barcode_scanner__["a" /* BarcodeScanner */]])
    ], Barcoder);
    return Barcoder;
    var Barcoder_1;
}(BaseElement));

//# sourceMappingURL=barcoder.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/barcoder/index.ts

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/components/form-view/elements/index.ts










//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./src/pipes/filter-pipe.ts
/* harmony import */ var filter_pipe___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var filter_pipe___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ArrayFilterPipe = (function () {
    function ArrayFilterPipe() {
    }
    ArrayFilterPipe.prototype.transform = function (items, conditions) {
        return items ? items.filter(function (item) {
            for (var field in conditions) {
                if (conditions[field] && (conditions[field].indexOf(item[field] + "") == -1)) {
                    return false;
                }
            }
            return true;
        }) : [];
    };
    ArrayFilterPipe = filter_pipe___decorate([
        filter_pipe___WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"]({
            name: "filter",
            pure: false
        })
    ], ArrayFilterPipe);
    return ArrayFilterPipe;
}());

//# sourceMappingURL=filter-pipe.js.map
// CONCATENATED MODULE: ./src/util/http.ts
/* harmony import */ var http___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_catch__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_do__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_do___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_do__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_finally__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_finally___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_finally__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_http__ = __webpack_require__(50);
var http___extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var http___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var http___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var HttpService = (function (_super) {
    http___extends(HttpService, _super);
    function HttpService(backend, defaultOptions) {
        var _this = _super.call(this, backend, defaultOptions) || this;
        _this.pendingRequests = 0;
        _this.showLoading = false;
        return _this;
    }
    HttpService.prototype.request = function (url, options) {
        var _this = this;
        var data = url.getBody();
        var threshold = 512;
        return _super.prototype.request.call(this, url, options).map(function (response) {
            var text = response.text();
            console.log(JSON.stringify({
                request: {
                    method: _this.method(url.method),
                    url: url.url.replace(/access\_token\=[\w\d]+/, "access_token=HIDDEN"),
                    headers: url.headers.toJSON(),
                    data: data.length > threshold ? data.substr(0, threshold) : data
                },
                response: {
                    status: response.status,
                    headers: response.headers.toJSON(),
                    data: text.length > threshold ? text.substr(0, threshold) : response.text
                }
            }, null, 2));
            return response;
        });
    };
    HttpService.prototype.method = function (m) {
        switch (m) {
            case __WEBPACK_IMPORTED_MODULE_5__angular_http__["d" /* RequestMethod */].Get:
                return "GET";
            case __WEBPACK_IMPORTED_MODULE_5__angular_http__["d" /* RequestMethod */].Delete:
                return "DELETE";
            case __WEBPACK_IMPORTED_MODULE_5__angular_http__["d" /* RequestMethod */].Head:
                return "HEAD";
            case __WEBPACK_IMPORTED_MODULE_5__angular_http__["d" /* RequestMethod */].Options:
                return "OPTIONS";
            case __WEBPACK_IMPORTED_MODULE_5__angular_http__["d" /* RequestMethod */].Patch:
                return "PATCH";
            case __WEBPACK_IMPORTED_MODULE_5__angular_http__["d" /* RequestMethod */].Post:
                return "POST";
            case __WEBPACK_IMPORTED_MODULE_5__angular_http__["d" /* RequestMethod */].Put:
                return "PUT";
        }
    };
    HttpService = http___decorate([
        http___WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"](),
        http___metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5__angular_http__["g" /* XHRBackend */], __WEBPACK_IMPORTED_MODULE_5__angular_http__["e" /* RequestOptions */]])
    ], HttpService);
    return HttpService;
}(__WEBPACK_IMPORTED_MODULE_5__angular_http__["b" /* Http */]));

//# sourceMappingURL=http.js.map
// CONCATENATED MODULE: ./src/util/currency.ts
/* harmony import */ var currency___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(25);
var currency___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var currency___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


var MyCurrencyDirective = (function () {
    function MyCurrencyDirective(elementRef, _locale) {
        this.elementRef = elementRef;
        this._locale = _locale;
        this.el = this.elementRef.nativeElement;
        this.currencyPipe = new __WEBPACK_IMPORTED_MODULE_1__angular_common__["c" /* CurrencyPipe */](this._locale);
    }
    MyCurrencyDirective.prototype.ngOnInit = function () {
        this.el.value = this.currencyPipe.transform(this.el.value);
    };
    MyCurrencyDirective.prototype.onFocus = function (value) {
        var result = value.replace(/[^\d.]/g, '').replace(".00", "");
        this.el.children[0].value = result;
    };
    MyCurrencyDirective.prototype.onBlur = function (value) {
        this.el.children[0].value = value ? this.currencyPipe.transform(value).replace("USD", "$") : "";
    };
    currency___decorate([
        currency___WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"]("focus", ["$event.target.value"]),
        currency___metadata("design:type", Function),
        currency___metadata("design:paramtypes", [Object]),
        currency___metadata("design:returntype", void 0)
    ], MyCurrencyDirective.prototype, "onFocus", null);
    currency___decorate([
        currency___WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"]("blur", ["$event.target.value"]),
        currency___metadata("design:type", Function),
        currency___metadata("design:paramtypes", [Object]),
        currency___metadata("design:returntype", void 0)
    ], MyCurrencyDirective.prototype, "onBlur", null);
    MyCurrencyDirective = currency___decorate([
        currency___WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"]({ selector: "[myCurrency]" }),
        __param(1, currency___WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"](currency___WEBPACK_IMPORTED_MODULE_0__angular_core__["LOCALE_ID"])),
        currency___metadata("design:paramtypes", [currency___WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], String])
    ], MyCurrencyDirective);
    return MyCurrencyDirective;
}());

//# sourceMappingURL=currency.js.map
// CONCATENATED MODULE: ./src/app/app.module.ts
/* harmony import */ var app_module___WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser_animations__ = __webpack_require__(115);
/* harmony import */ var app_module___WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29_angular2_text_mask__ = __webpack_require__(383);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29_angular2_text_mask___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_29_angular2_text_mask__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__angular_http__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__ionic_native_transfer__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__ionic_native_file__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__ionic_native_device__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__ionic_native_push__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__ionic_native_network__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__ionic_native_camera__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__ionic_native_image_picker__ = __webpack_require__(384);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__ionic_native_sqlite__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__ionic_native_clipboard__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__ionic_native_app_version__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__ionic_native_geolocation__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__ionic_native_barcode_scanner__ = __webpack_require__(105);
var app_module___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






























//import { CustomFormsModule } from 'ng2-validation';















var app_module_AppModule = (function () {
    function AppModule() {
    }
    AppModule = app_module___decorate([
        app_module___WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"]({
            declarations: [
                app_component_MyApp,
                login_Login,
                main_Main,
                Dashboard,
                forms_Forms,
                dispatches_Dispatches,
                settings_Settings,
                IonPullUpComponent,
                form_summary_FormSummary,
                form_review_FormReview,
                form_capture_FormCapture,
                ArrayFilterPipe,
                FormControlPipe,
                form_view_FormView,
                log_LogView,
                SignaturePad,
                business_card_BusinessCard, image_Image, simple_name_SimpleName, signature_Signature, signature_modal_SignatureModal, gps_Gps, Address, checkboxes_Checkboxes, radios_Radios, dropdown_Dropdown, barcoder_Barcoder,
                prospect_search_ProspectSearch,
                ocr_selector_OcrSelector,
                MyCurrencyDirective
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_30__angular_http__["c" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
                app_module___WEBPACK_IMPORTED_MODULE_3_ionic_angular__["f" /* IonicModule */].forRoot(app_component_MyApp),
                __WEBPACK_IMPORTED_MODULE_29_angular2_text_mask__["TextMaskModule"]
            ],
            bootstrap: [app_module___WEBPACK_IMPORTED_MODULE_3_ionic_angular__["e" /* IonicApp */]],
            entryComponents: [
                app_component_MyApp,
                login_Login,
                main_Main,
                Dashboard,
                forms_Forms,
                dispatches_Dispatches,
                settings_Settings,
                IonPullUpComponent,
                form_summary_FormSummary,
                form_review_FormReview,
                form_capture_FormCapture,
                form_view_FormView,
                log_LogView,
                SignaturePad,
                business_card_BusinessCard, image_Image, simple_name_SimpleName, signature_Signature, signature_modal_SignatureModal, gps_Gps, Address, checkboxes_Checkboxes, radios_Radios, dropdown_Dropdown, barcoder_Barcoder,
                prospect_search_ProspectSearch,
                ocr_selector_OcrSelector
            ],
            providers: [
                db_client_DBClient,
                rest_client_RESTClient,
                push_client_PushClient,
                sync_client_SyncClient,
                log_client_LogClient,
                business_service_BussinessClient,
                ImageProcessor,
                __WEBPACK_IMPORTED_MODULE_33__ionic_native_transfer__["a" /* Transfer */],
                __WEBPACK_IMPORTED_MODULE_34__ionic_native_file__["a" /* File */],
                __WEBPACK_IMPORTED_MODULE_35__ionic_native_device__["a" /* Device */],
                __WEBPACK_IMPORTED_MODULE_36__ionic_native_push__["a" /* Push */],
                __WEBPACK_IMPORTED_MODULE_37__ionic_native_network__["a" /* Network */],
                __WEBPACK_IMPORTED_MODULE_38__ionic_native_camera__["a" /* Camera */],
                __WEBPACK_IMPORTED_MODULE_39__ionic_native_image_picker__["a" /* ImagePicker */],
                __WEBPACK_IMPORTED_MODULE_40__ionic_native_sqlite__["a" /* SQLite */],
                __WEBPACK_IMPORTED_MODULE_41__ionic_native_clipboard__["a" /* Clipboard */],
                __WEBPACK_IMPORTED_MODULE_42__ionic_native_app_version__["a" /* AppVersion */],
                __WEBPACK_IMPORTED_MODULE_43__ionic_native_geolocation__["a" /* Geolocation */],
                __WEBPACK_IMPORTED_MODULE_44__ionic_native_barcode_scanner__["a" /* BarcodeScanner */],
                { provide: __WEBPACK_IMPORTED_MODULE_30__angular_http__["b" /* Http */],
                    useFactory: httpFactory,
                    deps: [__WEBPACK_IMPORTED_MODULE_30__angular_http__["g" /* XHRBackend */], __WEBPACK_IMPORTED_MODULE_30__angular_http__["e" /* RequestOptions */]]
                }
            ]
        })
    ], AppModule);
    return AppModule;
}());

function httpFactory(backend, options) {
    return new HttpService(backend, options);
}
//# sourceMappingURL=app.module.js.map
// CONCATENATED MODULE: ./src/config/dev.ts

var CFG = {
    serverUrl: "https://demo-api.leadliaison.com/v1.0",
    androidGcmId: "56276941492"
};
function setupConfig() {
    for (var field in CFG) {
        var val = CFG[field];
        Config[field] = val;
    }
    doSetup();
}
function doSetup() {
    var FileTransfer = (function () {
        function FileTransfer() {
        }
        FileTransfer.prototype.download = function (source, target, successCallback, errorCallback, trustAllHosts, options) {
            setTimeout(function () {
                successCallback && successCallback({
                    isFile: true,
                    isDirectory: false,
                    name: source.substr(source.lastIndexOf("/") + 1),
                    fullPath: source,
                    fileSystem: {},
                    nativeURL: source
                });
            }, 500);
        };
        return FileTransfer;
    }());
    window["FileTransfer"] = FileTransfer;
    if (!window["cordova"]) {
        setTimeout(function () {
            window["cordova"] = {
                file: {
                    dataDirectory: "D:/"
                }
            };
        }, 1000);
        window["device"] = {
            platform: "Android",
            model: "Note7",
            manufacturer: "Google",
            version: "5.2",
            uuid: "ldkcbasdhoaidfyosdvweasadtr"
        };
    }
    ;
}
;
//# sourceMappingURL=dev.js.map
// CONCATENATED MODULE: ./src/config/prod.ts

var prod_CFG = {
    serverUrl: "https://demo-api.leadliaison.com/v1.0",
    androidGcmId: "56276941492"
};
function prod_setupConfig() {
    for (var field in prod_CFG) {
        var val = prod_CFG[field];
        Config[field] = val;
    }
}
//# sourceMappingURL=prod.js.map
// CONCATENATED MODULE: ./src/app/main.ts
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_intl__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_intl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_intl__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_intl_locale_data_jsonp_en_js__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_intl_locale_data_jsonp_en_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_intl_locale_data_jsonp_en_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser_dynamic__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_core__ = __webpack_require__(0);







__WEBPACK_IMPORTED_MODULE_4__angular_core__["enableProdMode"]();
__WEBPACK_IMPORTED_MODULE_2__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */]().bootstrapModule(app_module_AppModule);
__WEBPACK_IMPORTED_MODULE_4__angular_core__["isDevMode"]() ? setupConfig() : prod_setupConfig();
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 110:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 63:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	return new Promise(function(resolve, reject) { reject(new Error("Cannot find module '" + req + "'.")); });
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 63;

/***/ }),

/***/ 67:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	return new Promise(function(resolve, reject) { reject(new Error("Cannot find module '" + req + "'.")); });
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 67;

/***/ })

},[107]);
//# sourceMappingURL=main.js.map