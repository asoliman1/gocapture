import { Component, Input, SimpleChanges } from '@angular/core';

// A.S GOC-326

@Component({
  selector: 'event-item',
  templateUrl: 'event-item.html'
})
export class EventItemComponent {

  @Input() image : string;
  @Input() sent : number;
  @Input() unsent : number;
  @Input() onHold : number;
  @Input() address : string;
  @Input() name : string;
  @Input() textColor : string;
  @Input() isSyncing : boolean;

  imageLoading : boolean = true;
  submissionsCounter : boolean;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['image']) this.checkImageDownload();
  }

  ngOnInit(){
    this.checkSubmissionsCounter() 
  }

  checkSubmissionsCounter(){
    if( this.isUnidentified(this.unsent) && this.isUnidentified(this.sent) && this.isUnidentified(this.onHold) )
    this.submissionsCounter = false;
    else
    this.submissionsCounter = true; 
  }

  isUnidentified(val){
    return typeof val == 'undefined';
  }

  checkImageDownload(){
    this.imageLoading = this.image.startsWith('https://');
  }

}
