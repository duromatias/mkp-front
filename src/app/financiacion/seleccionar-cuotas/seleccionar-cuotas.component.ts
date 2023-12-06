import { ActivatedRoute                  } from '@angular/router';
import { ApiService                      } from 'src/app/shared/services/api.service';
import { Component                       } from '@angular/core';
import { LocatorService                  } from 'src/app/shared/services/locator.service';
import { MatDialog                       } from '@angular/material/dialog';
import { OnInit                          } from '@angular/core';
import { Router                          } from '@angular/router';
import { SeleccionarCuotaDialogComponent } from '../seleccionar-cuota-dialog/seleccionar-cuota-dialog.component';
import { SpinnerService                  } from 'src/app/shared/services/spinner.service';
import { Utils                           } from 'src/app/shared/utils';

@Component({
  selector    : 'app-seleccionar-cuotas',
  templateUrl : './seleccionar-cuotas.component.html',
  styleUrls   : ['./seleccionar-cuotas.component.scss']
})
export class SeleccionarCuotasComponent implements OnInit {

    public  cuotas         : Array<any> = [];
    public  seguro         : any = {};
    public  monto!         : number;
    public  datosCargados  : boolean = false;
    private dialogOpen     : boolean = false;
    private publicacionId! : number;
    
    protected spinnerService  = LocatorService.injector.get(SpinnerService );

    constructor(
        private apiService     : ApiService,
        private dialog         : MatDialog,
        private route          : ActivatedRoute,
        private router         : Router,
        public  utils          : Utils,
    ) { }

    public async ngOnInit(): Promise<void> {
        this.route.params.subscribe((params: any) => {
            this.publicacionId = params.publicacionId;
            this.monto         = Number(this.utils.quitarPuntos(params.monto));
            this.obtenerDatos();
        });
    }

    public async obtenerDatos() {
        this.spinnerService.show();
        try{
            let data = await this.fetch();
            this.cuotas = data.cuotas.map((cuota : any) => {
                cuota.gray     = false;
                cuota.selected = false;
                return cuota;
            });
            this.seguro = data.seguros[0];
            this.datosCargados = true;
        }
        catch (e: any) {
            this.procesarFinanciacion();
            await this.apiService.post(`/financiacion/solicitud/${this.publicacionId}/notificar-error-al-solicitar-cuotas-por-usuario`, {});
            throw e
        } 
        finally{
            this.spinnerService.hide();
        }
        
    }

    public procesarFinanciacion(){
        this.dialog.open(
            SeleccionarCuotaDialogComponent,
            {
                disableClose : true,
                autoFocus    : false,
                data         : {
                   type  : 'contactar',
                }
            }
        )
    }

    public async fetch() {
        return  await this.apiService.getData(`/financiacion/solicitud/${this.publicacionId}/cuotas-por-usuario`, {
            capital: this.monto,
        }); 
    }

    public mouseOverCuota(cuota: any) : void {
        this.cuotas.forEach(element => {
            element.selected = false;
            element.gray     = true;
        });
        cuota.selected = true;
    }

    public mouseLeave() : void {
        if(this.dialogOpen) {
            return;
        }
        this.cuotas.forEach(element => {
            element.selected = false;
            element.gray     = false;
        });
    }

    public selectCuota(cuota : any) : void {
        this.dialogOpen = true;
        let component = this.dialog.open(
            SeleccionarCuotaDialogComponent,
            {
                disableClose : true,
                autoFocus    : false,
                data         : {
                   type  : 'confirmar',
                   cuota : cuota,
                }
            }
        ).componentInstance;
        this.dialog.afterAllClosed.subscribe(()=> {
            this.dialogOpen = false
            this.mouseLeave();
        });

        component.confirm.subscribe(async () => {
            this.spinnerService.show();
            try{
                this.apiService.mostrarMensajes = false;
                let resultado = await this.apiService.post(`/financiacion/solicitud/${this.publicacionId}/generar`, {
                    capital         : this.monto,
                    cantidad_cuotas : cuota.cantidadCuotas,
                    cotizacionSeguroId : this.seguro.IDCotizacion,
                });
                let operacion = resultado.data;
                this.router.navigateByUrl(`/financiacion/${this.publicacionId}/comprobante/${operacion}/${cuota.valorPrimerCuota}`);
            }
            catch (e: any) {
                this.procesarFinanciacion();
                await this.apiService.post(`/financiacion/solicitud/${this.publicacionId}/notificar-error-al-solicitar-cuotas-por-usuario`, {});
                throw e
            } 
            finally{
                this.spinnerService.hide();
                this.apiService.mostrarMensajes = true;
            }
            
        });
    }

}
