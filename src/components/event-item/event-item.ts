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
  @Input() activation : boolean = false;

  imageLoading : boolean = true;
  submissionsCounter : boolean;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['image']) this.checkImageDownload();
  }

  ngOnInit(){
  }

  isUnidentified(val){
    return typeof val == 'undefined';
  }

  checkImageDownload(){
    if(this.image && !this.activation) this.imageLoading = this.image.startsWith('https://');
    else this.imageLoading = false;
  }

}
