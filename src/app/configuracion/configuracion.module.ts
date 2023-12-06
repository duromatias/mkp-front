import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { ListarParametrosComponent } from './listar-parametros/listar-parametros.component';
import { SharedModule } from '../shared/shared.module';
import { TerminosCondicionesComponent } from './components/terminos-condiciones/terminos-condiciones.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BannerHomeComponent } from './components/banner-home/banner-home.component';
import { EditarBannerHomeComponent } from './components/editar-banner-home/editar-banner-home.component';


@NgModule({
    declarations: [
        ListarParametrosComponent,
        TerminosCondicionesComponent,
        BannerHomeComponent,
        EditarBannerHomeComponent
    ],
    imports: [
        CommonModule,
        ConfiguracionRoutingModule,
        SharedModule,
        CKEditorModule
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ConfiguracionModule { }
