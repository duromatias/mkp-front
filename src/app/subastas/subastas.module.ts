import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule 			 } from '../shared/shared.module';
import { SubastasComponent } from './components/subastas-inicio/subastas.component';
import { SubastasRoutingModule 	 } from './subastas-routing.module';
import { SubastasFormComponent } from './components/subastas-form/subastas-form/subastas-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SubastasListarComponent } from './components/subastas-listar/subastas-listar.component';
import { PublicacionesModule } from '../publicaciones/publicaciones.module';

@NgModule({
  	declarations: [
        SubastasComponent,
        SubastasFormComponent,
        SubastasListarComponent,
  	],
  	imports: [
        CommonModule,
    	SubastasRoutingModule,
		SharedModule,
        MatDatepickerModule,
        PublicacionesModule,
  	],
    providers: [
        MatDatepickerModule,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SubastasModule { }
