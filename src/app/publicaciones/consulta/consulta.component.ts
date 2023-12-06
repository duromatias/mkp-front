import { ActivatedRoute          } from '@angular/router';
import { ApiService              } from '../../shared/services/api.service';
import { Component               } from '@angular/core';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { OnInit                  } from '@angular/core';
import { SpinnerService          } from '../../shared/services/spinner.service';
import { UserService             } from '../../auth/services/user.service';
import { environment } from '../../../environments/environment';


enum Estado {
    inicial,
    cargando,
    cargado,
    error,
    noEncontrado,
    accesoNoPermitido,
};

@Component({
    selector: 'app-consulta',
    templateUrl: './consulta.component.html',
    styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {

    public publicacion           : any;
    public estado                : Estado = Estado.inicial;
    public user                  : any;
    public marcaVehiculo         : string = '';
    public modeloVehiculo        : string = '';
    public estados = Estado;
    public esAdministrador:boolean = false;
    public clicks:any;
    public url: string = "";
    public publicacionPropia!    : boolean;
    public environment           : any = environment;
    public agencia!              : any;
    public usuarioInstagram      : string = '';
    public usuarioFacebook       : string = '';

    constructor(
        private apiService     : ApiService,
        private gtmService     : GoogleTagManagerService,
        private route          : ActivatedRoute,
        private spinnerService : SpinnerService,
        private userService    : UserService,
    ) { }

    public ngOnInit(): void {
        this.user = this.userService.getUser();

        this.url = window.location.href;

        if (this.userService.getUser()?.rol_id === 1) {
          this.esAdministrador = true;
        }

        this.route.params.subscribe((params) => {
            this.spinnerService.go(async() => {
                try {
                    this.publicacion = await this.apiService.getData('/publicaciones/' + params.id + '?opciones[business.redes_sociales]=true');
                    this.checkPublicacionPropia();
                    if(this.publicacion.usuario.onboarding_user?.business != null){
                        this.agencia = this.publicacion.usuario.onboarding_user.business;
                        this.usuarioFacebook = this.agencia.redes_sociales.facebook.toString().substring(25,this.agencia.redes_sociales.facebook.toString().length -1);
                        this.usuarioInstagram = this.agencia.redes_sociales.instagram.toString().substring(26,this.agencia.redes_sociales.instagram.toString().length -1);                    } 
                    this.marcaVehiculo = this.publicacion.marca;
                    this.modeloVehiculo = this.publicacion.modelo;
                    this.estado = Estado.cargado;
                    this.clicks = this.publicacion.clicks;
                } catch (e:any) {
                    if(e.error.name === 'AccesoNoPermitido'){
                      this.estado = Estado.accesoNoPermitido;
                    }else{
                      this.estado = Estado.noEncontrado;
                    }
                    throw e;
                }
            });/*
            this.route.queryParams.subscribe((queryParams)=> {
                if(queryParams.utm_source){
                    const gtmTag = {
                        source   : queryParams.utm_source,
                        medium   : queryParams.utm_medium,
                        campaign : queryParams.utm_campaign,
                    };
                    console.log(gtmTag);
                    this.gtmService.pushTag(gtmTag).then(()=>alert('se peticiono'));
                }
            })*/
        });

    }

    private checkPublicacionPropia() {
        if (this.publicacion.usuario_id === this.user?.id) {
            this.publicacionPropia = true;
        }
        else {
            this.publicacionPropia = false;
        }
    }

}
