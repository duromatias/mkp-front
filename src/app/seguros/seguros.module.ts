import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SegurosRoutingModule } from './seguros-routing.module';
import { SegurosCotizarComponent } from './seguros-cotizar/seguros-cotizar.component';
import { SegurosListarComponent } from './seguros-listar/seguros-listar.component';
import { SharedModule } from '../shared/shared.module';
import { SegurosCardComponent } from './seguros-card/seguros-card.component';
import { SegurosDetallesComponent } from './seguros-detalles/seguros-detalles.component';


@NgModule({
  declarations: [
    SegurosCotizarComponent,
    SegurosListarComponent,
    SegurosCardComponent,
    SegurosDetallesComponent
  ],
  imports: [
    CommonModule,
    SegurosRoutingModule,
    SharedModule
  ]
})
export class SegurosModule { }
