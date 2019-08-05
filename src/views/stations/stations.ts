import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-stations',
  templateUrl: 'stations.html',
})
export class StationsPage {

  stations: any[];
  selectedStation: any;
  filteredStations: any[];
  visitedStations: any[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewController: ViewController) {
  }

  ionViewDidLoad() {
    this.stations = this.navParams.get("stations");
    this.filteredStations = this.stations;
    this.selectedStation = this.navParams.get("selectedStation");
    this.visitedStations = this.navParams.get("visitedStations") || [];
  }

  onCancel() {
    this.viewController.dismiss({isCancel: true})
  }

  onStationChoose() {
    if (!this.selectedStation) {
      return;
    }
    this.viewController.dismiss({isCancel: false, station: this.selectedStation});
  }

  getItems(event) {
    let val = event.target.value;
    let regexp = new RegExp(val, "i");
    this.filteredStations = [].concat(this.stations.filter((station) => {
      return !val || regexp.test(station.name);
    }));

  }

}
