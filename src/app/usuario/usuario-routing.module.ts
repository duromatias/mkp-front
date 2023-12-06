import { NgModule                   } from '@angular/core';
import { RouterModule               } from '@angular/router';
import { Routes                     } from '@angular/router';
import { ConsultaComponent } from '../publicaciones/consulta/consulta.component';

import { CambiarPasswordComponent   } from './components/cambiar-password/cambiar-password.component';
import { ConsultasAmpliarComponent } from './components/consultas-ampliar/consultas-ampliar.component';
import { ConsultasListarComponent } from './components/consultas-listar/consultas-listar.component';
import { MisDatosComponent          } from './components/mis-datos/mis-datos.component';

const routes: Routes = [
    {
        path     : 'mis-datos',
        children : [
            {
                path      : 'cambiar-password',
                component : CambiarPasswordComponent
            },
            {
                path      : '',
                component : MisDatosComponent
            },
        ],
    },
    {
      path      : 'consultas/:id',
      component :ConsultasAmpliarComponent,
    },
    {
      path      : 'consultas',
      component : ConsultasListarComponent,
    },


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsuarioRoutingModule { }
