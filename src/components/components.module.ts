import { NgModule } from '@angular/core';
import { FiltersViewComponent } from './filters-view/filters-view';
import { IonicModule } from "ionic-angular";
@NgModule({
  declarations: [FiltersViewComponent],
  imports: [
    IonicModule
  ],
  exports: [FiltersViewComponent]
})
export class ComponentsModule { }
