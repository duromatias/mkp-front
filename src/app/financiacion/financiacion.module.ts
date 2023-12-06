import { BannerSimularCreditoRGComponent } from './banner-simular-credito-rg/banner-simular-credito-rg.component';
import { BannerSimularCreditoComponent   } from './banner-simular-credito/banner-simular-credito.component';
import { CommonModule                    } from '@angular/common';
import { CuotaComponent                  } from './cuota/cuota.component';
import { FinanciacionRoutingModule       } from './financiacion-routing.module';
import { NgModule, NO_ERRORS_SCHEMA      } from '@angular/core';
import { SeleccionarCuotaDialogComponent } from './seleccionar-cuota-dialog/seleccionar-cuota-dialog.component';
import { SeleccionarCuotasComponent      } from './seleccionar-cuotas/seleccionar-cuotas.component';
import { DatosFinanciacionComponent      } from './datos-financiacion/datos-financiacion.component';
import { SharedModule                    } from '../shared/shared.module';
import { WpButtonFinanciacionComponent } from './wp-button-financiacion/wp-button-financiacion.component';
import { ComprobanteFinanciacionImpresionComponent } from './comprobante-financiacion-impresion/comprobante-financiacion-impresion.component';
import { ComprobanteFinanciacionContenidoComponent } from './comprobante-financiacion-contenido/comprobante-financiacion-contenido.component';
import { ComprobanteFinanciacionVistaComponent } from './comprobante-financiacion-vista/comprobante-financiacion-vista.component';

@NgModule({
    declarations: [
        SeleccionarCuotasComponent,
        CuotaComponent,
        SeleccionarCuotaDialogComponent,
        BannerSimularCreditoComponent,
        BannerSimularCreditoRGComponent,
        DatosFinanciacionComponent,
        WpButtonFinanciacionComponent,
        ComprobanteFinanciacionImpresionComponent,
        ComprobanteFinanciacionContenidoComponent,
        ComprobanteFinanciacionVistaComponent,
    ],
    imports: [
        CommonModule,
        FinanciacionRoutingModule,
        SharedModule,
    ],
    exports: [
        BannerSimularCreditoComponent,
        BannerSimularCreditoRGComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
})
export class FinanciacionModule { }
