import {    ApiService    } from 'src/app/shared/services/api.service';
import {    Component     } from '@angular/core';
import {    DeviceService } from 'src/app/shared/services/device.service';
import {    ElementRef    } from '@angular/core';
import {    EventEmitter  } from '@angular/core';
import {    HostListener  } from '@angular/core';
import {    Input         } from '@angular/core';
import {    MenuService   } from './MenuService';
import * as moment          from 'moment';
import {    OnInit        } from '@angular/core';
import {    Output        } from '@angular/core';
import {    UserService   } from 'src/app/auth/services/user.service';
import {    Utils         } from 'src/app/shared/utils';
import {    ViewChild     } from '@angular/core';

export class MenuItemPublicacion {

    public constructor(
        public readonly text: string,
        public readonly clickFn: Function,
        public readonly icon: string = '',
    ) {

    }

    public click(data: any) {
        this.clickFn(data);
    }
}

export class CreateMenuItemsEvent {
    public constructor(
        public publicacion: any,
        public menuItems: MenuItemPublicacion[],
    ) { }

    public addMenuItem(text: string, clickFn: Function , icon : string = '') {
        this.menuItems.push(new MenuItemPublicacion(text, clickFn,icon));
    }

}

@Component({
    selector    :   'publicaciones-card',
    templateUrl :   './component.html',
    styleUrls   : [ './component.scss']
})
export class CardComponent implements OnInit {

    public showMenu : boolean = false;

    @Input()
    public user!        : any;

    @Input()
    public publicacion! : any;

    @Input()
    public menuItems : MenuItemPublicacion[] = [];

    @Input()
    public anio               : string = "";

    @Input()
    public cantidadCuotas     : string = "";

    @Input()
    public cuota              : string = "";

    @Input()
    public entrega            : string = "";

    @Input()
    public es_oportunidad     : boolean = false;

    @Input()
    public financiacion       : boolean = false;

    @Input()
    public mostrarFlechasCarousel  : boolean = true ;

    @Input()
    public kilometros         : string = "";

    @Input()
    public marca             : string = "";

    @Input()
    public modelo             : string = "";

    @Input()
    public multimedia         : Array<any> = [];

    @Input()
    public precio             : string = "";

    @Input()
    public showOportunidad    : boolean = false;

    @Input()
    public ubicacion          : string = "";

    public es_subasta         : boolean = false;

    public precio_base        :any;

    public simboloMoneda      :any;

    //Subasta
    public terminada : boolean = false;
    public ganando   : boolean = false;
    public perdiendo : boolean = false;

    @Output()
    public createMenuItems: EventEmitter<CreateMenuItemsEvent> = new EventEmitter<CreateMenuItemsEvent>();

    @Output()
    public clickMeInteresa: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('menu', {static: true, read: ElementRef})
    private menu!: ElementRef;

    constructor(
        private apiService    : ApiService,
        private deviceService : DeviceService,
        private menuService   : MenuService,
        public  userService   : UserService,
        public  utils         : Utils,
    ) {}

    public ngOnInit(): void {
        this.setPortada();
        this.createMenuItems.emit(new CreateMenuItemsEvent(this.publicacion, this.menuItems));
        this.menuService.closeAll.subscribe(() => {
            this.showMenu = false;
        })

        this.checkSubasta();
        this.verificarSimboloPrecio();

    }

    private checkSubasta() : void {
        if (this.publicacion.subasta !== null) {

            this.es_subasta = true;

            if (this.publicacion.subasta.fecha_fin_ofertas < moment().format('YYYY-MM-DD')){
                this.terminada = true;
            }

            if(!this.terminada && this.publicacion.ofertas_ultima_oferta_propia){
                let idUltimaOferta = this.publicacion.ofertas_ultima_oferta.id;
                let idUltimaOfertaPropia = this.publicacion.ofertas_ultima_oferta_propia.id;
                if(idUltimaOferta === idUltimaOfertaPropia){
                    this.ganando = true;
                }
                else{
                    this.perdiendo = true;
                }
            }
        }
    }

    private setPortada() : void {
        if(this.multimedia.length <= 1  ){
            return;
        }
        let indexOfMultimedia=0;
        for (let index = 0; index < this.multimedia.length; index++) {
            const element = this.multimedia[index];
            if (element.es_portada === "SI"){
                indexOfMultimedia = index;
            }
        }
        let portada = this.multimedia[indexOfMultimedia];
        this.multimedia.splice(indexOfMultimedia,1);
        this.multimedia.unshift(portada);
    }

    @HostListener('document:click', ['$event'])
    public clickOutside(event: any) {
        if (!this.menu!.nativeElement.contains(event.target)) {
            this.showMenu = false;
        }
        //console.log('click fuera');
    }

    @HostListener('click', ['$event'])
    public clickInside(event: any) {
        if (!this.menu!.nativeElement.contains(event.target)) {
            this.showMenu = false;
        }
        //console.log('click fuera');
    }

    public clickMenuButton(event: any) {
        if(!this.userService.esAdministrador() && this.terminada){
            return;
        }
        if(this.menuItems.length === 0){
            return false;
        }
        if(this.showMenu){
            this.showMenu = false;
        }
        else{
            this.menuService.closeAll.emit();
            this.showMenu = true;
        }
        event.stopPropagation()
        event.preventDefault()
        return false;
    }

    public mouseOverCarousel(event : any) : void {
        if(this.deviceService.isMobile){
            return;
        }
        this.clickMenuButton(event);
    }

    public clickMenuBackdrop(event: any) {
        this.clickMenuButton(event);
    }

    public clickOption(event : any , fn : Function  = () =>{}){
        fn();
        event.stopPropagation();
        event.preventDefault();
        return false;
    }

    public async guardarMeInteresa($event: any){
        $event.stopPropagation();
        $event.preventDefault();

        var id = this.publicacion.id;
        if (!this.publicacion.favorito){
            this.publicacion.favorito = await this.apiService.post(`/publicaciones/${id}/favoritos`,{})
        } else{
            await this.apiService.delete(`/publicaciones/${id}/favoritos`)
            this.publicacion.favorito = null;
        }

        this.clickMeInteresa.emit(this.publicacion.favorito);

    }

    public mouseDownOption($event: any) {
        $event.stopPropagation();
        $event.preventDefault();
        return false;
    }

    public async addClick(){
      this.apiService.mostrarMensajes = false;
      var id = this.publicacion.id;
      await this.apiService.post(`/publicaciones/${id}/contarClick`,{})
      this.apiService.mostrarMensajes = true;
    }

    public verificarSimboloPrecio() {
        if(this.publicacion.moneda === 'Pesos'){
            this.simboloMoneda = '$'
        }else{
            this.simboloMoneda = 'U$S'
        }
    }

    @HostListener("mouseleave")
    public quitarMenu(){
        this.menuService.closeAll.emit();
    }
}
