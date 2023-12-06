import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannerHomeComponent } from './components/banner-home/banner-home.component';
import { EditarBannerHomeComponent } from './components/editar-banner-home/editar-banner-home.component';
import { TerminosCondicionesComponent } from './components/terminos-condiciones/terminos-condiciones.component';
import { ListarParametrosComponent } from './listar-parametros/listar-parametros.component';

const routes: Routes = [
    {
        path: 'parametros',
        pathMatch: 'full',
        component: ListarParametrosComponent
    },
    {
        path      : 'terminos-y-condiciones',
        component : TerminosCondicionesComponent
    },
    {
        path      : 'banner',
        component : BannerHomeComponent
    },
    {
        path      : 'banner/:id',
        component : EditarBannerHomeComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
