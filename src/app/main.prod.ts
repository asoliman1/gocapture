/// <reference path="../../node_modules/typescript/lib/lib.es6.d.ts" />
import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';

import { setupConfig } from "../config/dev";
import { AppModuleNgFactory } from './app.module.ngfactory';

enableProdMode();
setupConfig();
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
