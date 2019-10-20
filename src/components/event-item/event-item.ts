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

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    if(changes['image'])
    this.checkImageDownload()
  }

  ngOnInit(){
  }

  checkImageDownload(){
    this.imageLoading = this.image.startsWith('https://');
  }

}
