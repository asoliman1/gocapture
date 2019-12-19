import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams, ViewController } from 'ionic-angular';
import { Station } from '../../model/station';

@Component({
  selector: 'page-stations',
  templateUrl: 'stations.html',
})
export class StationsPage {

  @ViewChild(Content) content: Content;

  stations: any[];
  selectedStation: any;
  filteredStations: any[];
  visitedStations: any[];
  disableStationSelection: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewController: ViewController) {
  }

  ionViewDidLoad() {
    this.stations = this.navParams.get("stations")
    this.sortStations();
    this.filteredStations = this.stations;
    this.selectedStation = this.navParams.get("selectedStation");
    this.visitedStations = this.navParams.get("visitedStations") || [];
    this.disableStationSelection = this.navParams.get("disableStationSelection");
  }

  sortStations() { // A.S GOC-317
    this.stations = this.stations.sort((a: Station, b: Station): number => {
      if (a.order < b.order)
        return -1;
      else if (a.order > b.order)
        return 1;
      else
        return 0
    })
  }

  ionViewDidEnter() {
    this.content.resize();
  }

  onCancel() {
    this.viewController.dismiss({ isCancel: true })
  }

  onStationChoose() {
    if (!this.selectedStation) {
      return;
    }
    this.viewController.dismiss({ isCancel: false, station: this.selectedStation });
  }

  getItems(event) {
    let val = event.target.value;
    let regexp = new RegExp(val, "i");
    this.filteredStations = [].concat(this.stations.filter((station) => {
      return !val || regexp.test(station.name);
    }));

  }

}
