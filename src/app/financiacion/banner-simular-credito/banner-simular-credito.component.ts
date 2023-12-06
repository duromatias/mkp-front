import { ActivatedRoute                  } from '@angular/router';
import { ApiService                      } from 'src/app/shared/services/api.service';
import { Component                       } from '@angular/core';
import { Input                           } from '@angular/core';
import { LocatorService                  } from 'src/app/shared/services/locator.service';
import { MatDialog                       } from '@angular/material/dialog';
import { MaxFinanciacionDialogComponent  } from 'src/app/auth/components/max-financiacion-dialog/max-financiacion-dialog.component';
import { MessageDialogComponent          } from 'src/app/shared/components/message-dialog/message-dialog.component';
import { OnInit                          } from '@angular/core';
import { Router                          } from '@angular/router';
import { SeleccionarCuotaDialogComponent } from '../seleccionar-cuota-dialog/seleccionar-cuota-dialog.component';
import { SpinnerService                  } from 'src/app/shared/services/spinner.service';
import { UserService                     } from 'src/app/auth/services/user.service';
import { Utils                           } from 'src/app/shared/utils';

@Component({
    selector    :   'banner-simular-credito',
    templateUrl :   './banner-simular-credito.component.html',
    styleUrls   : [ './banner-simular-credito.component.scss' ]
})
export class BannerSimularCreditoComponent implements OnInit {

    public publicacionId!        : number;
    public monto                 : any = '';
    public montoMaximo           : any;
    public cuotas                : any;
    public mostrarObtenerCredito : boolean = false;
    public datosIncompletos      : boolean = false;

    protected spinnerService  = LocatorService.injector.get(SpinnerService );

    constructor(
        private apiService  : ApiService,
        private dialog      : MatDialog,
        private utils       : Utils,
        private route       : ActivatedRoute,
        private router      : Router,
        private userService : UserService
    ) {
    }

    @Input()
    public publicacion : any;

    public url! : string;
    public showSpinner : boolean = false;

    async ngOnInit(): Promise<void> {
        this.route.params.subscribe(async (params) => {
            this.publicacionId = params.id;
        });
        let monto = this.route.snapshot.queryParams['monto-a-financiar'];
        let clickBoton = false;
        if(monto){
            this.monto = monto;
            clickBoton = true;
        }
        this.verificarRol();
        await this.obtenerCuotas();
        if(clickBoton){
            this.clickObtenerCredito();
        }
    }

    public async obtenerCuotas() {
        try{
            this.showSpinner = true;

            this.apiService.mostrarMensajes = false;
            let data         = this.monto ? {capital: this.utils.quitarPuntos(this.monto)} : {};
            if(this.montoValido(data.capital) === false){
                return
            }
            let respuesta    = await this.apiService.getData(`/financiacion/solicitud/${this.publicacionId}/cuotas-y-montos`, data);
            this.cuotas      = respuesta.cuotas;
            this.montoMaximo = this.utils.formatNumero(respuesta.montoMaximo.toString());
            if(!this.montoMaximo || !this.cuotas || this.cuotas.length == 0){
                this.datosIncompletos = true;
            }
            if (!this.monto) {
                this.monto = this.utils.formatNumero(String(respuesta.montoMaximo));
            }
            for(let indice=0; indice < this.cuotas.length; indice = indice + 1){
                this.cuotas[indice].montoMinimo = this.utils.formatNumero(this.cuotas[indice].montoMinimo.toString());
            }
        } catch (e: any) {
            if (e.status == 422){
                this.superaMaximaFinanciacion();
            }
            else{
                this.datosIncompletos = true;
            }
            throw e
        } finally{
            this.apiService.mostrarMensajes = true;
            this.showSpinner = false;
        }
    }

    public async obtenerMaximaFinanciacion(){
        try{
            let respuesta = await this.apiService.getData(`/financiacion/solicitud/${this.publicacionId}/monto-maximo-financiable`,{});
            this.montoMaximo = this.utils.formatNumero(respuesta.maxima_financiacion.toString());
        }
        catch(e: any){
            if (e.status == 422){
                this.superaMaximaFinanciacion();
            }
            throw e
        }

    }
    public superaMaximaFinanciacion(){
        this.dialog.open(MaxFinanciacionDialogComponent,{
            disableClose: false,
            autoFocus: true,
        }).componentInstance.confirm;
    }

    public verificarRol(){
        if(this.userService.esAdministrador() || this.userService.esAgencia()){
            this.mostrarObtenerCredito = false;
        }
        else{
            this.mostrarObtenerCredito = true;
        }
    }

    public async clickObtenerCredito() : Promise<void>  {
        if(!this.userService.getUser()){
            this.router.navigate([`/auth/login`],{ queryParams: { redirect: `/publicaciones/${this.publicacionId}?monto-a-financiar=${this.monto}`}});
            return;
        }

        if(this.userService.getUser().rol_id !==3){
            this.dialog.open(MessageDialogComponent,{
                disableClose : false,
                autoFocus    : true,
                data         : { textDialog : 'Financiación disponible solo para Particulares' },
            });
            return;
        }
        if(this.montoValido(this.monto) === false){
            return
        }

        if(this.datosIncompletos){
            this.dialog.open(
                SeleccionarCuotaDialogComponent,
                {
                    disableClose : true,
                    autoFocus    : false,
                    data         : {
                        type        : 'contactar',
                        publicacion : this.publicacion,
                        message     : 'Para avanzar con las alternativas crediticias, comunicate con la agencia.',
                    }
                }
            ).componentInstance.confirm.subscribe(()=> {
                this.apiService.post(`/financiacion/solicitud/${this.publicacionId}/notificar-producto-faltante`,{});
            });
            return;
        }


        this.spinnerService.show();
        try {
            if(!this.userService.getUser().dni){
                this.router.navigateByUrl('/financiacion/' + this.publicacionId + '/datos-financiacion/' + this.monto);
                return;
            }
            let response = await this.apiService.getData(`/financiacion/solicitud/${this.publicacionId}/puede-generar`);
            if(response){
                this.router.navigateByUrl('/financiacion/' + this.publicacionId + '/datos-financiacion/' + this.monto);
            }
            else{
                let publicacion = await this.apiService.getData('/publicaciones/'+this.publicacionId);
                this.dialog.open(
                    SeleccionarCuotaDialogComponent,
                    {
                        disableClose : false,
                        autoFocus    : false,
                        data         : {
                            type : 'Pendiente',
                            publicacion : publicacion,
                        },
                    }
                )
            }
        }
        catch (error) {
            console.log(error)
        }
        finally{
            this.spinnerService.hide();
        }
    }

    //Metodo que verifica que el monto sea mayor que 0
    public montoValido( monto : any):boolean{
        if(monto === '0'){
            this.dialog.open(MessageDialogComponent,{
                disableClose : false,
                autoFocus    : true,
                data         : {textDialog : 'El monto es inválido para la financiación.' },
            });
            return false;
        }
        else return true;
    }
}
