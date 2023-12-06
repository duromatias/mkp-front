import { Component, Input, OnInit } from '@angular/core';
import { Utils } from 'src/app/shared/utils';

@Component({
    selector: 'banner-simular-credito-rg',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class BannerSimularCreditoRGComponent implements OnInit {

    constructor(
        private utils : Utils,
    ) { }

    @Input()
    public publicacion : any;
    
    public url! : string;

    ngOnInit(): void {
        let publicacion = this.publicacion;
        let agencyCode = publicacion.usuario.onboarding_user.business.code;
        let agencyName = publicacion.nombreVendedor;
        let brand = publicacion.marca;
        let model = publicacion.modelo;
        let year = publicacion.anio;
        let price =  '$ '+this.utils.formatNumero(publicacion.precio_sugerido.toString());
        let imageUrl = publicacion.multimedia;
        imageUrl = imageUrl.filter((element: any) => element.es_portada === 'SI')[0].url;

       this.url=`https://info.decreditos.com/simulador-rg?agencyCode=${agencyCode}&agencyName=${agencyName}&brand=${brand}&model=${model}&year=${year}&price=${price}&imageUrl=${imageUrl};`
    }

}
