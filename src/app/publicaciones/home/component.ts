import { ActivatedRoute      } from '@angular/router';
import { ApiService          } from 'src/app/shared/services/api.service';
import { Component           } from '@angular/core';
import { FiltrosComponent    } from '../filtros/filtros.component';
import { FiltrosService      } from 'src/app/shared/components/layout/filtros.service';
import { ListadoComponent    } from 'src/app/publicaciones/listado/component';
import { MenuItemPublicacion } from '../card/component';
import { OnDestroy           } from '@angular/core';
import { OnInit              } from '@angular/core';
import { OrdenarOpciones     } from 'src/app/shared/components/layout/listado/ordenar-dialog/ordenarOpciones';
import { Router              } from '@angular/router';
import { Subscription        } from 'rxjs';
import { UserService         } from 'src/app/auth/services/user.service';
import { ViewChild           } from '@angular/core';
import { DeviceService } from 'src/app/shared/services/device.service';

@Component({
    selector    :   'publicaciones-home',
    templateUrl :   './component.html',
    styleUrls   : [ './component.scss' ]
})
export class HomeComponent implements OnInit, OnDestroy {

    public filtros              : any = {};
    public menuItems            : MenuItemPublicacion[] = [];
    public esAgencia            : boolean = false;
    public mostrarTipoVendedor  : boolean = false;
    public mostrarOportunidad   : boolean = false;
    public precioDesdeConPuntos : string = '';
    public agencia              : any;
    private subscriptions       : Subscription[] = [];
    public isMobile             : boolean = false;
    public currentUser          : any = null;
    public miniPortada          : string = '';
    public portada              : string = '';
    public usuarioInstagram     : string = '';
    public usuarioFacebook      : string = '';


    @ViewChild('listado')
    public listado!: ListadoComponent;

    @ViewChild('filtrosComponent', {static: true})
    public filtrosComponent!: FiltrosComponent;

    public ordenarOpciones : Array<OrdenarOpciones> =[
        {
            value   : '',
            text    : 'Más recientes',
            nombre  : '',
            default : true,
        },
        {
            value   : 'DESC',
            text    : 'Mayor precio',
            nombre  : 'precio',
            default : false,
        },
        {
            value   : 'ASC',
            text    : 'Menor precio',
            nombre  : 'precio',
            default : false, 
        },
        {
            value   : 'DESC',
            text    : 'Con financiación',
            nombre  : 'financiacion',
            default : false, 
        },
    ];


    public constructor(
        public  apiService     : ApiService,
        private deviceService  : DeviceService,
        private filtrosService : FiltrosService, //si se utiliza
        private userService    : UserService,
        private route          : ActivatedRoute,
        private router         : Router,
    ) {

        this.subscriptions.push(this.userService.stateChanged.subscribe(() => {
            this.listado.actualizarListado();
            this.checkRol();
        }));

        const urlTree = this.router.parseUrl(this.router.url);
        if(urlTree.queryParams['search']){
            this.filtros['busqueda_marca_modelo']  = urlTree.queryParams['search'];
            filtrosService.textoBusqueda = urlTree.queryParams['search'];
        }
        else{
            filtrosService.textoBusqueda = '';
        }

    }

    public ngOnInit() : void {
        this.checkRol();
        this.setupBusinessName();

        if(this.deviceService.isMobile) {  
            this.isMobile = true;
        }
    }

    private setupBusinessName() : void {
        let params = this.route.snapshot.params;
        if (Object.keys(params).filter(p => 'business_name').length === 1) {
            this.filtros['business_name'] = params.business_name.replace(/_/g, " ");
            this.mostrarTipoVendedor = false;
            this.obtenerAgencia(params.business_name.replace(/_/g, " "));
        }        
    }

    //@ts-ignore
    public marcaKeyDown(event: any) {
        if (/[0-9]/.test(event.key)) {
            return false;
        }
    }
    
    private checkRol() : void {
        if (this.userService.getUser()?.rol_id === 2 || this.userService.getUser()?.rol_id === 1 ) {
            this.mostrarTipoVendedor = true;
            this.mostrarOportunidad = true;
            if(this.userService.getUser()?.rol_id === 2){
                this.esAgencia = true;
            }
        }
    }

    public async actualizarListado() {
        this.listado.changeFilters(this.filtros);
    }

    public onFetchData(data: any) {
        Object.assign(this.filtrosComponent, data.filtrosDisponibles);
    }

    public onClearFilters() : void {
        for(let key in this.filtros) {
            if (this.filtros[key] && key !== 'business_name') {
                this.filtros[key] = null;
            }
        }
        this.actualizarListado();
    }

    public onCardClick(id: number) {
        this.router.navigateByUrl('/publicaciones/' + id);
    }

    public ngOnDestroy() {
        this.subscriptions.map((i) => {
            i.unsubscribe();
        });
    }

    public buscar(valor : any) : void {
        this.filtros['busqueda_marca_modelo'] = valor;
        this.actualizarListado();
    }

    public async obtenerAgencia(business_name : string){
        this.agencia = await this.apiService.getData(`/agencias/obtener?nombre_agencia=${business_name}&opciones[business.redes_sociales]=true`);
        this.usuarioFacebook = this.agencia.redes_sociales.facebook.toString().substring(25,this.agencia.redes_sociales.facebook.toString().length -1);
        this.usuarioInstagram = this.agencia.redes_sociales.instagram.toString().substring(26,this.agencia.redes_sociales.instagram.toString().length -1);
    }

}
