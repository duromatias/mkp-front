import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeviceService } from 'src/app/shared/services/device.service';

type Filtro = {
    valor: any,
    descripcion: string,
}

@Component({
    selector    :   'publicaciones-filtros',
    templateUrl :   './filtros.component.html',
    styleUrls   : [ './filtros.component.scss']
})
export class FiltrosComponent implements OnInit {

    @Input()
    filtrosPorDefecto: any = {};

    @Input()
    filtrosFijos: any = {};

    @Input()
    public filtros: any = {};

    @Output()
    public readonly filtrosChange: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    public mostrarTipoVendedor: boolean = false;

    @Input()
    public mostrarEstado: boolean = false;

    @Input()
    public mostrarFinanciacion : boolean = false;

    @Input()
    public mostrarOportunidad: boolean = false;

    @Input()
    public mostrarEnSubasta: boolean = false;

    @Input()
    baseUrl: string = '/publicaciones';


    public anios               : Filtro[] = [];
    public colores             : Filtro[] = [];
    public localidades         : Filtro[] = [];
    public marcas              : Filtro[] = [];
    public modelos             : Filtro[] = [];
    public monedas             : Filtro[] = [];
    public es_oportunidad      : Filtro[] = [];
    public provincias          : Filtro[] = [];
    public puertas             : Filtro[] = [];
    public tiposCombustible    : Filtro[] = [];
    public tiposVendedor       : Filtro[] = [];
    public condicion           : Filtro[] = [];
    public estados             : Filtro[] = [
        {
            valor: 'activa_vigente',
            descripcion: 'Activa',
        },
        {
            valor: 'activa_vencida',
            descripcion: 'Vencida',
        },
        {
            valor: 'Eliminada',
            descripcion: 'Eliminada',
        }
    ];

    constructor(
        public deviceService : DeviceService,
    ) {

        this.anios.push({ valor: null, descripcion: 'Todos' });

        let toYear = (new Date).getFullYear();
        for(let year=1991; year <= toYear; year++) {
            this.anios.push({
                valor: `${year}`,
                descripcion: `${year}`,
            });
        }

        this.anios.reverse();
    }

    ngOnInit(): void {
        this.filtros = this.filtrosPorDefecto;
    }

    public changed() {
        let filtros = Object.assign(this.filtros, this.filtrosFijos);
        this.filtrosChange.emit(filtros);
    }

    public switchChanged(event : any, nombreFiltro : string) : void {
        let valor = event.checked;
        if(valor){
            this.filtros[nombreFiltro] = 1;
        }
        else{
            this.filtros[nombreFiltro] = 0;

        }
        this.changed();
    }

    //@ts-ignore
    public marcaKeyDown(event: any) {
        if (/[0-9]/.test(event.key)) {
            return false;
        }
    }

    public changeProvincia() : void {
        delete this.filtros.localidad;
        this.changed();
    }

}
