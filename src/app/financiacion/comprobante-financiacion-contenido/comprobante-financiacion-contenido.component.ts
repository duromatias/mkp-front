import { ApiService                            } from 'src/app/shared/services/api.service';
import { Component, ElementRef, ViewChild      } from '@angular/core';
import { Input                                 } from '@angular/core';
import { LocatorService                        } from 'src/app/shared/services/locator.service';
import { OnInit                                } from '@angular/core';
import { SpinnerService                        } from 'src/app/shared/services/spinner.service';
import { Utils                                 } from 'src/app/shared/utils';
import html2canvas from 'html2canvas';
@Component({
    selector    : 'app-comprobante-financiacion-contenido',
    templateUrl : './comprobante-financiacion-contenido.component.html',
    styleUrls   : ['./comprobante-financiacion-contenido.component.scss']
})
export class ComprobanteFinanciacionContenidoComponent implements OnInit {

    protected spinnerService  = LocatorService.injector.get(SpinnerService);

    @Input()
    public publicacionId!: number;

    @Input()
    public operacionId!: number;

    @Input()
    public valorPrimerCuota!: number;

    //Captura de pantalla

    @ViewChild('screen') 
    public screen!: ElementRef;
    
    @ViewChild('canvas') 
    public canvas!: ElementRef;

    @ViewChild('downloadLink') 
    public downloadLink!: ElementRef;

    public telefonoAgencia!    : string;
    public telefonoDecreditos! : string;

    public datos: any = {};

    public agencia!  : string;
    public direccion : string = '';
    public address   : any = {};

    public constructor(
        private apiService : ApiService,
        public  utils      : Utils,
    ) { }

    public async ngOnInit(): Promise<void> {
        this.spinnerService.show();
        try{
            await this.getDatos();
            this.setInfo();
        }
        finally{
            this.spinnerService.hide();
        }
    }

    private async getDatos() : Promise<void> {
        this.datos = await this.apiService.getData(`/financiacion/solicitud/${this.publicacionId}/operaciones/${this.operacionId}`);
        this.address = this.datos.publicacion.usuario.onboarding_user.business.address;
        this.telefonoAgencia    = this.datos.informacionContacto.agencia;
        this.telefonoDecreditos = this.datos.informacionContacto.plataforma;
    }

    private setInfo() : void {
        console.log('this.datos', this.datos);

        this.agencia = this.datos.publicacion.usuario.onboarding_user.business.name;
        console.log('agencia: ',this.agencia)

        this.setAddres();
        
    }

    private setAddres() : void {
        let direccion = this.datos.publicacion.usuario.onboarding_user.business.address;

        console.log(direccion.street,' ',direccion.number,' ',direccion.locality,' ',direccion.postal_code, ' ',direccion.province.name);

        if(direccion.street){
            this.direccion = this.direccion + direccion.street;
        }

        if(direccion.number){
            this.direccion = this.direccion + ' ' + direccion.number;
        }

        if(direccion.locality){
            this.direccion = this.direccion + ', ' + direccion.locality;
        }

        if(direccion.postal_code){
            this.direccion = this.direccion + ', ' + direccion.postal_code;
        }

        if(direccion.province.name){
            this.direccion = this.direccion + ', ' + direccion.province.name;
        }

        console.log('direccion completa: ', this.direccion);
    }

    public imprimir() {
        window.print();
    }

    public guardar(){
        html2canvas(this.screen.nativeElement).then(canvas => {
            this.canvas.nativeElement.src = canvas.toDataURL();
            this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
            this.downloadLink.nativeElement.download = 'comprobante.png';
            this.downloadLink.nativeElement.click();
        });
    }

}
