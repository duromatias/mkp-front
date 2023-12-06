import { Directive, EventEmitter, Input, Output       } from "@angular/core";
import { OnInit          } from "@angular/core";
import { OnDestroy       } from "@angular/core";
import { Router          } from "@angular/router";
import { Subscription    } from "rxjs";
import { AccesoInterface } from "src/app/auth/models/acceso.model";
import { AuthService     } from "src/app/auth/services/auth.service";
import { UserService     } from "src/app/auth/services/user.service";
import { environment } from "src/environments/environment";

@Directive()
export class MenuBaseComponent implements OnInit, OnDestroy {

    @Output () cerrarPanelPrincipal: EventEmitter<string> = new EventEmitter();
    
    public accesos!           : AccesoInterface[];
    public usuarioLogueado!   : boolean;
    public textoGrande!       : string | undefined; 
    public textoChico!        : string | undefined;
    public emailUsuario       : string | undefined;
    public subscriptions      : Subscription[] = [];
    public mostrarDrawer      : boolean = true;
    public consultasPendientes: any;
    public mensajeCotizarSeguro = "Hola, deseo consultar por una cotización de seguro para mi auto.";
    public linkWhatsappCotizarSeguro = '';


    constructor(
        protected authService : AuthService,
        protected userService : UserService,
        protected router      : Router
    ) { }

    public ngOnInit(): void {
        this.subscriptions.push(this.userService.stateChanged.subscribe(() => {
            this.setup();
        }));
        this.consultasPendientes =  this.userService.getConsultasPendientes();
        this.linkWhatsappCotizarSeguro = `https://api.whatsapp.com/send/?phone=${this.userService.getParametros().segurosTelefono}&text=${this.mensajeCotizarSeguro}`;
        this.setup();
    }

    public setup() {
        this.usuarioLogueado = this.authService.estaLogueado();
        this.setupAccesos();
        if (this.usuarioLogueado) {
            this.setInfoUsuario();
        }
    }

    public setupAccesos() {
        this.accesos = (this.userService.getAccesos() as AccesoInterface[])
        .sort((a: AccesoInterface, b: AccesoInterface): number => {
            return b.descripcion === 'Mis Datos' ? -1 : 0;
        });

    }

    public ngOnDestroy() {
        this.subscriptions.map((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    public setInfoUsuario() : void {
        let nombreUsuario = this.userService.getNombreUsuario();
        let razonSocial   = this.userService.getRazonSocial();
        this.emailUsuario  = this.userService.getEmail();
        if (razonSocial && nombreUsuario) {
            this.textoChico  = razonSocial;
            this.textoGrande = nombreUsuario;
        }
        if (razonSocial && !nombreUsuario) {
            this.textoGrande = razonSocial;
        }

        if (!razonSocial && nombreUsuario) {
            this.textoGrande = nombreUsuario;
        }
    }

    public async clickLogout() : Promise<void> {
        await this.authService.logout();
        this.router.navigateByUrl("/");
        window.scroll(0,0);   
    }

    public closeButtonPanelPrincipal($event: any){
        this.cerrarPanelPrincipal.emit($event);
    }
    
    public obtenerSubMenus(acceso : any){
        return this.accesos.filter((item)=>{
            return item.grupo === acceso.descripcion;
        });
    }

    public checkUrl (event : any){
        if(this.router.url === '/auth/login' || this.router.url === '/auth/register'){
            this.closeButtonPanelPrincipal(event);
        }
    }

    public cotizarSeguro(){
        console.log("seguro");
    }
    
}