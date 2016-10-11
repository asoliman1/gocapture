import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

import { CONFIG } from "../config/dev";

platformBrowserDynamic().bootstrapModule(AppModule);
