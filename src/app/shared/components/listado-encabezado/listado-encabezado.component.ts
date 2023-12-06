import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-listado-encabezado',
  templateUrl: './listado-encabezado.component.html',
  styleUrls: ['./listado-encabezado.component.scss']
})
export class ListadoEncabezadoComponent implements OnInit {

    @Input()
    public titulo: string = '';
  

    ngOnInit(): void {
    }

}
