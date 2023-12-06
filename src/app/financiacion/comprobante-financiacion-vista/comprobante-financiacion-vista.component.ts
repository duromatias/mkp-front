import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-comprobante-financiacion-vista',
    templateUrl: './comprobante-financiacion-vista.component.html',
    styleUrls: ['./comprobante-financiacion-vista.component.scss']
})
export class ComprobanteFinanciacionVistaComponent implements OnInit {

    public publicacionId!    : number;
    public operacionId!      : number;
    public valorPrimerCuota! : number;

    public constructor(
        private route: ActivatedRoute,
    ) { }

    public ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            this.publicacionId     = params.publicacionId;
            this.operacionId       = params.operacionId;
            this.valorPrimerCuota  = params.valorPrimerCuota;
        });
    }

}
