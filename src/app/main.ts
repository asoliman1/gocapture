import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { setupConfig } from "../config/dev";

setupConfig();
platformBrowserDynamic().bootstrapModule(AppModule);

