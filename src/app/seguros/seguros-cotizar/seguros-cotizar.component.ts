import { Component         } from '@angular/core';
import { FormBaseComponent } from 'src/app/shared/components/form-base.component';
import { FormControl       } from '@angular/forms';
import { OnInit            } from '@angular/core';
import { Router            } from '@angular/router';

@Component({
  selector: 'app-seguros-cotizar',
  templateUrl: './seguros-cotizar.component.html',
  styleUrls: ['./seguros-cotizar.component.scss']
})
export class SegurosCotizarComponent extends FormBaseComponent implements OnInit {

    public anios : any = [];
    public direccion = {
        codigoPostal : '',
        localidad : '',
        provincia : ''
    };
    public vehiculo = {
        codia : '',
        marcaYModelo : '',
    };

    /*@ViewChild('campoMarcaModelo')
    private campoMarcaModelo! : ServerAutocompleteFieldComponent;*/

    constructor(
        private router     : Router,
    ){
        super();
    }

    ngOnInit(): void {
        this.createForm();
        this.obtenerAnios();
    }

    private createForm() : void {
        this.addControls({
            anio             : new FormControl({ value: '', disabled: false }),
            marca_modelo_id  : new FormControl({ value: '', disabled: false }),
            codigo_postal    : new FormControl({ value: '', disabled: false }),
        });
    }

    public async obtenerAnios(){
        this.anios = await this.apiService.getData('/seguros/cotizaciones/listar-años');
    }

    protected get dataUrl(): string {
        return "/seguros/cotizar";
    }

    public submit(){
        let data = JSON.stringify(
            {           
                "vehiculo":{
                    "codia": this.vehiculo.codia,
                    "anio": this.form.get('anio')?.value,
                    "marcaYModelo": this.vehiculo.marcaYModelo
                }, 
                "ciudad":{
                    "cp": this.direccion.codigoPostal, 
                    "localidad": this.direccion.localidad,
                    "provincia": this.direccion.provincia
                }
            }
        );

        if(this.form.valid && this.form.get('marca_modelo_id')?.value != '' && this.form.get('codigo_postal')?.value != ''){
            this.router.navigate([`/seguros/listar`],{ queryParams: { data }});
        }
    }

    
    public asignarVehiculo(data: any) {
        this.vehiculo.codia = data.codia;
        this.vehiculo.marcaYModelo = data.label;
    }

    public asignarCodigoPostal(data: any) {
        this.direccion.codigoPostal = data.codpost
        this.direccion.localidad = data.localidad;
        this.direccion.provincia = data.provincia;
    }

    public volver(){
        this.router.navigateByUrl('/');
    }

    public anioChange() : void {
        this.form.get('marca_modelo_id')?.setValue('');
        //this.campoMarcaModelo;
    }

}
