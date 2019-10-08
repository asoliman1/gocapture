import { Injectable } from '@angular/core';
import { Observable,Subject } from 'rxjs';

@Injectable()
export class formViewService {
    private buttonEmitSource: Subject<string>;

    onButtonEmit: Observable<any>;

    constructor() {
        this.buttonEmitSource = new Subject();
        this.onButtonEmit = this.buttonEmitSource.asObservable();
    }

    pushEvent(data:string){
        console.log(`pushed ${data}`)
        this.buttonEmitSource.next(data);
    }
}