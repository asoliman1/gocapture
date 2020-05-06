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
import { FormCapture } from '../../../../views/form-capture/form-capture';
import { ThemeProvider } from '../../../../providers/theme/theme';


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
  @Input() activation: boolean = false;
  scanner: Scanner;
  public isScanning: boolean = false;
  ButtonBar : Subscription;
  scanCounter = 0;
  private selectedTheme;
  
  constructor(
  public client: RESTClient,
  public popup: Popup,
  public barcodeScanner: BarcodeScanner,
  public utils: Util,
  public platform: Platform,
  public nfc: NFC,
  public ndef: Ndef,
  public duplicateLeadsService: DuplicateLeadsService,
  public appPreferences: AppPreferences,
  public formViewService:formViewService,
  private themeProvider: ThemeProvider,
    ) {
    super();
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  ionViewDidLeave() {
    this.ButtonBar.unsubscribe();
  }

  ngOnInit(): void {
    this.scanner = this.getScanner();
    this.ButtonBar = this.formViewService.onButtonEmit.subscribe((data)=>{
      if(data == 'scan_barcode') this.scan();
      else if(data == 'rescan_barcode') this.scanBadge();
    })
  }
  
  ngOnDestroy(){
    this.ButtonBar.unsubscribe();
  }

  scannerStatusMessage() {
    return this.scanner ? this.scanner.statusMessage : "";
  }

  public scan(){
    if(this.scanCounter > 0 ){
      const buttons = [
        {
          text: 'form-capture.submit-lead',
          handler: () => {
            this.doSubmit.emit('true');
          }
        },
        {
          text: 'login.continue-button',
          handler: () => {
            this.scanBadge();
          }
        }, 
        {
          text: 'general.cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ];


      this.popup.showAlert('Warning',{ text: 'form-capture.scan-prompt-message' },buttons, this.selectedTheme+ ' custom-alert');
    }

    else{
      this.scanBadge();
    }
  }
  public scanBadge() {
    if (this.readonly) return;

    this.isScanning = true;

    if(this.element.badge_type !== "nfc")
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
        this.scanCounter = 1;
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
      this.scanCounter = 0;
      this.onProcessingEvent.emit('false');
      this.isScanning = false;
      console.error("Could not scan badge: " + (typeof error == "string" ? error : JSON.stringify(error)));
    }).catch((error)=>{
      this.scanCounter = 0;
      alert(error)
      this.onProcessingEvent.emit('false');
      this.isScanning = false;
    });
  }
  public processData(scannedId: string) {
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
      if (data["action"] && data["action"] == "edit_submission" && !this.activation) {
        data["form_id"] = this.form.form_id;
        this.duplicateLeadsService.handleDuplicateLeads(this.form, data, null);
      } else {
        this.scanCounter = 1;
        this.submission.barcodeID = scannedId;
        console.log("scanned id from badge", this.submission.barcodeID)
        this.submission && (this.submission.barcode_processed = BarcodeStatus.Processed);
        this.form["barcode_processed"] = BarcodeStatus.Processed;
        this.fillElementsWithFetchedData(barcodeData);
      }
    }, (err) => {
      this.scanCounter = 0;
      this.onProcessingEvent.emit('false');
      this.scanner.restart();
      this.popup.dismiss('loading');
      this.submission.barcodeID = scannedId;
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
  public handleAcceptingInvalidBadgeData(err) {
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
  public fillElementsWithFetchedData(data) {

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
  public getScanner(): Scanner {
    if (this.element.badge_type && this.element.badge_type == "nfc") {
      return new GOCNFCScanner(this.nfc, this.ndef, this.platform);
    }
    return new GOCBarcodeScanner(this.barcodeScanner, this.element.barcode_type, this.platform, this.appPreferences, this.activation);
  }

  setDisabledState(isDisabled: boolean): void {
    //
  }
}
