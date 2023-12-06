import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing/landing.component';
import { PublicacionesModule } from '../publicaciones/publicaciones.module';
import { SharedModule } from '../shared/shared.module';
import { LandingCardsCarrouselComponent } from './cards-carrousel/cards-carrousel.component';
import { LinkVerMasComponent } from './link-ver-mas/link-ver-mas.component';
import { ImagenesCarrouselComponent } from './imagenes-carrousel/imagenes-carrousel.component';


@NgModule({
    declarations: [
        LandingComponent,
        LandingCardsCarrouselComponent,
        LinkVerMasComponent,
        ImagenesCarrouselComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        PublicacionesModule,
        LandingRoutingModule,
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
    ],
})
export class LandingModule { }
