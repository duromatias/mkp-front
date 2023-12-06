import { ActivatedRoute          } from '@angular/router';
import { ApiService              } from 'src/app/shared/services/api.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component               } from '@angular/core';
import { LocatorService          } from 'src/app/shared/services/locator.service';
import { OnInit                  } from '@angular/core';
import { Router                  } from '@angular/router';
import { SpinnerService          } from 'src/app/shared/services/spinner.service';
import { Utils                   } from 'src/app/shared/utils';

@Component({
    selector    : 'app-seguros-listar',
    templateUrl : './seguros-listar.component.html',
    styleUrls   : ['./seguros-listar.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class SegurosListarComponent implements OnInit {

    private queryParams      : any = null;
    private listadoSeguros   : Array<any> = [];
    private seguro           : any;
    public  seguros          : Array<any> = [];
    public  segurosFiltrados : Array<any> = [];
    public  ocultarMensajeError : boolean = true;

    protected spinnerService  = LocatorService.injector.get(SpinnerService);

    constructor(
        private apiService : ApiService,
        private router     : Router,
        private route      : ActivatedRoute,
        public  utils      : Utils,
    ) { 
        this.queryParams = route.snapshot.queryParams;
    }

    //Se dejan escrito de la misma manera de que vienen en el backend hasta solucionar esto.
    public tiposCobertura : Array<any> = ["teceros_completo", "terceros_premium", "todo_riesgo"];

    ngOnInit(): void {
        this.seguro = JSON.parse(this.queryParams.data);
        this.listarSeguros();
    }

    private async listarSeguros(){
        try {
            this.spinnerService.show();
            this.listadoSeguros = await this.apiService.getData("/seguros/cotizaciones/listar",{
                codia:     this.seguro.vehiculo.codia,
                anio:      this.seguro.vehiculo.anio,
                cp:        this.seguro.ciudad.cp,
                localidad: this.seguro.ciudad.localidad,
                provincia: this.seguro.ciudad.provincia,
            });
        } 
        finally{
            this.spinnerService.hide();
            this.ocultarMensajeError = false;
        }
        

       this.seguros =  this.listadoSeguros.map(item => {
            return {
            nombre: item.nombre_compania,
            urlImagen: item.url_imagen,
            valorMes: item.valor_seguro,
            tipo_cobertura: item.tipo_cobertura,
            descripcion: item.descripcion_cobertura,
            items_cobertura: item.items_cobertura,
            suma_asegurada: item.suma_asegurada
            };
        });
        this.filtrarCobertura("teceros_completo");
    }

    public filtrarCobertura(value: any){
        this.segurosFiltrados = this.seguros
        this.segurosFiltrados = this.seguros.filter((seguro) => {
            return seguro.tipo_cobertura === value;
        });
    }

    public seleccionar(seguro:any){
        let data = JSON.stringify(
            {
                vehiculo  : this.seguro.vehiculo,
                ciudad    : this.seguro.ciudad,
                cobertura : {
                    tipo            : seguro.tipo_cobertura,
                    descripcion     : seguro.descripcion,
                    empresa         : seguro.nombre,
                    valor_seguro    : seguro.valorMes,
                    suma_asegurada  : seguro.suma_asegurada,
                    items_cobertura : seguro.items_cobertura,
                }
            }
        );

        this.router.navigate([`/seguros/detalles`],{ queryParams: { data }});
    }

}
