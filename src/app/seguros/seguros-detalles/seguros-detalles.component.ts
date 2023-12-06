import { ActivatedRoute } from '@angular/router';
import { ApiService     } from 'src/app/shared/services/api.service';
import { Component      } from '@angular/core';
import { OnInit         } from '@angular/core';
import { Router         } from '@angular/router';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { UserService    } from 'src/app/auth/services/user.service';
import { Utils          } from 'src/app/shared/utils';

@Component({
  selector: 'app-seguros-detalles',
  templateUrl: './seguros-detalles.component.html',
  styleUrls: ['./seguros-detalles.component.scss']
})
export class SegurosDetallesComponent implements OnInit {

    private queryParams : any = null;
    public seguro! : any;
    public beneficios : Array<any> = [];

    constructor(
        private route          : ActivatedRoute,
        private spinnerService : SpinnerService,
        private apiService     : ApiService,
        private router         : Router,
        private userService    : UserService,
        public utils           : Utils,
    ) {
        this.queryParams = route.snapshot.queryParams;
    }

    public mensajeCotizarSeguro = encodeURIComponent("");
    public linkWhatsappCotizarSeguro : string = '';

    ngOnInit(): void {
        this.seguro = JSON.parse(this.queryParams.data);
        this.mensajeCotizarSeguro = encodeURIComponent(
            `¡Hola, me contacto desde la página de DeUsados! \nEstoy interesado en la cobertura de seguros ${this.utils.formatearTextoConGuionesYMinusculas(this.seguro.cobertura.tipo).replace('Teceros','Terceros')} [${this.seguro.cobertura.descripcion}] de la empresa ${this.seguro.cobertura.empresa} por $${this.utils.formatNumero(this.seguro.cobertura.valor_seguro.toString())} para mi ${this.seguro.vehiculo.marcaYModelo} ${this.seguro.vehiculo.anio} para la ciudad de ${this.seguro.ciudad.localidad} (CP: ${this.seguro.ciudad.cp})`
        );
        this.linkWhatsappCotizarSeguro = `https://api.whatsapp.com/send/?phone=${this.userService.getParametros().segurosTelefono}&text=${this.mensajeCotizarSeguro}`;
    }

    public volver(){
        let data = JSON.stringify(
            {           
                "vehiculo": this.seguro.vehiculo, 
                "ciudad": this.seguro.ciudad
            }
        );
        this.router.navigate([`/seguros/listar`],{ queryParams: { data }});
    }

    public limitarItemCobertura(item : string){
        if(item.length>128){
            return item.substring(0,128) + '...';
        }
        else return item;
    }
}
