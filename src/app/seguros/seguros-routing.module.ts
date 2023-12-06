import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SegurosCotizarComponent } from './seguros-cotizar/seguros-cotizar.component';
import { SegurosListarComponent } from './seguros-listar/seguros-listar.component';
import { SegurosDetallesComponent } from './seguros-detalles/seguros-detalles.component';

const routes: Routes = [
    {
        path      : 'cotizar',
        component : SegurosCotizarComponent
    },
    {
        path      : 'listar',
        component : SegurosListarComponent
    },
    {
        path      : 'detalles',
        component : SegurosDetallesComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SegurosRoutingModule { }
