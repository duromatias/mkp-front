import { ApiService           } from 'src/app/shared/services/api.service';
import { Component            } from '@angular/core';
import { CreateMenuItemsEvent } from '../card/component';
import { environment          } from 'src/environments/environment'
import { FiltrosComponent     } from '../filtros/filtros.component';
import { Input                } from '@angular/core';
import { ListadoComponent     } from 'src/app/publicaciones/listado/component';
import { OnInit               } from '@angular/core';
import { OrdenarOpciones      } from 'src/app/shared/components/layout/listado/ordenar-dialog/ordenarOpciones';
import { Router               } from '@angular/router';
import { SpinnerService       } from 'src/app/shared/services/spinner.service';
import { Subscription         } from 'rxjs';
import { UserService          } from 'src/app/auth/services/user.service';
import { ViewChild            } from '@angular/core';
import { DeviceService        } from '../../shared/services/device.service';

@Component({
    selector    : 'app-mis-publicaciones',
    templateUrl : './component.html',
    styleUrls   : ['./component.scss']
})
export class MisPublicacionesComponent implements OnInit {

    public agenciaLink         : string = "";
    public agenciaName         : string = '';
    public isAdministrator!    : boolean;
    public isDesktop!          : boolean;
    public isMobile!           : boolean;
    public mTop                : number = 31;
    public topMisPublicaciones : number = 0;
    public user                : any;

    @Input()
    public mostrarOportunidad  : boolean = false;
    public subasta             : any;
    public filtros             : any = {
        estado: 'activa_vigente',
    };

    @ViewChild('listado', {static: true})
    public listado!: ListadoComponent;

    @ViewChild('filtrosComponent', {static: true})
    public filtrosComponent!: FiltrosComponent;

    private subscriptions : Subscription[] = [];

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
        public  apiService    : ApiService,
        private deviceService : DeviceService,
        private router        : Router,
        private userService   : UserService,
    ) {
        this.subscriptions.push(this.userService.stateChanged.subscribe(() => {
            this.listado.actualizarListado();
        }));
    }

    public async onCreateMenuItems(event: CreateMenuItemsEvent) {

        if (event.publicacion.estado === 'Activa') {

            if(!Array.isArray(this.subasta)){
                if(this.subasta.puede_inscribir  && event.publicacion.subasta === null){
                    event.addMenuItem('Subastar', (publicacion : any) => {
                        this.router.navigateByUrl(`/publicaciones/mis-publicaciones/${publicacion.id}/editar?inscribir_subasta_id=${this.subasta.id}`);
                    }

                    ,'gavel');
                }
            }
            if (!this.userService.esAdministrador()) {
                event.addMenuItem('Modificar', (publicacion : any) => {
                    this.router.navigate([`/publicaciones/mis-publicaciones/${publicacion.id}/editar`]);
                }
                ,'edit');
            }

            event.addMenuItem('Eliminar',  (publicacion : any) => {
                //@todo: Revisar porqué se crea dos veces el spinner...
                SpinnerService.instance.go(async (): Promise<void> => {
                    /* Esta validación tiene que ser desde el back
                    if(publicacion.ofertas_ultima_oferta && !this.userService.esAdministrador()){
                        this.snackBarService.show('No se puede modificar la publicación debido a que presenta ofertas activas')
                        return;
                    }*/
                    await this.apiService.delete(`/publicaciones/*/mis-publicaciones/${publicacion.id}`);
                    await this.actualizarListado();
                });
            },'delete');
        }
    }

    public async ngOnInit() {
        this.filtrosComponent.filtrosPorDefecto = {
            estado: 'activa_vigente',
        };
        this.user    = this.userService.getUser();
        this.subasta = await this.apiService.getData(`/subastas/*/disponible`);
        this.setupDatosAgencia();
        if(this.userService.esAdministrador()){
            this.isAdministrator = true;
            this.mTop = 0;
        }
        else{
            this.isAdministrator = false;
            this.topMisPublicaciones = 77;
        }

        this.deviceService.observe((result:boolean) => {
            this.isDesktop = !result;
            this.isMobile = result;
            if(this.isMobile) {
                this.mTop = 16;
            }
            //this.posicionPanelPrincipal = result.matches ? 'start' : 'end';
        });
        this.filtros['estado'] = 'activa_vigente';

        if (this.userService.getUser()?.rol_id === 2 || this.userService.getUser()?.rol_id === 1 ) {
            this.mostrarOportunidad = true;
        }
    }

    public async actualizarListado() {
        this.listado.changeFilters(this.filtros);
    }

    public onClearFilters() : void {
        for(let key in this.filtros) {
            if (this.filtros[key]) {
                this.filtros[key] = null;
            }
        }
        this.filtros['estado'] = 'activa_vigente';
        this.actualizarListado();
    }

    public onCardClick(id: number) {
        this.router.navigateByUrl('/publicaciones/' + id);
    }

    public onFetchData(data: any) {
        Object.assign(this.filtrosComponent, data.filtrosDisponibles);
    }

    public setupDatosAgencia() {
        let user = this.userService.getUser();
        if (user.rol_id === 2){
            this.agenciaName = user.onboarding_user.business.name;
            this.agenciaLink = environment.urlMarketplace + '/' + this.agenciaName.replace(/ /g, "_");
        }
    }

    public buscar(event : any) : void {
        this.filtros['busqueda_marca_modelo']=event;
        this.actualizarListado();
    }
}

