import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaTerminosYCondicionesComponent } from './components/consulta-terminos-ycondiciones/consulta-terminos-ycondiciones.component';
import { LoginComponent } from './components/login/login.component';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { RegisterComponent } from './components/register/register.component';
import { RestablecerPasswordComponent } from './components/restablecer-password/restablecer-password.component';

const routes: Routes = [

    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'recuperar-password',
        component: RecuperarPasswordComponent
    },
    {
        path: 'restablecer-password',
        component: RestablecerPasswordComponent,
    },
    {
        path: 'tyc',
        component: ConsultaTerminosYCondicionesComponent,
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
