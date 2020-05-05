import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { FiltersViewComponent } from './filters-view/filters-view';
import { IonicModule } from "ionic-angular";
import { ActivationItemComponent } from './activation-item/activation-item';
import { SkeletonLoadingComponent } from './skeleton-loading/skeleton-loading';
@NgModule({
  declarations: [FiltersViewComponent,
    ActivationItemComponent,
    SkeletonLoadingComponent,
    ],
  imports: [
    IonicModule,
    TranslateModule
  ],
  exports: [FiltersViewComponent,
    ActivationItemComponent,
    SkeletonLoadingComponent,

    ]
})
export class ComponentsModule { }
