import { NgModule         } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule     } from '@angular/router';
import { Routes           } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ComprobanteFinanciacionImpresionComponent } from './comprobante-financiacion-impresion/comprobante-financiacion-impresion.component';
import { ComprobanteFinanciacionVistaComponent } from './comprobante-financiacion-vista/comprobante-financiacion-vista.component';
import { DatosFinanciacionComponent } from './datos-financiacion/datos-financiacion.component';
import { SeleccionarCuotasComponent } from './seleccionar-cuotas/seleccionar-cuotas.component';


const routes: Routes = [
    {
        path      : ':publicacionId/datos-financiacion/:monto',
        component : DatosFinanciacionComponent
    },
    {
        path      : ':publicacionId/seleccionar-cuotas/:monto',
        component : SeleccionarCuotasComponent,
    },
    {
        path      : ':publicacionId/comprobante/:operacionId/:valorPrimerCuota',
        component : ComprobanteFinanciacionVistaComponent,
    },
    {
        path      : ':publicacionId/comprobante/:operacionId/:monto/imprimir',
        component : ComprobanteFinanciacionImpresionComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
    ],
    exports: [RouterModule]
})
export class FinanciacionRoutingModule { }
