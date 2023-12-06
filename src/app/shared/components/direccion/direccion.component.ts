import { ApiService                       } from '../../services/api.service';
import { Component                        } from '@angular/core';
import { DetalleUbicacion                 } from '../direccion-autocomplete/direccion-autocomplete.component';
import { DireccionAutocompleteComponent   } from '../direccion-autocomplete/direccion-autocomplete.component';
import { EventEmitter                     } from '@angular/core';
import { FormControl                      } from '@angular/forms';
import { FormGroup                        } from '@angular/forms';
import { Input                            } from '@angular/core';
import { OnInit                           } from '@angular/core';
import { Output                           } from '@angular/core';
import { ServerAutocompleteFieldComponent } from '../autocomplete/server-autocomplete-field.component';
import { ViewChild                        } from '@angular/core';

@Component({
    selector    :   'app-direccion',
    templateUrl :   './direccion.component.html',
    styleUrls   : [ './direccion.component.scss' ]
})
export class DireccionComponent implements OnInit {

    @Input()
    public addControls : boolean = false;

    @Input()
    public  form!                    : FormGroup;
    public  ubicacionElegida?        : DetalleUbicacion;
    public  mostrarCamposUbicacion   : boolean        = false;
    public  placeId                  : string         = '';
    public  urlImagenMapa            : string         = '';
    public  provincias               : any[]          = [];
    public  parametrosCodigoPostal   : any            = { filtros : {} };
    public  deshabilitarCodigoPostal : boolean        = true;
    public  direccionCompleta        : string         = '';
    public  dataDireccion            : any[]          = [];
    private camposLocalizacion       : string[] = [
        'codigo_postal',
        'calle',
        'numero',
        'localidad',
        'provincia',
        'latitud',
        'longitud',
    ];

    @Output()
    public alElegirDireccionIncompleta : EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('direccionAutocomplete', {static:true,  read: DireccionAutocompleteComponent})
    private direccionAutocomplete!: DireccionAutocompleteComponent;

    @ViewChild('codigoPostal')
    private codigoPostal!: ServerAutocompleteFieldComponent;

    @ViewChild('campoProvincia')
    private campoProvincia!: ServerAutocompleteFieldComponent;

    public constructor(
        private apiService: ApiService,
    ) {
    }
    
    public async ngOnInit() {

        
        if (this.addControls) {
            this.form.addControl('provincia_id'      , new FormControl({ value: '', disabled: false }));
            this.form.addControl('placeId'           , new FormControl({ value: '', disabled: false }));
            this.form.addControl('codigo_postal'     , new FormControl({ value: '', disabled: false }));
            this.form.addControl('calle'             , new FormControl({ value: '', disabled: false }));
            this.form.addControl('numero'            , new FormControl({ value: '', disabled: false }));
            this.form.addControl('localidad'         , new FormControl({ value: '', disabled: false }));
            this.form.addControl('provincia'         , new FormControl({ value: '', disabled: false }));
            this.form.addControl('latitud'           , new FormControl({ value: '', disabled: false }));
            this.form.addControl('longitud'          , new FormControl({ value: '', disabled: false }));
            this.form.addControl('direccionCompleta' , new FormControl({ value: '', disabled: false }));
        }


        let campoDireccionCompleta = this.form.get('direccionCompleta');
        this.setDireccion(campoDireccionCompleta?.value);
        campoDireccionCompleta?.valueChanges.subscribe((value: any) => {
            this.setDireccion(value);
        });
        this.provincias = await this.apiService.getData('/direcciones/provincias');

    }

    private setDireccion(valor: string) {
        this.direccionCompleta = valor;
        this.dataDireccion = [{place_id:valor, description:valor}];
    }

    private borrarDireccion() {
        this.direccionCompleta = '';
        this.dataDireccion = []
        this.form.patchValue({
            provincia_id      : '',
            placeId           : '',
            codigo_postal     : '',
            calle             : '',
            numero            : '',
            localidad         : '',
            provincia         : '',
            latitud           : '',
            longitud          : '',
            direccionCompleta : '',
        });
    }

    public setErrors(errors: {[key: string]: any}) {
        for (let fieldName in errors) {
            let errorMessage = errors[fieldName][0];
            //@ts-ignore
            this.form.get(fieldName).setErrors({
                'error': errorMessage,
            });
        }
    }

    public error(fieldName: string, errorCode: string = 'error'): string {

        let field = this.form!.get(fieldName);

        if (!field) {
            console.log(`No existe el campo '${fieldName}'`)
            return '';
        }

        let errorMessage = field!.getError(errorCode);
        if (typeof(errorMessage) === 'string') {
            return errorMessage;
        }

        if (field?.invalid) {
            for (let error of Object.values(field.errors!)) {
                if (typeof error === 'string') {
                    return error;
                } else {
                    return 'Obligatorio';
                }
            }
        }

        return '';
    }

    public alElegirUbicacion(datos: DetalleUbicacion) {
        // Guarda los datos de la ubicación elegida en el componente.
        console.log('alElegirUbicacion datos', datos);
        this.ubicacionElegida = datos;
        
        this.setErrors({direccionCompleta:''});

        
        // Limpia los datos de localización.
        this.camposLocalizacion.map((name: string) => {
            this.form.get(name)?.setValue(null);
        });
        
        // Setea los valores en el form.
        this.camposLocalizacion.map((name: string) => {
            this.form.get(name)?.setValue((this.ubicacionElegida as any)[name]);
        });
        
        this.form.get('direccionCompleta')?.setValue(datos.direccion);

        // Si determinados datos están vacíos,
        // muestra campos para que los complete el usuario.
        this.mostrarCamposUbicacion = [
            datos.codigo_postal,
            datos.calle,
            datos.numero,
            datos.provincia,
            datos.localidad,
        ].filter(i => String(i).length === 0).length > 0;

        if (this.mostrarCamposUbicacion) {
            // Estos datos deben ser completados con los
            // autocomplete, por tanto, los borramos.
            this.form.patchValue({
                provincia     : '',
                codigo_postal : '',
                localidad     : ''
            });

            this.alElegirDireccionIncompleta.emit();
        }
    }

    public alEliminarUbicacion() {
        console.log('al eliminar ubicación');
        this.ubicacionElegida = undefined;
        this.camposLocalizacion.map((name: string) => {
            this.form.get(name)?.setValue(null);
        });
    }

    public alHacerFoco() {
        this.borrarDireccion();
    }

    public establecerDireccion(direccion : any) : void {
        this.form.patchValue({
            provincia     : direccion.provincia,
            localidad     : direccion.localidad,
            codigo_postal : `${direccion.codpost}`,
        });
    }

    public alSeleccionarProvincia(isUserInput : boolean, nombre : string) : void {
        console.log('alSeleccionarProvincia', isUserInput, nombre);

        if(!isUserInput){ //Esto es para que no se ejecute el evento con la opción seleccionada anteriormente.
            return;
        }

        let provincia = this.provincias.find(i=>i.nombre === nombre);

        if (!provincia) {
            return;
        }

        this.form.get('provincia_id')?.setValue(null);
        this.deshabilitarCodigoPostal = false;
        this.parametrosCodigoPostal.filtros.codpro = provincia.id;
        this.codigoPostal.clearList();
    }

    public verificarCamposCompletos(): boolean {
        return this.camposLocalizacion.filter(i => String(this.form.get(i)!.value).trim().length === 0).length === 0;
    }

}
