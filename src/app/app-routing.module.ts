import { AccesosResolver } from './auth/resolvers/accesos.resolver';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouteGuard } from './auth/guards/route.guard';
import { RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing/landing.component';
import { HomeComponent } from './publicaciones/home/component';

const routes: Routes = [

    {
        path             : '',
        resolve          : [AccesosResolver],
        canActivate      : [RouteGuard],
        canActivateChild : [RouteGuard],
        children: [
            {
                //canActivateChild: [LoggedInGuard],
                path: '',
                pathMatch: 'full',
                component: LandingComponent,
            },
            {
                path: 'landing',
                loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule),
            },
            {
                path: 'auth',
                loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
            },
            {
                path: 'usuario',
                loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule),
            },
            {
                path: 'usuarios',
                loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule),
            },
            {
                path: 'publicaciones',
                loadChildren: () => import('./publicaciones/publicaciones.module').then(m => m.PublicacionesModule),
            },
            {
                path: 'configuracion',
                loadChildren: () => import('./configuracion/configuracion.module').then(m => m.ConfiguracionModule)
            },
            {
                path: 'subastas',
                loadChildren: () => import('./subastas/subastas.module').then(m => m.SubastasModule)
            },
            {
                path: 'financiacion',
                loadChildren: () => import('./financiacion/financiacion.module').then(m => m.FinanciacionModule)
            },
            {
                path: 'seguros',
                loadChildren: () => import('./seguros/seguros.module').then(m => m.SegurosModule)
            },
            {
                path: ':business_name',
                pathMatch: 'full',
                component: HomeComponent,
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
