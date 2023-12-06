import { CommonModule                       } from '@angular/common';
import { NgModule                           } from '@angular/core';
import { NO_ERRORS_SCHEMA                   } from '@angular/core';
import { PublicacionesRoutingModule         } from './publicaciones-routing.module';
import { SharedModule                       } from '../shared/shared.module';

import { AgregarPublicacionComponent        } from './agregar/agregar-publicacion.component';
import { ArchivosComponent                  } from './archivos/archivos.component';
import { BannerSubastasComponent            } from './banner-subastas/banner-subastas.component';
import { CardComponent                      } from './card/component';
import { ConsultaComponent                  } from './consulta/consulta.component';
import { FormConsultaComponent              } from './form-consulta/form-consulta.component';
import { HomeComponent                      } from './home/component';
import { ListadoComponent                   } from './listado/component';
import { MisPublicacionesComponent          } from './mis-publicaciones/component';
import { EtiquetaComponent                  } from './etiqueta/etiqueta.component';
import { PublicacionComponent               } from './publicacion/publicacion.component';
import { SubastasSumarDialogComponent       } from './banner-subastas/subastas-sumar-dialog/subastas-sumar-dialog.component';
import { SubastasOnboardingDialogComponent  } from './banner-subastas/subastas-onboarding-dialog/subastas-onboarding-dialog';
import { WpButtonComponent                  } from './wp-button/wp-button.component';
import { FiltrosComponent                   } from './filtros/filtros.component';
import { PublicacionSubastaTerminadaComponent } from './publicacion-subasta-terminada/publicacion-subasta-terminada.component';
import { FinanciacionModule } from '../financiacion/financiacion.module';

@NgModule({
    declarations: [
        AgregarPublicacionComponent,
        ArchivosComponent,
        BannerSubastasComponent,
        CardComponent,
        ConsultaComponent,
        FormConsultaComponent,
        HomeComponent,
        ListadoComponent,
        MisPublicacionesComponent,
        EtiquetaComponent,
        PublicacionComponent,
        SubastasSumarDialogComponent,
        SubastasOnboardingDialogComponent,
        WpButtonComponent,
        FiltrosComponent,
        PublicacionSubastaTerminadaComponent,
    ],
    imports: [
        CommonModule,
        PublicacionesRoutingModule,
        SharedModule,
        FinanciacionModule
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
    ],
    exports : [
        ListadoComponent,
        FiltrosComponent,
        CardComponent,
    ]

})

export class PublicacionesModule { }
