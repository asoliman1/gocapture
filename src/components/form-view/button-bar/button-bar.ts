import { FormElement } from './../../../model/form-element';
import { Popup } from './../../../providers/popup/popup';
import { FormSubmission, BarcodeStatus } from './../../../model/form-submission';
import { formViewService } from './../form-view-service';
import { Form } from './../../../model/form';
import { Component, OnInit, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormReview } from '../../../views/form-review';
import { DBClient } from '../../../services/db-client';
import { FormCapture } from '../../../views/form-capture';
import { ActionSheetButton } from 'ionic-angular/components/action-sheet/action-sheet-options';
import { FabMenuItem } from '../ionic-fab-label-backdrop/fab-menu';

@Component({
    selector: 'button-bar',
    templateUrl: 'button-bar.html',
})

export class buttonBar implements OnInit {
    @Input() tabButtons = [
        { "type": "submit", "show": 1, "label": "Submit", "order": 1 },
        { "type": "reset", "show": 1, "label": "Reset", "order": 2 },
        { "type": "scan", "show": 1, "label": "Scan", "order": 3 },
        { "type": "recall", "show": 1, "label": "Recall", "order": 4 },
        { "type": "leads", "show": 1, "label": "Leads", "order": 5 },
    ];
    @Input() fabButtons = [
        { "type": "submit", "show": 1, "label": "Submit", "order": 1 },
        { "type": "reset", "show": 1, "label": "Reset", "order": 2 },
        { "type": "scan", "show": 1, "label": "Scan", "order": 3 },
        { "type": "recall", "show": 1, "label": "Recall", "order": 4 },
        { "type": "leads", "show": 1, "label": "Leads", "order": 5 },
    ]
    @Input() form: Form;

    public fabMenuItems: Array<FabMenuItem> = [];
    public fabIcon = "add";

    scanningEls: FormElement[];
    theme: string;
    constructor(
        private navCtrl: NavController,
        private formViewService: formViewService,
        private dbClient: DBClient,
        private popup: Popup,
    ) {
 
    }


    ngOnInit() {
        this.setButtons()
    }

    public onItemSelected(item: FabMenuItem) {
        this.onClick(item.id);
    }

    setButtons() {
        this.filterButtonsWithShow(this.fabButtons);
        this.filterButtonsWithShow(this.tabButtons);
        this.sortButtons(this.fabButtons);
        this.sortButtons(this.tabButtons);
        this.addFabs();
        this.scanningEls = this.form.elements.filter((e) => e.type == 'barcode' || e.type == 'business_card')
    }

    addFabs() {
        this.fabButtons.forEach((e) => {
            this.fabMenuItems.push(new FabMenuItem(e.type, this.getIcon(e), e.label));
        })
    }

    sortButtons(buttons) {
        buttons = buttons.sort((a, b) => {
            if (a.order > b.order)
                return 1;
            else if (a.order < b.order)
                return -1;
            else
                return 0;
        })
    }

    filterButtonsWithShow(buttons) {
        buttons = buttons.filter((e) => e.show == 1);
    }

    getIcon(btn) {
        switch (btn.type) {
            case 'submit':
                return 'send'
            case 'reset':
                return 'refresh'
            case 'scan':
                return 'qr-scanner'
            case 'recall':
                return 'return-left'
            case 'leads':
                return 'list'
        }
    }

    onClick(type) {
        if (type == 'recall') this.recall();
        else if (type == 'leads') this.navCtrl.push(FormReview, { form: this.form, isDispatch: false });
        else if (type == 'scan') this.handleScan()
        else this.formViewService.pushEvent(type);
    }


    recall() {
        this.dbClient.getSubmissions(this.form.form_id, false).subscribe((data) => {
            this.goToLastSubmission(data);
        })
    }

    goToLastSubmission(submissions: FormSubmission[]) {
        for (let index = submissions.length - 1; index > 0; index--) {
            const submission = submissions[index];
            if (!this.isNoProcessedRapidScan(submission) || submission.id != -1) {
                this.navCtrl.push(FormCapture, { form: this.form, submission: submission });
                return;
            }
        }
    }

    isNoProcessedRapidScan(submission) {
        let isScannedAndNoProcessed = submission.barcode_processed == BarcodeStatus.Queued;
        return submission.is_rapid_scan == 1 && isScannedAndNoProcessed && !submission.hold_submission;
    }

    handleScan() {
        if (this.scanningEls.length > 1)
            this.showActionSheet()
        else
            this.formViewService.pushEvent(`scan_${this.scanningEls[0].type}`);
    }

    showActionSheet() {
        this.popup.showActionSheet('Choose from :', [...this.scanningEls.map((e) => {
            let el: ActionSheetButton = {
                text: e.title, handler: () => {
                    this.formViewService.pushEvent(`scan_${e.type}`)
                }
            }
            return el;
        }), {
            text: 'Cancel',
            role: 'cancel'
        }], this.theme);
    }

}