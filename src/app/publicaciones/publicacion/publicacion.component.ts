import { ApiService                        } from 'src/app/shared/services/api.service';
import { CarouselComponent                 } from 'src/app/shared/components/carousel/carousel.component';
import { Component                         } from '@angular/core';
import { DeviceService                     } from 'src/app/shared/services/device.service';
import { EventEmitter                      } from '@angular/core';
import { Input                             } from '@angular/core';
import { MatDialog                         } from '@angular/material/dialog';
import { OnInit                            } from '@angular/core';
import { Output                            } from '@angular/core';
import { SnackBarService                   } from 'src/app/shared/services/snack-bar.service';
import { SubastasOnboardingDialogComponent } from '../banner-subastas/subastas-onboarding-dialog/subastas-onboarding-dialog';
import { UserService                       } from 'src/app/auth/services/user.service';
import { Utils                             } from '../../shared/utils';
import { ViewChild                         } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
    selector   :   'publicaciones-publicacion',
    templateUrl:   './publicacion.component.html',
    styleUrls  : [ './publicacion.component.scss' ]
})
export class PublicacionComponent implements OnInit {

    @Input()
    public publicacion!: any;

    @Input()
    public publicacionPropia : boolean = false;

    @Input()
    public mostrarDireccionCompleta: boolean = true;

    @Input()
    public mostrarTelefono: boolean = true;

    @Input()
    public ampliarCarousel: boolean = false;

    @Output()
    public carouselClick: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('carouselChico')
    public carouseChico! : CarouselComponent;

    @ViewChild('carouselAmpliadoElement')
    public carouselAmpliadoElement! : CarouselComponent;

    public environment : any = environment;


    public caracteristicas : any[] = [];
    public descripcion     : string = '';
    public precio          : string = '';
    public kilometros      : string = '';
    public multimedia      : any[] = [];

    public pTop            : number = 18;
    public pLeft           : number = 72;
    public mLeft           : number = 0;
    public currentPosition : number = 0;
    public arrowSpace      : number = 0;

    public heightFormConsultaMobile : number = 0;
    public showFormConsulta         : 'none' | 'block' = 'none';

    public showOportunidad  : boolean = false;

    public alturaCarouselAmpliado : number = 0;

    public simboloMoneda    :any;

    //Subasta
    public subastaEnOferta      : boolean = false;
    public subastaTerminada     : boolean = false;
    public fechaFinSubasta!     : string;
    public montoPuja            : number = 1000000;
    public valorDiscreto!       : number;
    public montoUltimaOferta!   : number;
    public precioBase!          : number;
    public pujaPermitida!       : number;
    public ultimaOfertaPropia   : boolean = false;
    public cantidadOfertas!     : number;
    public ofertas!             : Array<any>;
    public showOfertas          : 'none' | 'flex' = 'none';
    public heightListadoOfertas : number = 0;

    constructor(
        private apiService         : ApiService,
        public  deviceService      : DeviceService,
        private dialog             : MatDialog,
        private snackBar           : SnackBarService,
        private userService        : UserService,
        public  utils              : Utils,
    ) { }

    ngOnInit(): void {
        if(this.userService.esAgencia()){
            this.checkSubasta();
        }
        this.publicacion['anio'] = this.publicacion.año;
        this.descripcion = (this.publicacion.descripcion || '').replace(/\n/g, '<br />');
        this.precio      = this.utils.formatNumero(`${this.publicacion.precio}`);
        this.kilometros  = this.utils.formatNumero(`${this.publicacion.kilometros}`);
        //@ts-ignore
        this.multimedia  = this.publicacion.multimedia.filter(i => i.es_portada === 'SI').concat(this.publicacion.multimedia.filter(i => i.es_portada === 'NO'));
        this.caracteristicas = [
            { titulo: 'Marca'      , valor: this.publicacion.marca                        },
            { titulo: 'Modelo'     , valor: this.publicacion.modelo                       },
            { titulo: 'Año'        , valor: this.publicacion.anio                         },
            { titulo: 'Color'      , valor: this.publicacion.color                        },
            { titulo: 'Kilómetros' , valor: this.kilometros + ' km'                       },
            { titulo: 'Puertas'    , valor: this.publicacion.puertas                      },
            { titulo: 'Combustible', valor: this.publicacion.tipo_combustible.descripcion },
        ];

        this.deviceService.observe((result:boolean) => {
           let isMobile = result;
           if(isMobile) {
               this.pTop  = 0;
               this.pLeft = 0;
               this.mLeft = -16;
           }
        });
        this.checkRol();
        this.verificarSimboloPrecio();
    }

