import { AfterViewInit          } from '@angular/core';
import { Component              } from '@angular/core';
import { DeviceService          } from 'src/app/shared/services/device.service';
import { EventEmitter           } from '@angular/core';
import { FiltrosService         } from '../filtros.service';
import { HostListener           } from '@angular/core';
import { Input                  } from '@angular/core';
import { LayoutGeneralComponent } from '../general/layout-general.component';
import { ListadoDataSource      } from '../../listado.datasource';
import { MatDrawerMode          } from '@angular/material/sidenav';
import { OnInit                 } from '@angular/core';
import { Output                 } from '@angular/core';
import { OrdenarOpciones        } from './ordenar-dialog/ordenarOpciones';
import { OrdenarService         } from '../ordernar.service';
import { ViewChild              } from '@angular/core';



@Component({
    selector    :   'app-layout-listado',
    templateUrl :   './layout-listado.component.html',
    styleUrls   : [ './layout-listado.component.scss' ]
})
export class LayoutListadoComponent implements OnInit ,AfterViewInit {

    public topFiltros = 0;
    public bottomFiltros = 0; 
    public topBotones = 0;

    private isMisPublicaciones! : boolean;
    public  isMobile            : boolean = true;
    
    private footerHeight : number = 601;

    @ViewChild('layout')
    public layoutGeneral!: LayoutGeneralComponent;

    @ViewChild('divBotones', {static: true})
    private divBotones : any;

    


    @ViewChild('divFiltros', {static: true })
    public divFiltros!: any;

    @Input()
    public mostrarPanelSecundario: boolean = true;

    @Input()
    public dataSource!: ListadoDataSource<any>;

    @Input()
    public titulo: string = '';

    @Input()
    public topComponent : number = 0;

    @Output()
    public onClearFilters: EventEmitter<void> = new EventEmitter<void>();

    public sidenavMode : MatDrawerMode = "side";

    //BUSCADOR
    @Input()
    public redireccionarAlbuscar : boolean = true;

    @Output()
    public eventoBusqueda : EventEmitter<any> = new EventEmitter<any>();

    //ORDENAR
    public ordenarText = '';

    @Input()
    public ordenarOpciones : Array<OrdenarOpciones> = [];


    constructor(
        private deviceService      : DeviceService,
        private filtrosService     : FiltrosService,
        private ordenarService     : OrdenarService,
    ) { }
    ngAfterViewInit(): void {
        this.setBotonesFiltros();
    }

    public setBotonesFiltros() : void {
        let heightFiltros = this.divFiltros.nativeElement.offsetHeight;
        
        if(this.deviceService.isMobile) {
            if(window.innerHeight < heightFiltros ){
                this.topBotones = window.innerHeight - 146;
                return;
            }
            this.topBotones = window.innerHeight - heightFiltros + 125;
            return;
            
        }

        if(window.innerHeight < heightFiltros ){
            this.topBotones = window.innerHeight - 92 -132 - this.topComponent;

        return;   
        }

        this.topBotones = this.divFiltros.nativeElement.offsetHeight;
    }

    ngOnInit() {
        this.deviceService.observe((result: boolean) => {
            this.sidenavMode = result ? 'over' : 'side';
            this.isMobile = result;
        });
        if(this.deviceService.isMobile) {
            this.topFiltros = 72;
            this.topComponent=0;
            this.bottomFiltros = -6;
        }
    }


    public clickClearFilters() {
        this.dataSource?.clearFilters();
        this.onClearFilters.emit();
        if(!this.redireccionarAlbuscar){
            this.filtrosService.limpiarBusqueda();
        }
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event: any){
        setTimeout(()=>{
            this.setBotonesFiltros(),
            0
        });

    }


    @HostListener('window:scroll', ['$event'])
    public onScroll(event: any) {
        if(this.deviceService.isMobile) {
            return;
        }
        this.resizeFilters(event);
        
    }

    private resizeFilters(event : any) : void {
        let heightFiltros = this.divFiltros.nativeElement.offsetHeight;

        let document = event.srcElement;
        let scrollOfTop = document.documentElement.scrollTop;
        if ( scrollOfTop  <= 130 + this.topComponent){
            this.topFiltros = scrollOfTop;
            if(window.innerHeight < heightFiltros ){
                this.topBotones = window.innerHeight - 92 -130 + scrollOfTop - this.topComponent ;
            }
            else{
                this.topBotones = this.divFiltros.nativeElement.offsetHeight;
            }
        }
        else{
            this.topFiltros = 130 + this.topComponent;
            if(window.innerHeight < heightFiltros ){
                this.topBotones = window.innerHeight - 92  ;
            }
            else{
                this.topBotones = this.divFiltros.nativeElement.offsetHeight;
            }
        }

        let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
        let max = document.documentElement.scrollHeight;
        if( (max - pos) < 601){
            this.bottomFiltros = 601 - (max - pos);
            if(window.innerHeight < heightFiltros ){
                console.log('max: ',max,' | pos: ',pos, (max-pos));
                this.topBotones = window.innerHeight - 695 +  (max - pos)   ;
            }
            else{
                let heightRestante = window.innerHeight - (this.footerHeight - (max - pos));
                if((max-pos) < this.footerHeight && heightFiltros + 100 > heightRestante){
                    this.topBotones = heightRestante - 95;
                }
            }
        }
        else{
            this.bottomFiltros = 0;
        }
    }

    public buscarEnListado(event : any) : void {
        this.eventoBusqueda.emit(event);
    }

    public selectOrdenarOpcion(index : number) : void {
        let opcion = this.ordenarOpciones[index];
        console.log('selecciono: ',opcion);
        if(opcion.default){
            this.ordenarText = '';
        }
        else{
            this.ordenarText = opcion.text;
        }
        this.ordenarService.setOrdenarIndex(index);

    }

}
