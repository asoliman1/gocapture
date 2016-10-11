import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';

import { CONFIG } from "../config/dev";
import { AppModuleNgFactory } from './app.module.ngfactory';

enableProdMode();
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
