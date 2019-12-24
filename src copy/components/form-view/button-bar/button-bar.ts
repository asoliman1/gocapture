import { Keyboard } from '@ionic-native/keyboard';
import { MenuButtons } from './../../../model/menuButton';
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
import { FabMenuItem } from '../fab-list/fab-list'

@Component({
    selector: 'button-bar',
    templateUrl: 'button-bar.html',
})

export class buttonBar implements OnInit {
    tabButtons: MenuButtons;
    fabButtons: MenuButtons;

    @Input() form: Form;
    @Input() show: boolean;
    @Input() disabled: boolean;
    tabsHide : boolean = false;

    public fabMenuItems: Array<FabMenuItem> = [];
    public fabIcon = "add";

    scanningEls: FormElement[];

    constructor(
        private navCtrl: NavController,
        private formViewService: formViewService,
        private dbClient: DBClient,
        private popup: Popup,
        private Keyboard : Keyboard
    ) {

    }

    isTabsVisible(): boolean {
        if (this.show && this.form && this.form.event_style.buttons_menu ) {
            if (this.tabButtons && this.tabButtons.buttons.length && this.tabButtons.is_show) return true;
        }
        return false;
    }

    isFabsVisible(): boolean {
        if (this.show && this.form && this.form.event_style.floating_buttons) {
            if (this.fabButtons && this.fabButtons.buttons.length && this.fabButtons.is_show) return true;
        }
        return false;
    }

    ngOnInit() {
        this.setButtons()
        this.handleKeyboard()
    }

    handleKeyboard(){
        this.Keyboard.onKeyboardWillShow().subscribe((data)=>{
            this.tabsHide = true;
        })

        this.Keyboard.onKeyboardHide().subscribe((data)=>{
            this.tabsHide = false;
        })
    }

    public onItemSelected(item: FabMenuItem) {
        this.onClick(item.id);
    }

    setButtons() {
        this.setTabs();
        this.setFabs();
        this.validateBtns()
        this.addMenuFabs();
    }

    setFabs() {
        this.fabButtons = this.form.event_style.floating_buttons;
        this.fabButtons.buttons = [...this.filterButtonsWithShow(this.fabButtons.buttons)];
        this.fabButtons.buttons = [...this.sortButtons(this.fabButtons.buttons)];
    }

    setTabs() {
        this.tabButtons = this.form.event_style.buttons_menu;
        this.tabButtons.buttons = [...this.filterButtonsWithShow(this.tabButtons.buttons)];
        this.tabButtons.buttons = [...this.sortButtons(this.tabButtons.buttons)];
    }

    addMenuFabs() {
        this.fabButtons.buttons.forEach((e) => {
            this.fabMenuItems.push(new FabMenuItem(e.type, this.getIcon(e), e.label));
        })
    }

    sortButtons(buttons) {
        return buttons.sort((a, b) => {
            if (a.order * 1 > b.order * 1)
                return 1;
            else if (a.order * 1 < b.order * 1)
                return -1;
            else
                return 0;
        })
    }

    filterButtonsWithShow(buttons) {
        return buttons.filter((e) => e.show == "1");
    }

    validateBtns() {
        this.scanningEls = this.form.elements.filter((e) => e.type == 'barcode' || e.type == 'business_card')
        if (!this.scanningEls.length) {
            this.filterBtns((e) => e.type != 'scan')
        }
        let isKioskMode = this.form.is_mobile_kiosk_mode && !this.form.is_mobile_quick_capture_mode;
        if (isKioskMode) {
            this.filterBtns((e) => (e.type != 'recall') && (e.type != 'leads'))
        }
    }

    filterBtns(condition) {
        this.fabButtons.buttons = this.fabButtons.buttons.filter(condition)
        this.tabButtons.buttons = this.tabButtons.buttons.filter(condition)
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
             if(data.length)
            this.goToLastSubmission(data);
        })
    }

    goToLastSubmission(submissions: FormSubmission[]) {
        let submission = submissions.pop();
        if (!this.isNoProcessedRapidScan(submission) || submission.id != -1) {
            this.navCtrl.push(FormCapture, { form: this.form, submission: submission });
            return;
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
        }]);
    }

}