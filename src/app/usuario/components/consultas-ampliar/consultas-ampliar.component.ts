import { Component, Input, OnInit,  } from '@angular/core';
import { FormBaseComponent } from 'src/app/shared/components/form-base.component';
import { FormControl       } from '@angular/forms';
import { FormGroup         } from '@angular/forms';
import { emailValidator } from 'src/app/shared/form-validators/validators';
import { ListadoDataSource } from 'src/app/shared/components/listado.datasource';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

@Component({
  selector: 'app-consultas-ampliar',
  templateUrl: './consultas-ampliar.component.html',
  styleUrls: ['./consultas-ampliar.component.scss']
})
export class ConsultasAmpliarComponent extends FormBaseComponent implements OnInit {

  public consulta           : any;
  public publicacion        : any;
  public anio               : string = '';
  public email              : string = '';
  public fecha              : string = '';
  public nombre             : string = '';
  public marcaVehiculo      : string = '';
  public modeloVehiculo     : string = '';
  public telefono           : string  = '';
  public texto              : string  = '';
  public respuesta          : string  = '';
  public estado             : string  = '';
  public estadoResuelto     : boolean = false;
  public idConsulta         : any;

  constructor(
    public  dataSource 	 : ListadoDataSource<any>,
    private route        : ActivatedRoute,
    private router       : Router,
    private snackBar     : SnackBarService,
  ) {
    super()
   }

   public get dataUrl() {
    return `/publicaciones/*/consultas`;
    }


  ngOnInit(): void {
    this.setForm();
    this.route.params.subscribe((params) => {
      this.spinnerService.go(async() => {
        this.consulta = await this.apiService.getData('/publicaciones/*/consultas/' + params.id,{
          opciones:{
            with_relation:['publicacion']
          }
        });
        console.log("consulta",this.consulta)
        this.fecha = formatDate(this.consulta.created_at,'dd/MM/yyyy', 'en-US');
        this.marcaVehiculo = this.consulta.publicacion.marca;
        this.modeloVehiculo = this.consulta.publicacion.modelo;
        this.anio = this.consulta.publicacion.año;
        this.idConsulta = this.consulta.id;
        if(this.consulta.estado === 'Resuelta'){
            this.estadoResuelto = true;
        }
        this.form.setValue({
          nombre:this.consulta.nombre,
          email :this.consulta.email,
          telefono:this.consulta.telefono,
          texto:this.consulta.texto,
          respuesta:this.consulta.respuesta,
          estado: this.consulta.estado,
        });
      });
    });
    this.verificarCambios();
  }

  verificarCambios(){
    this.form.valueChanges.subscribe(
        result => {
                if(this.form.value.estado === 'Resuelta') {
                    this.estadoResuelto = true;
            }  else{
                  this.estadoResuelto = false;
            }
        }
    );
  }


  public setForm() : void {
    this.form = new FormGroup({
        nombre         : new FormControl(''),
        email          : new FormControl('', [emailValidator()]),
        telefono       : new FormControl('', ),
        texto          : new FormControl(''),
        respuesta      : new FormControl(''),
        estado         : new FormControl(''),
    });
  }

  public async submit (idConsulta? : number){
    this.spinnerService.go(async () => {
      await this.apiService.post(`/publicaciones/*/consultas/${idConsulta}:responder`, {
        texto:this.form.get('respuesta')?.value,
        estado: this.form.get('estado')?.value,
      });
       await this.snackBar.show('Datos guardados exitosamente');
       this.router.navigate(['/usuario/consultas'])
        .then(() => {
            window.location.reload();
        });
    });
  }





}
