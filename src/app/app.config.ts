import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from "@angular/common/http";
import { AuthInterceptorService } from "./services/auth-interceptor.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
      provideRouter(routes),
      importProvidersFrom(HttpClientModule, HttpClient),
      {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true,
      },
      importProvidersFrom(BrowserAnimationsModule),
      provideZoneChangeDetection(),
  ],
};