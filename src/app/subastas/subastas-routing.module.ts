import { Component, NgModule 				 } from '@angular/core';
import { Routes , RouterModule	 } from '@angular/router';
import { SubastasFormComponent } from './components/subastas-form/subastas-form/subastas-form.component';
import { ConstruccionComponent } from '../shared/components/construccion/construccion.component';
import { SubastasComponent } from './components/subastas-inicio/subastas.component';
import { SubastasListarComponent } from './components/subastas-listar/subastas-listar.component';
import { FullscreenOverlayContainer } from '@angular/cdk/overlay';


const routes: Routes = [
    {
        path: '',
        children : [
            {
                path: 'crear',
                component: SubastasFormComponent
            },
            {
                path: 'listar',
                pathMatch: 'full',
                component: SubastasListarComponent
            },
            {
                path: 'editar/:id',
                pathMatch: 'full',
                component: SubastasFormComponent
            },
            {
                path: '',
                component: SubastasComponent
            },
            {
                path:'construccion',
                pathMatch: 'full',
                component: ConstruccionComponent
            }
        ],
    },

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SubastasRoutingModule { }
