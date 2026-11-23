import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { CatalogHttpRepository } from './data/http/catalog-http.repository';
import { PrescriptionHttpRepository } from './data/http/prescription-http.repository';
import { CatalogRepository } from './domain/repositories/catalog.repository';
import { PrescriptionRepository } from './domain/repositories/prescription.repository';
import { routes } from './app.routes';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: PrescriptionRepository, useClass: PrescriptionHttpRepository },
    { provide: CatalogRepository, useClass: CatalogHttpRepository },
  ],
};
