import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListadoDataSource } from '../listado.datasource';

@Component({
  selector: 'app-listado-filtros',
  templateUrl: './listado-filtros.component.html',
  styleUrls: ['./listado-filtros.component.scss']
})
export class ListadoFiltrosComponent implements OnInit {

    @Input()
    public textoBuscar: string = 'Buscar...';
    
    @Input()
    public dataSource: ListadoDataSource<any>;

    @Input()
    public filtros: any = {};

    @Input()
    public filtrosFijos: any = {};

    @Input()
    public botonAgregar: boolean = true;

    @Input()
    public agregarTexto: string = 'Agregar';

    @Input()
    public agregarLink: string = '';

    @Output()
    public clickBuscar: EventEmitter<void> = new EventEmitter<void>();

    constructor() { }

    ngOnInit(): void {
        this.dataSource.filtros = this.filtros;
        this.dataSource.filtros.busqueda = null;
        Object.assign(this.dataSource.fixedFilters, this.filtrosFijos);
    }

    public buscar() {
        this.clickBuscar.emit();
        this.dataSource.refreshData();
    }

}
