import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'publicaciones-etiqueta',
  templateUrl: './etiqueta.component.html',
  styleUrls: ['./etiqueta.component.scss']
})
export class EtiquetaComponent implements OnInit {

    @Input()
    icono: string ='';

    @Input()
    texto: string ='';

    @Input()
    color: string ='';

    constructor() { }

    ngOnInit(): void {
    }

}
