import { AuthRoutingModule                 } from './auth-routing.module';
import { EmailComponent                    } from './components/email-dialog/email.component';
import { NgModule                          } from '@angular/core';
import { NO_ERRORS_SCHEMA                  } from '@angular/core';
import { SharedModule                      } from '../shared/shared.module';
import { LoginComponent                    } from './components/login/login.component';
import { LoginDialogAskOnboardingComponent } from './components/login-dialog-ask-onboarding/login-dialog-ask-onboarding.component';
import { RecuperarPasswordComponent        } from './components/recuperar-password/recuperar-password.component';
import { RegisterComponent                 } from './components/register/register.component';
import { RestablecerPasswordComponent      } from './components/restablecer-password/restablecer-password.component';
import { ConsultaTerminosYCondicionesComponent } from './components/consulta-terminos-ycondiciones/consulta-terminos-ycondiciones.component';
import { FinanciacionDialogComponent } from './components/financiacion-dialog/financiacion-dialog.component';
import { DarseBajaDialogComponent } from './components/darse-baja-dialog/darse-baja-dialog.component';
import { AceptarBajaDialogComponent } from './components/aceptar-baja-dialog/aceptar-baja-dialog.component';
import { DatosGuardadosDialogComponent } from './components/datos-guardados-dialog/datos-guardados-dialog.component';
import { MaxFinanciacionDialogComponent } from './components/max-financiacion-dialog/max-financiacion-dialog.component';




@NgModule({
    declarations: [
        EmailComponent,
        LoginComponent,
        LoginDialogAskOnboardingComponent,
        RecuperarPasswordComponent,
        RegisterComponent,
        RestablecerPasswordComponent,
        ConsultaTerminosYCondicionesComponent,
        FinanciacionDialogComponent,
        DarseBajaDialogComponent,
        AceptarBajaDialogComponent,
        DatosGuardadosDialogComponent,
        MaxFinanciacionDialogComponent,
    ],
    imports: [
        AuthRoutingModule,
        SharedModule,
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
    ]
})
export class AuthModule { }
