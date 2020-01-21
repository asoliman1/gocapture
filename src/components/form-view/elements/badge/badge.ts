import { Subscription } from 'rxjs/Subscription';
import { formViewService } from './../../form-view-service';
import { Countries } from '../../../../constants/constants';
import { RESTClient } from '../../../../services/rest-client';
import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { Form, FormElement, FormSubmission, BarcodeStatus } from "../../../../model";
import { FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseElement } from "../base-element";

import { GOCNFCScanner } from "./Scanners/GOCNFCScanner";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { GOCBarcodeScanner } from "./Scanners/GOCBarcodeScanner";
import { Util } from "../../../../util/util";
import { Platform } from "ionic-angular";
import { Ndef, NFC } from "@ionic-native/nfc";
import { Scanner, ScannerType } from './Scanners/Scanner';
import { DuplicateLeadsService } from "../../../../services/duplicate-leads-service";
import { AppPreferences } from "@ionic-native/app-preferences";
import { Popup } from '../../../../providers/popup/popup';

@Component({
  selector: 'badge',
  templateUrl: 'badge.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Badge), multi: true }
  ]
})
export class Badge extends BaseElement implements OnInit {

  @Input() element: FormElement;
  @Input() formGroup: FormGroup;
  @Input() form: Form;
  @Input() submission: FormSubmission;
  @Input() readonly: boolean = false;

  scanner: Scanner;
  isScanning: boolean = false;
  ButtonBar : Subscription;
  
  constructor(
    private client: RESTClient,
    private popup: Popup,
    private barcodeScanner: BarcodeScanner,
    private utils: Util,
    private platform: Platform,
    private nfc: NFC,
    private ndef: Ndef,
    private duplicateLeadsService: DuplicateLeadsService,
    private appPreferences: AppPreferences,
    private formViewService:formViewService,
    ) {
    super();

  }

  ionViewDidLeave(){
   this.ButtonBar.unsubscribe();
  } 

  ngOnInit(): void {
    this.scanner = this.getScanner();
    this.ButtonBar = this.formViewService.onButtonEmit.subscribe((data)=>{
       if(data === 'scan_barcode') this.scan();
     })
  }

  
  ngOnDestroy(){
    this.ButtonBar.unsubscribe();
  }

  scannerStatusMessage() {
    return this.scanner ? this.scanner.statusMessage : "";
  }

  private scan() {
    if (this.readonly) return;

    this.isScanning = true;

    if(this.element.badge_type !== ScannerType.Nfc)
    this.onProcessingEvent.emit('true');

    console.log("Badge scan started");
    this.utils.setPluginPrefs()
    
    this.scanner.scan(false).then((response) => {

      console.log("Badge scan finished: " + response.scannedId);
      this.isScanning = false;
      this.onProcessingEvent.emit('false');

      if (response.isCancelled) return;
    

      this.onChange(response.scannedId);

      if (this.element.post_show_reconciliation) {
        this.scanner.restart();
        this.submission.hold_submission = 1;
        this.submission.hold_submission_reason = "Post-Show Reconciliation";
        this.fillInElementsWithPlaceholderValue("Scanned");
        this.submission.barcode_processed = BarcodeStatus.PostShowReconsilation;
        return;
      }

     this.popup.showToast({text:'toast.scanned-successfully',params:{badgeName:this.utils.capitalizeFirstLetter(this.scanner.name)}}, "bottom", "success", 1500);

      this.processData(response.scannedId);

    }, (error) => {
      this.onProcessingEvent.emit('false');
      this.isScanning = false;
      console.error("Could not scan badge: " + (typeof error == "string" ? error : JSON.stringify(error)));
    }).catch((error)=>{
      alert(error)
      this.onProcessingEvent.emit('false');
      this.isScanning = false;
    });
  }

  private processData(scannedId: string) {
    this.onProcessingEvent.emit('true');
    // A.S GOC-312
    this.popup.showLoading({text:'alerts.loading.one-moment'});
    this.client.fetchBadgeData(scannedId, this.element.barcode_provider_id, 0, this.form.form_id + '').subscribe((data) => {
      this.onProcessingEvent.emit('false');
      this.scanner.restart();
      this.popup.dismiss('loading');
      console.log("Fetched badge data: " + JSON.stringify(data));
      let barcodeData = data.info;

      if (!barcodeData || barcodeData.length == 0) {
        // this.onProcessingEvent.emit('false');
        return;
      }

      //manage duplicate submissions
      if (data["action"] && data["action"] == "edit_submission") {
        data["form_id"] = this.form.form_id;
        this.duplicateLeadsService.handleDuplicateLeads(this.form, data, null);
      } else {
        this.submission && (this.submission.barcode_processed = BarcodeStatus.Processed);
        this.form["barcode_processed"] = BarcodeStatus.Processed;
        this.fillElementsWithFetchedData(barcodeData);
      }
    }, (err) => {
      this.onProcessingEvent.emit('false');
      this.scanner.restart();
      this.popup.dismiss('loading');

      console.error("Could not fetch badge data: " + (typeof err == "string" ? err : JSON.stringify(err)));

      this.fillInElementsWithPlaceholderValue("Scanned");

      this.handleAcceptingInvalidBadgeData(err);

    });
  }

  fillInElementsWithPlaceholderValue(value) {
    this.form.elements.forEach((element) => {

      if (element.is_filled_from_barcode) {
        element.placeholder = value;
      }
    });
  }

  private handleAcceptingInvalidBadgeData(err) {
    if (this.element.accept_invalid_barcode && err.status == 400) {
      this.submission && (this.submission.barcode_processed = BarcodeStatus.Processed);
      this.form["barcode_processed"] = BarcodeStatus.Processed;
      this.submission.hold_submission = 1;
      this.submission.hold_submission_reason = err.message ? err.message : "";
    } else {
      this.form["barcode_processed"] = BarcodeStatus.Queued;
      this.submission && (this.submission.barcode_processed = BarcodeStatus.Queued);
    }
  }

  private fillElementsWithFetchedData(data) {

    let vals = [];
    data.forEach(entry => {
      let id = this.form.getIdByUniqueFieldName(entry.ll_field_unique_identifier);
      if (id) {
        let value = entry.value;

        if (entry.ll_field_unique_identifier === "Country") {
          for (let country of Countries) {
            // check the name
            if (country.name === entry.value) {
              break;
            }

            // check the aliases for that country
            if (country.aliases && (country.aliases as any).includes(entry.value)) {
              value = country.name;
              break;
            }
          }
        }

        vals.push({ id, value });
      }

    });

    Form.fillFormGroupData(vals, this.formGroup);
  }

  private getScanner(): Scanner {
    if (this.element.badge_type && this.element.badge_type == ScannerType.Nfc) {
      return new GOCNFCScanner(this.nfc, this.ndef, this.platform);
    }
    return new GOCBarcodeScanner(this.barcodeScanner, this.element.barcode_type, this.platform, this.appPreferences);
  }

  setDisabledState(isDisabled: boolean): void {
    //
  }
}
