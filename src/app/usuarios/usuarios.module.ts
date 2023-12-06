import { NgModule,  			 } from '@angular/core';
import { NO_ERRORS_SCHEMA 		 } from '@angular/core';
import { SharedModule 			 } from '../shared/shared.module';
import { UsuariosRoutingModule 	 } from './usuarios-routing.module';
import { UsuariosListarComponent } from './usuarios-listar/usuarios-listar.component';
import { UsuariosEditarComponent } from './usuarios-editar/usuarios-editar.component';

@NgModule({
  	declarations: [
    	UsuariosListarComponent,
     	UsuariosEditarComponent
  	],
  	imports: [
    	UsuariosRoutingModule,
		SharedModule
  	],
	exports: [
		UsuariosEditarComponent
	],
	schemas: [
		NO_ERRORS_SCHEMA
	]
})
export class UsuariosModule { }