    private checkSubasta() : void {
        if(this.publicacion.subasta){
            console.log('publicacion propia dentro del metodo de subastas: ',this.publicacionPropia);
            let subasta = this.publicacion.subasta;
            this.subastaEnOferta = subasta.puede_ofertar;
            if(!subasta.puede_ofertar && !subasta.puede_inscribir){
                this.subastaTerminada = true;
            }
            let publicacion = this.publicacion;
            this.valorDiscreto     = publicacion.ofertas_valor_incremento;
            this.checkOfertas(publicacion);

            this.precioBase        = Number(this.utils.quitarPuntos(publicacion.precio_base));

            this.fechaFinSubasta   = this.utils.formatFecha(subasta.fecha_fin_ofertas);
            if(this.montoUltimaOferta){
                this.pujaPermitida = this.montoUltimaOferta + this.valorDiscreto;
                this.montoPuja     = this.pujaPermitida;
            }
            else{
                this.pujaPermitida = this.precioBase + this.valorDiscreto;
                this.montoPuja = this.pujaPermitida;
            }
        }
        else{
            this.subastaEnOferta = false;
        }
    }

    private async checkOfertas(publicacion : any) : Promise<void> {
        let ultimaOferta = publicacion.ofertas_ultima_oferta
        let ultimaOfertaPropia = publicacion.ofertas_ultima_oferta_propia
        if(ultimaOferta){
            this.montoUltimaOferta = ultimaOferta.precio_ofertado;
            if(ultimaOfertaPropia){
                if (ultimaOferta.id === ultimaOfertaPropia.id){
                    this.ultimaOfertaPropia = true;
                }
            }
            this.ofertas = await this.apiService.getData(`/publicaciones/${publicacion.id}/ofertas`);
            this.cantidadOfertas = this.ofertas.length;
            this.ofertas.reverse().splice(0,1);
        }
        else
        if(this.ultimaOfertaPropia){

        }
    }

    private checkRol() : void {
        let rol_id = this.userService.getUser()?.rol_id ;
        if(rol_id === 1 || rol_id === 2){
            this.showOportunidad = true;
        }
    }

    public clickCarousel() {
        if(this.carouseChico.getCurrentItem().tipo === 'video'){
            return;
        }
        this.currentPosition = this.carouseChico.currentPosition;
        this.ampliarCarousel = true;
        setTimeout(() => {
            this.alturaCarouselAmpliado = this.carouselAmpliadoElement.height;
            let windowWidth = window.innerWidth;
            let carouselAmpliadoWidth = this.carouselAmpliadoElement.width;
            console.log(carouselAmpliadoWidth , windowWidth,' c a w & w w');
            this.arrowSpace = (windowWidth - carouselAmpliadoWidth)/2;
            console.log(this.arrowSpace);
        }, 0);

    }

    public closeCarousel() {
        this.ampliarCarousel = false;
    }

    clickRightArrow(){
        this.carouselAmpliadoElement.clickRightArrow();
    }

    clickLeftArrow(){
        this.carouselAmpliadoElement.clickLeftArrow();
    }

    public openFormConsulta() : void {
        this.showFormConsulta         = 'block';
        setTimeout(() => this.heightFormConsultaMobile = 100,0)
    }

    public aumentarPuja() : void {
        if(this.ultimaOfertaPropia){
            return;
        }
        this.montoPuja = this.montoPuja + this.valorDiscreto;
    }

    public disminuirPuja() : void {
        if(this.ultimaOfertaPropia){
            return;
        }
        if(this.pujaPermitida <= this.montoPuja - this.valorDiscreto){
            this.montoPuja = this.montoPuja - this.valorDiscreto;
        }
        return;
    }

    public clickOfertar() : void {
        if(!this.userService.esAgenciaReady()){
            this.dialog.open(SubastasOnboardingDialogComponent,  {
                disableClose : false,
                data         : {text:'Para poder ofertar en una Subasta deberá ingresar al sistema de Onboarding y finalizar su registro'},
                autoFocus    : true,
            });
            return;
        }

        if(this.montoPuja < this.pujaPermitida){
            this.snackBar.show('La oferta debe ser mayor a $'+this.utils.formatNumero(this.pujaPermitida.toString()));
            return;
        }
        this.ultimaOfertaPropia = true;
        let anio = this.publicacion.anio;
        this.apiService.post(`/publicaciones/${this.publicacion.id}/ofertas`, {precio_ofertado: this.montoPuja})
            .then(async (response: any) => {
                this.snackBar.show('Oferta registrada');
                this.publicacion = await this.apiService.getData(`/publicaciones/${this.publicacion.id}`);
                this.checkOfertas(this.publicacion);
            })
            .catch(async () => {
                this.snackBar.show('No se registró la oferta');
                this.publicacion = await this.apiService.getData(`/publicaciones/${this.publicacion.id}`);
                this.ultimaOfertaPropia = false;
                this.checkSubasta();
            })
            .finally(() => this.publicacion.anio = anio
        );

    }

    public verificarSimboloPrecio() {
        if(this.publicacion.moneda === 'Pesos'){
            this.simboloMoneda = '$'
        }else{
            this.simboloMoneda = 'U$S'
        }
    }

    public verOfertas() : void {
        this.showOfertas = 'flex';
        setTimeout(() => this.heightListadoOfertas = 100,0)
    }

}
