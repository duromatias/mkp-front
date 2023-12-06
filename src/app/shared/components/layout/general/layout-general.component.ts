import { Component           } from '@angular/core';
import { DeviceService       } from 'src/app/shared/services/device.service';
import { ElementRef          } from '@angular/core';
import { EventEmitter        } from '@angular/core';
import { FiltrosService      } from '../filtros.service';
import { Input               } from '@angular/core';
import { LayoutBaseComponent } from '../base/layout-base.component';
import { OnDestroy           } from '@angular/core';
import { OnInit              } from '@angular/core';
import { Output              } from '@angular/core';
import { Router              } from '@angular/router';
import { ViewChild           } from '@angular/core';
import { Subscription        } from 'rxjs';

@Component({
    selector    :   'app-layout-general',
    templateUrl :   './layout-general.component.html',
    styleUrls   : [ './layout-general.component.scss' ]
})
export class LayoutGeneralComponent implements OnInit, OnDestroy {

    @ViewChild('layout')
    public layout!: LayoutBaseComponent;

    @Input()
    public mostrarPanelSecundario: boolean = false;

    public clickCerrarPanelPrincipal: boolean = false;

    public cerrarPanelSecundario: boolean = true;

    @Input()
    public lienzo: boolean = true;

    public isMobile!              : boolean;
    public posicionPanelPrincipal : 'start' | 'end' = 'end';
    public posicionPanelSecundario: 'start' | 'end' = 'end';
    public titulo                 : string = '';
    public pantallaInicio         : boolean = false;

    //BUSCADOR
    public mostrarIconoBuscar     : boolean = true;
    public mostrarBuscador        : boolean = false;
    public valueBuscador          : string = '';

    @Input()
    public redireccionarAlbuscar : boolean = true;

    @Output()
    public eventoBusqueda : EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('inputBuscador')
    inputBuscador!: ElementRef;

    private subscripciones: Subscription[] = [];

    constructor(
        private deviceService      : DeviceService,
        private filtrosService     : FiltrosService,
        private router             : Router,
    ) {}

    public ngOnInit(): void {

        if(this.filtrosService.textoBusqueda !== '' && this.deviceService.isMobile && !this.redireccionarAlbuscar){
            this.mostrarBuscador = true;
            this.valueBuscador = this.filtrosService.textoBusqueda;
        }

        this.deviceService.observe((result: boolean) => {
            this.isMobile = result;
            if(!this.isMobile){
                this.posicionPanelSecundario = 'start';
            }
        });
        this.checkUrl();
        if(!this.redireccionarAlbuscar){
            this.subscripciones.push(this.filtrosService.getLimpiarBusqueda$().subscribe(() => this.limpiarBuscador()));
            this.subscripciones.push(this.filtrosService.getTextoBusqueda().subscribe( (texto)=> {
                this.valueBuscador = texto;
                this.toggleBuscador();
            }));

        }
    }

    public ngOnDestroy(): void {
        this.subscripciones.map(i=>i.unsubscribe());
    }

    public getProfilePicture() : string {
        return "assets/images/avatar.png";
    }

    public getDecreditosLogo() : string {
        return "assets/images/decreditos-logo.png";
    }

    public checkUrl(){
        if(this.router.url === '/'){
            this.pantallaInicio = true;
        } else{
            this.pantallaInicio = false;
        }
        if(this.router.url === '/publicaciones/mis-publicaciones'){
            this.titulo = 'Mis Publicaciones';
        }
        if(this.router.url === '/publicaciones/agregar'){
            this.titulo = 'Publicar';
        }
        if(this.router.url === '/usuario/consultas'){
            this.titulo = 'Consultas';
        }
        if(this.router.url === '/usuario/mis-datos'){
            this.titulo = 'Mis Datos';
        }
        if(this.router.url === '/admin/terminos-y-condiciones'){
            this.titulo = 'Términos y Condiciones';
        }
        if(this.router.url === '/usuarios'){
            this.titulo = 'Usuarios';
        }
        if(this.router.url === '/configuracion'){
            this.titulo = 'Configuración';
        }
        if(this.router.url === '/subastas'){
            this.titulo = 'Subastas';
        }
        if(this.router.url === '/usuario/mis-datos/cambiar-password'){
            this.titulo = 'Cambiar contraseña';
        }


    }

    public toggleBuscador() : void {
        if(this.valueBuscador !== '' && !this.mostrarBuscador){
            this.mostrarBuscador = true
            return;
        }
        if(this.valueBuscador !== ''){
            this.valueBuscador = '';
            this.eventoBusqueda.emit(this.valueBuscador);
            this.inputBuscador.nativeElement.focus();
            this.filtrosService.textoBusqueda = '';
            return;
        }
        if(this.mostrarBuscador){
            this.mostrarBuscador = false;
        }
        else{
            this.mostrarBuscador = true;
            setTimeout(()=>this.inputBuscador.nativeElement.focus(),100);
        }
    }

    public limpiarBuscador() : void {
        if(this.mostrarBuscador){
            this.valueBuscador   = '';
            this.mostrarBuscador = false;
            this.filtrosService.textoBusqueda = '';
        }
    }

    public keyupBuscador(event : any) : void {
        if(event.key === 'Enter'){
            if(this.redireccionarAlbuscar){
                this.router.navigateByUrl(`/publicaciones?search=${this.valueBuscador}`);
            }
            else{
                this.eventoBusqueda.emit(this.valueBuscador);
                this.inputBuscador.nativeElement.blur();
            }

        }
    }

    public closeButtonPanelPrincipal($event: any){
        this.clickCerrarPanelPrincipal = true;
        this.cambiarCerrarPanel();
    }

    public closeButtonPanelSecundario($event: any){
        this.cerrarPanelSecundario= false;
        setTimeout( () => {
            this.cerrarPanelSecundario = true;
        }, 1);
    }

    private cambiarCerrarPanel() {
        setTimeout( () => {
            this.clickCerrarPanelPrincipal = false;
        }, 1);
    }
}

