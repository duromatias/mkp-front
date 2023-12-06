import { ActivatedRoute                   } from '@angular/router';
import { Component                        } from '@angular/core';
import { DeviceService                    } from 'src/app/shared/services/device.service';
import { FormBaseComponent                } from 'src/app/shared/components/form-base.component';
import { FormControl                      } from '@angular/forms';
import { MatDialog                        } from '@angular/material/dialog';
import { OnInit                           } from '@angular/core';
import { Router                           } from '@angular/router';
import { SeleccionarCuotaDialogComponent  } from '../seleccionar-cuota-dialog/seleccionar-cuota-dialog.component';
import { ServerAutocompleteFieldComponent } from 'src/app/shared/components/autocomplete/server-autocomplete-field.component';
import { ViewChild                        } from '@angular/core';

@Component({
    selector    :   'app-datos-financiacion',
    templateUrl :   './datos-financiacion.component.html',
    styleUrls   : [ './datos-financiacion.component.scss' ]
})
export class DatosFinanciacionComponent extends FormBaseComponent implements OnInit {

    public publicacionId! : number;
    public monto!         : string;
    public estadosCiviles : any[] = [];
    public usosVehiculo   : any[] = [];
    public usuario        : any;
    public isMobile       : boolean = false;

    @ViewChild('campoCodigoPostal', { static: true })
    private campoCodigoPostal!: ServerAutocompleteFieldComponent;
    
    constructor(
        private dialog        : MatDialog,
        private route         : ActivatedRoute,
        private router        : Router,
        public  deviceService : DeviceService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.setForm();
        this.route.params.subscribe(async (params: any) => {
            this.publicacionId  = params.publicacionId;
            this.monto          = params.monto;
            this.spinnerService.go(async () => {
                let datosAuxiliares = await this.apiService.getData('/financiacion/solicitud/datos-financiacion/datos-auxiliares');
                this.estadosCiviles = datosAuxiliares.estadosCiviles;
                this.usosVehiculo   = datosAuxiliares.usosVehiculo;
                this.usuario        = datosAuxiliares.usuario;
                this.completarForm();
            })
        });

        this.deviceService.observe((result: boolean) => {
            this.isMobile = result;
        });
    }
    
    public setForm() {
        this.addControls({
            dni             : new FormControl(''),
            titular         : new FormControl(''),
            telefono        : new FormControl(''),
            estado_civil_id : new FormControl(''),
            codigo_postal   : new FormControl(''),
            uso_vehiculo    : new FormControl(''),
            nombre          : new FormControl(''),
            apellido        : new FormControl(''),
            sexo            : new FormControl(''),
            localidad       : new FormControl(''),
            provincia       : new FormControl(''),
        });
    }

    public completarForm() {
        let usuario = this.usuario;
        let titular = [ usuario?.nombre||'', usuario?.apellido||'' ].join(' ');
        let codigo_postal = usuario?.codigo_postal;
        if(usuario?.localidad){
            codigo_postal = codigo_postal + ' - ' + usuario.localidad;
        }
        if(usuario?.provincia){
            codigo_postal = codigo_postal + ' - ' + usuario.provincia;
        }

        this.form.patchValue({
            dni             : usuario?.dni            ,
            titular         : titular                 ,
            telefono        : usuario?.telefono       ,
            estado_civil_id : usuario?.estado_civil_id,
            codigo_postal   : usuario?.codigo_postal  ,
            localidad       : usuario?.localidad      ,
            provincia       : usuario?.provincia      ,
            uso_vehiculo    : usuario?.uso_vehiculo   ,
            nombre          : usuario?.nombre         ,
            apellido        : usuario?.apellido       ,
            sexo            : usuario?.sexo           ,
        });

        // Aca lo que hago es agregarle un registro al listado, para que el autocomplete me muestre el valor
        // Si no hago eso, se vacia el valor en el campo.
        this.campoCodigoPostal.value = 1;
        this.campoCodigoPostal.data = [{
            id                  : 1,
            codpost             : usuario?.codigo_postal,
            codigo_postal_localidad_provincia : codigo_postal,
        }];
        

    }

    public personaElegida(data: any) {
        this.form.patchValue({
            dni      : data.personalId,
            sexo     : data.genre,
            titular  : data.fullName,
            nombre   : data.name,
            apellido : data.lastName,
        });

        console.log('form values', this.form.value);
    }

    public async submit() {
        if (this.form.invalid) {
            return;
        }
        
        this.form.get('telefono')?.setValue(this.form.get('telefono')?.value?.toString());
        await this.spinnerService.go(async () => {
            await this.enviarDatos();
            let response = await this.apiService.getData(`/financiacion/solicitud/${this.publicacionId}/puede-generar`);
            if(response){
                this.router.navigateByUrl(`/financiacion/${this.publicacionId}/seleccionar-cuotas/${this.monto}`);
            }
            else{
                let publicacion = await this.apiService.getData('/publicaciones/'+this.publicacionId);
                this.dialog.open( SeleccionarCuotaDialogComponent, {
                        disableClose : false,
                        autoFocus    : false,
                        data         : { 
                            type : 'Pendiente',
                            publicacion : publicacion,
                        },
                    }    
                );
            }
        });
    }

    protected get dataUrl(): string {
        return "/financiacion/solicitud/datos-financiacion/actualizar";
    }

    public scrollDownDropBox() {
        if (!this.isMobile) {
            if (window.scrollY < 210) {
                window.scrollTo(0, 320)
            }
        }
    }

    public asignarCodigoPostal(data: any) {
        this.form.get('codigo_postal')?.setValue(data.codpost);
        this.form.get('localidad'    )?.setValue(data.localidad);
        this.form.get('provincia'    )?.setValue(data.provincia);
    }
}
