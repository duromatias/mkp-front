import { NgModule                    } from '@angular/core';
import { RouterModule                } from '@angular/router';
import { Routes                      } from '@angular/router';

import { AgregarPublicacionComponent } from './agregar/agregar-publicacion.component';
import { ConstruccionComponent       } from '../shared/components/construccion/construccion.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { MisPublicacionesComponent } from './mis-publicaciones/component';
import { HomeComponent } from './home/component';

const routes: Routes = [
    {
        path     : '',
        component: HomeComponent,
    },
    {
        path      : 'agregar',
        component : AgregarPublicacionComponent
    },
    {
        path      : 'mis-publicaciones',
        component : MisPublicacionesComponent
    },
    {
        path      : 'mis-publicaciones/:id/editar',
        component : AgregarPublicacionComponent,
    },
    {
        path      : ':id',
        component : ConsultaComponent
    },
];

@NgModule({
    imports : [RouterModule.forChild(routes)],
    exports : [RouterModule]
})
export class PublicacionesRoutingModule { }
