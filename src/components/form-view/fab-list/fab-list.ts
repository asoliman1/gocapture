import { Component, Output, Input, ViewChild, EventEmitter } from '@angular/core';
import { FabContainer } from 'ionic-angular';

export class FabMenuItem {
  constructor(
    public id: string,
    public icon: string,
    public label: string) { }
}

@Component({
  selector: 'custom-fab-menu',
  templateUrl: 'custom-fab-menu.html'
})

export class CustomFabMenu {

  @ViewChild('fab') fab: FabContainer;

  @Input("fabIcon") fabIcon: string;

  @Input("items") items: Array<FabMenuItem> = [];

  @Output("onItemSelected") anOutput = new EventEmitter<FabMenuItem>();

  @Input("hasMargin") hasMargin : boolean;

  public showMenuItem: boolean = false;

  labels : FabMenuItem[] = [];

  constructor() {

  }

  ngOnInit() {
    this.labels = [...this.items];
    this.labels.reverse();
  }

  public hideMenuFab() {
    this.fab.close();
    this.showMenuItems();
  }

  public showMenuItems() {
    this.showMenuItem = this.fab._listsActive;
  }

  public action(item: FabMenuItem) {
    this.hideMenuFab();
    this.anOutput.emit(item);
  }

}
