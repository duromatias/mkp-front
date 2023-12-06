import { AppComponent             } from './app.component';
import { AppRoutingModule         } from './app-routing.module';
import { AuthModule               } from './auth/auth.module';
import { BrowserAnimationsModule  } from '@angular/platform-browser/animations';
import { BrowserModule            } from '@angular/platform-browser';
import { HttpClientModule         } from '@angular/common/http';
import { Injector                 } from '@angular/core';
import { LocatorService           } from './shared/services/locator.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgModule                 } from '@angular/core';
import { SharedModule             } from './shared/shared.module';
import { LOCALE_ID } from '@angular/core';

import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { environment } from 'src/environments/environment';
import { GoogleTagManagerModule } from 'angular-google-tag-manager';
registerLocaleData(localePt, 'es-AR');


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        AppRoutingModule,
        AuthModule,
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        MatProgressSpinnerModule,
        SharedModule.forRoot(),
        GoogleTagManagerModule.forRoot({
            id: environment.googleTagManagerId,
        }),
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: {
                    dateInput: [
                        'YYYY-MM-DD', // from
                        'DD-MM-YYYY', // to
                    ],
                },
                display: {
                    dateInput: 'DD-MM-YYYY',
                    monthYearLabel: 'MMM YYYY',
                    dateA11yLabel: 'DD-MM-YYYY',
                    monthYearA11yLabel: 'MMMM YYYY',
                },
            }
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(private injector: Injector) {    // Create global Service Injector.
        LocatorService.injector = this.injector;
    }
 }
