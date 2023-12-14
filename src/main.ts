import { registerLocaleData } from '@angular/common';
import extraLocalePl from '@angular/common/locales/extra/pl';
import localePl from '@angular/common/locales/pl';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

registerLocaleData(localePl, 'pl', extraLocalePl);

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
