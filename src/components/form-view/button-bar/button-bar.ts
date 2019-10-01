import { Subscription } from 'rxjs/Subscription';
import { formViewService } from './../form-view-service';
import { Form } from './../../../model/form';
import { Component, OnInit, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'button-bar',
    templateUrl: 'button-bar.html'
})

export class buttonBar implements OnInit {
    buttons = [
        { "type": "submit", "show": 1, "label": "Submit", "order": 1 },
        { "type": "reset", "show": 1, "label": "Reset", "order": 2 },
        { "type": "scan", "show": 1, "label": "Scan", "order": 3 },
        { "type": "recall", "show": 1, "label": "Recall", "order": 4 },
        { "type": "leads", "show": 1, "label": "Leads", "order": 5 },
        // { "type": "record", "show": 1, "label": "Record", "order": 6 }
    ];

    @Input() form: Form;
    EventSubscription : Subscription;
    constructor(
        private navCtrl: NavController,
        private formViewService:formViewService
        ) {
         
    }


    ngOnInit() {
        this.setButtons()
    }



    setButtons() {
        this.buttons = this.buttons.filter((e) => e.show == 1);
        this.buttons.sort((a, b) => {
            if (a.order > b.order)
                return 1;
            else if (a.order < b.order)
                return -1;
            else
                return 0;
        })
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

    onClick(btn) {
        this.formViewService.pushEvent(btn.type);
    }


    recall() {
        
    }



}