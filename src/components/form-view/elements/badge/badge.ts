import { Countries } from './../../../../constants/constants';
import { RESTClient } from '../../../../services/rest-client';
import {Component, Input, forwardRef, OnInit, Output} from '@angular/core';
import { Form, FormElement, FormSubmission, BarcodeStatus } from "../../../../model";
import { FormGroup, NG_VALUE_ACCESSOR, AbstractControl } from "@angular/forms";
import { BaseElement } from "../base-element";
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

import {GOCNFCScanner} from "./Scanners/GOCNFCScanner";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {GOCBarcodeScanner} from "./Scanners/GOCBarcodeScanner";
import {Util} from "../../../../util/util";
import {Platform} from "ionic-angular";
import {Ndef, NFC} from "@ionic-native/nfc";
import { Scanner, ScannerType } from './Scanners/Scanner';

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

	constructor(private client: RESTClient,
              private toast: ToastController,
              public barcodeScanner: BarcodeScanner,
              public utils: Util,
              public platform: Platform,
              public nfc: NFC,
              public ndef: Ndef) {
		super();
	}

  ngOnInit(): void {
    this.scanner = this.getScanner();
  }

  scannerStatusMessage() {
	  return this.scanner ? this.scanner.statusMessage : "";
  }


  scan() {

    if (this.readonly) {
      return;
    }

    this.onProcessingEvent.emit('true');

    console.log("Badge scan started");
    this.scanner.scan().then(response => {
 
      console.log("Badge scan finished: " + response.scannedId);
      if (response.isCancelled) {
        this.onProcessingEvent.emit('false');
        return;
      }

      this.onChange(response.scannedId); 

      this.toast.create({
        message: this.utils.capitalizeFirstLetter(this.scanner.name) + " scanned successfully",
        duration: 1500,
        position: "bottom",
        cssClass: "success"
      }).present();

      if (this.element.post_show_reconciliation) {
          this.submission.hold_submission = 1;
          this.submission.hold_submission_reason = "Post-Show Reconciliation";

          this.form.elements.forEach((element) => {
            if (element.is_filled_from_barcode) {
              element.placeholder = "Scanned";
            }
          });

        return;
      }

      this.processData(response.scannedId);
    }, (error) => {
      this.onProcessingEvent.emit('false');
      console.error("Could not scan badge: " + (typeof error == "string" ? error : JSON.stringify(error)));
    });
  }

	private processData(scannedId: string) {
    this.client.fetchBadgeData(scannedId, this.element.barcode_provider_id).subscribe((data) => {
      this.onProcessingEvent.emit('false');
      this.scanner.restart();
      console.log("Fetched badge data: " + JSON.stringify(data));
      if(!data || data.length == 0) {
        this.onProcessingEvent.emit('false');
        return;
      }

      this.submission && (this.submission.barcode_processed = BarcodeStatus.Processed);
      this.form["barcode_processed"] = BarcodeStatus.Processed; 
      this.fillElementsWithFetchedData(data);
      this.onProcessingEvent.emit('false');

    }, err => {
      this.onProcessingEvent.emit('false');
      this.scanner.restart();

      console.error("Could not fetch badge data: " + (typeof err == "string" ? err : JSON.stringify(err)));
      this.form.elements.forEach((element) => {

        if (element.is_filled_from_barcode) {
          element.placeholder = "Scanned";
        }
      });

      this.handleAcceptingInvalidBadgeData(err);
    });
  }

  private handleAcceptingInvalidBadgeData(err) {
    if (this.element.accept_invalid_barcode) {
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

        vals.push({id, value});
      }

    });

    Form.fillFormGroupData(vals, this.formGroup);
  }

  private getScanner(): Scanner {
	  if (this.element.badge_type && this.element.badge_type == ScannerType.NFC) {
      return new GOCNFCScanner(this.nfc, this.ndef, this.platform);
    }
    return new GOCBarcodeScanner(this.barcodeScanner, this.element.barcode_type); 
  }

  setDisabledState(isDisabled: boolean): void {
  }


}
