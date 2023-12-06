import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-comprobante-financiacion-impresion',
    templateUrl: './comprobante-financiacion-impresion.component.html',
    styleUrls: ['./comprobante-financiacion-impresion.component.scss']
})
export class ComprobanteFinanciacionImpresionComponent implements OnInit {

    public publicacionId! : number;
    public operacionId!   : number;
    public monto!         : number;

    public constructor(
        private route: ActivatedRoute,
    ) { }

    public ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            this.publicacionId = params.publicacionId;
            this.operacionId   = params.operacionId;
            this.monto         = params.monto;
        });
    }

}
