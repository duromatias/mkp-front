import { NgModule 				 } from '@angular/core';
import { Routes 				 } from '@angular/router';
import { RouterModule 			 } from '@angular/router';
import { UsuariosEditarComponent } from './usuarios-editar/usuarios-editar.component';
import { UsuariosListarComponent } from './usuarios-listar/usuarios-listar.component';

const routes: Routes = [
    
    {
        path: '',
        children : [
            {
                path: ':id',
                component: UsuariosEditarComponent
            },
            {
                path: '',
                component: UsuariosListarComponent
            },
        ],
    },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UsuariosRoutingModule { }
