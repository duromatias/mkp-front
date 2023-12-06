import { Component, OnInit } from '@angular/core';
import { FormBaseComponent } from 'src/app/shared/components/form-base.component';
import { FormControl, FormGroup                   } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-subastas-form',
  templateUrl: './subastas-form.component.html',
  styleUrls: ['./subastas-form.component.scss']
})
export class SubastasFormComponent extends FormBaseComponent implements OnInit {

    public idSubasta    : any;
    public editar       : boolean = false;
    public todayDate    : any;

    constructor(
        private snackBar    : SnackBarService,
        private router      : Router,
        private route       : ActivatedRoute,
    ) {
        super()
    }



    ngOnInit(): void {
        this.obtenerFechas();
        this.createForm();
        this.route.params.subscribe(async (params) => {
            if (params.id) {
                this.spinnerService.go(async () => {
                    await this.obtenerYCompletar(params.id);
                    this.editar = true;
                });
            }
        });

    }

    private createForm() {
        this.form = new FormGroup({
            fecha_inicio_inscripcion     : new FormControl({ value: '', disabled: false }),
            fecha_fin_inscripcion        : new FormControl({ value: '', disabled: false }),
            fecha_inicio_ofertas         : new FormControl({ value: '', disabled: false }),
            fecha_fin_ofertas            : new FormControl({ value: '', disabled: false }),
        });
    }

    public limpiarFechaFinCarga(){
        this.form.patchValue({"fecha_fin_inscripcion": ""});
        this.limpiarFechaInicioOfertas();
    }

    public limpiarFechaInicioOfertas(){
        this.form.patchValue({"fecha_inicio_ofertas": ""});
        this.limpiarFechaFinOfertas();
    }

    public limpiarFechaFinOfertas(){
        this.form.patchValue({"fecha_fin_ofertas": ""});
    }

    public async submit (){
        this.spinnerService.go(async () => {
            await this.enviarDatos(true);
            this.snackBar.show('Datos guardados exitosamente');
            this.router.navigate(['/subastas/listar']);
        });
    }


    protected getFormData(){
        let data = super.getFormData();
        data['fecha_inicio_inscripcion'] = formatDate(this.form.value.fecha_inicio_inscripcion,'yyyy-MM-dd', 'en-US');
        data['fecha_fin_inscripcion']    = formatDate(this.form.value.fecha_fin_inscripcion,'yyyy-MM-dd', 'en-US');
        data['fecha_inicio_ofertas']     = formatDate(this.form.value.fecha_inicio_ofertas,'yyyy-MM-dd', 'en-US');
        data['fecha_fin_ofertas']        = formatDate(this.form.value.fecha_fin_ofertas,'yyyy-MM-dd', 'en-US');
        return data;
    }

    protected get dataUrl():string{
        return '/subastas'
    }

    private obtenerFechas(){
        this.todayDate = moment().add(0,"day").format("YYYY-MM-DD");
    }

    protected capturarErrores(e:any){
        if(e.error.errors.hasOwnProperty('fechas')){
            this.errorMessage = e.error.errors.fechas[0];
            this.snackbarService.show(this.errorMessage)
        }
        if(e.error.errors.hasOwnProperty('fecha_inicio_inscripcion')){
            this.errorMessage = e.error.errors.fecha_inicio_inscripcion[0];
            this.snackbarService.show(this.errorMessage)
        }
    }

}


