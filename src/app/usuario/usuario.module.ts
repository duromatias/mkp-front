import { NgModule                   } from '@angular/core';
import { NO_ERRORS_SCHEMA           } from '@angular/core';
import { SharedModule               } from '../shared/shared.module';
import { UsuarioRoutingModule       } from './usuario-routing.module';
import { CambiarPasswordComponent   } from './components/cambiar-password/cambiar-password.component';
import { MisDatosComponent          } from './components/mis-datos/mis-datos.component';
import { ConsultasListarComponent } from './components/consultas-listar/consultas-listar.component';
import { ConsultasAmpliarComponent } from './components/consultas-ampliar/consultas-ampliar.component';
import { AgregarArchivoComponent } from './components/agregar-archivo/agregar-archivo.component';

@NgModule({
    declarations: [
        MisDatosComponent,
        CambiarPasswordComponent,
        ConsultasListarComponent,
        ConsultasAmpliarComponent,
        AgregarArchivoComponent,
    ],
    imports: [
        UsuarioRoutingModule,
        SharedModule,
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
    ]
})
export class UsuarioModule { }
