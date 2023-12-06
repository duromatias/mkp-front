import { ApiService           } from 'src/app/shared/services/api.service';
import { Component            } from '@angular/core';
import { CreateMenuItemsEvent } from '../card/component';
import { DeviceService        } from 'src/app/shared/services/device.service';
import { EventEmitter         } from '@angular/core';
import { HostListener         } from '@angular/core';
import { Input                } from '@angular/core';
import { OnDestroy            } from '@angular/core';
import { OnInit               } from '@angular/core';
import { OrdenarOpciones      } from 'src/app/shared/components/layout/listado/ordenar-dialog/ordenarOpciones';
import { OrdenarService       } from 'src/app/shared/components/layout/ordernar.service';
import { Output               } from '@angular/core';
import { SpinnerService       } from 'src/app/shared/services/spinner.service';
import { Subscription         } from 'rxjs';
import { UserService          } from 'src/app/auth/services/user.service';
import { Utils                } from 'src/app/shared/utils';

@Component({
    selector    :   'publicaciones-listado',
    templateUrl :   './component.html',
    styleUrls   : [ './component.scss' ]
})
export class ListadoComponent implements OnInit, OnDestroy {

    private lastCount         : number = 0;
    private loading           : boolean = false;
    private page              : number = 1;
    public  publicaciones     : any[] = [];
    public  showErrorMessage  : boolean = false;
    public  showOportunidad   : boolean = false;
    public  user!             : any;
    public  actualizando      : boolean = false;

    @Input()
    public patronRuta         : string = '/publicaciones/$';

    @Input()
    public filtros : any = {};

    @Input()
    public ordenes : any = {};

    @Input()
    public url : string = '';

    @Input()
    public mostrarFlechasCarousel  : boolean = true ;

    @Output()
    public fetchData: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public cardClick: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public createMenuItems: EventEmitter<CreateMenuItemsEvent> = new EventEmitter<CreateMenuItemsEvent>();

    @Output()
    public clickMeInteresa: EventEmitter<any> = new EventEmitter<any>();

    //ORDENAR
    public ordenarText = '';

    @Input()
    public ordenarOpciones : Array<OrdenarOpciones> = [];

    private subscripciones: Subscription[] = [];

    constructor(
        private apiService     : ApiService,
        public  deviceService  : DeviceService,
        private spinnerService : SpinnerService,
        private ordenarService : OrdenarService,
        private userService    : UserService,
        private utils          : Utils,
    ) { }

    public async ngOnInit(): Promise<void> {
        this.user = this.userService.getUser();
        this.publicaciones = await this.getPublicaciones();
        if(this.publicaciones.length === 0){
            this.showErrorMessage = true;
        }
        if (this.userService.getUser()?.rol_id === 2 || this.userService.getUser()?.rol_id === 1 ) {
            this.showOportunidad = true;
        }

        if(this.deviceService.isMobile){
            this.subscripciones.push(this.ordenarService.getOrdenarIndex().subscribe((index)=>{
                this.selectOrdenarOpcion(index);
            }));
        }

        for (let index = 0; index < this.ordenarOpciones.length; index++) {
            const element = this.ordenarOpciones[index];
            if(element.default){
                this.ordenarText = element.text;
            }
        }
    }

    public ngOnDestroy(): void {
        this.subscripciones.map(i => i.unsubscribe());
    }

    public async actualizarListado() {
        try{
            this.actualizando = true;
            this.publicaciones = await this.getPublicaciones();
        }
        finally{
            this.actualizando = false;
        }
        if (this.publicaciones.length === 0){
            this.showErrorMessage = true;
        }
        else{
            this.showErrorMessage = false;
        }
    }

    public notificarClickMeInteresa($event: any){
        this.clickMeInteresa.emit($event);
    }

    public async getPublicaciones(page: number = 1) : Promise<any[]> {
        this.loading = true;

        try {

            let data = (await this.apiService.getData(this.url, {
                page: page,
                limit: 12,
                filtros: this.getFixedFilters(),
                ordenes: this.ordenes
            }));

            this.fetchData.emit(data);

            let publicaciones = (data.listado as any[]).map((item : any) => {
                item.anio           = item.año;
                item.ubicacion      = item.localidad + ', ' + item.provincia;
                item.precio         = this.utils.formatNumero(item.precio.toString());
                item.multimedia     = item.multimedia.filter((element : any) => element.tipo === "image");
                item.kilometros     = item.kilometros ? this.utils.formatNumero(item.kilometros.toString()) : item.kilometros;
                item.cantidadCuotas = '24';
                item.cuota          = this.utils.formatNumero((424500).toString());
                item.entrega        = this.utils.formatNumero((400000).toString());
                delete item.año;
                delete item.localidad;
                delete item.provincia;
                return item;
            });
            this.lastCount = publicaciones.length;
            return publicaciones;

        } finally {
            this.loading = false;
        }

    }

    public getFixedFilters() {
        if (Object.keys(this.filtros).length === 0) return {};
        let filtersArray : Array<any> = Object.keys(this.filtros);
        let fixedFilters : any = {};
        Object.assign(fixedFilters,this.filtros);
        filtersArray.forEach( e => {
            if (e === 'precio_desde' || e === 'precio_hasta' || e === 'kilometros_desde' || e === 'kilometros_hasta') {
                if(fixedFilters[e] !== null)
                fixedFilters[e] = this.utils.quitarPuntos(fixedFilters[e]);
            }
        });
        return fixedFilters;
    }

    public async append() {
        this.spinnerService.go(async (): Promise<void> => {
            (await this.getPublicaciones(this.page)).map((i) => {
                this.publicaciones.push(i);
            });
        });
    }

    public onCardClick(info: any) {
        this.cardClick.emit(info);
    }

    @HostListener('window:scroll', ['$event'])
    public onScroll(event: any) {

        // si ya está pidiendo datos al servidor,
        // no hacemos nada.
        if (this.loading) {
            return;
        }
        let document = event.srcElement;

        let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
        let max = document.documentElement.scrollHeight;

        if (pos / max > 0.8 )   {

            // Si la última petición vino sin datos, no pedimos nada
            // Probablemente, esto haya que eliminarlo, por ahora funciona.
            if (this.lastCount === 0) {
                return;
            }
            this.page++;
            this.append();
        }
    }

    public onCreateMenuItems(data: CreateMenuItemsEvent) {
        this.createMenuItems.emit(data);
    }

    public setInitPage() : void {
        this.page = 1;
    }

    public selectOrdenarOpcion(index : number) : void {
        let opcion = this.ordenarOpciones[index];
        this.ordenarText = opcion.text;
        this.ordenes = {};
        if(!opcion.default){
            this.ordenes[opcion.nombre]=opcion.value;
        }
        this.actualizarListado();      
        
    }

    public changeFilters(filters : any) : void {
        this.filtros = filters;
        this.setInitPage();
        this.actualizarListado();
        window.scroll(0,0);
    }
}
