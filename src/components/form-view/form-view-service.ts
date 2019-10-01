import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class formViewService {
    private buttonEmitSource: BehaviorSubject<string>;

    onButtonEmit: Observable<any>;

    constructor() {
        this.buttonEmitSource = new BehaviorSubject<any>(null);
        this.onButtonEmit = this.buttonEmitSource.asObservable();
    }

    pushEvent(data:string){
        this.buttonEmitSource.next(data);
    }
}