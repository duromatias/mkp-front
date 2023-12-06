import { AceptarBajaDialogComponent    } from 'src/app/auth/components/aceptar-baja-dialog/aceptar-baja-dialog.component';
import { AuthService                   } from 'src/app/auth/services/auth.service';
import { Component                     } from '@angular/core';
import { DarseBajaDialogComponent      } from 'src/app/auth/components/darse-baja-dialog/darse-baja-dialog.component';
import { DatosGuardadosDialogComponent } from 'src/app/auth/components/datos-guardados-dialog/datos-guardados-dialog.component';
import { DireccionComponent            } from 'src/app/shared/components/direccion/direccion.component';
import { emailValidator                } from 'src/app/shared/form-validators/validators';
import { environment                   } from 'src/environments/environment';
import { FormBaseComponent             } from 'src/app/shared/components/form-base.component';
import { FormControl, FormGroup                   } from '@angular/forms';
import { MatDialog                     } from '@angular/material/dialog';
import { Observable                    } from 'rxjs';
import { OnInit                        } from '@angular/core';
import { Router                        } from '@angular/router';
import { Validators                    } from '@angular/forms';
import { ViewChild                     } from '@angular/core';
import { Preview } from 'src/app/publicaciones/archivos/preview';
import { AgregarArchivoComponent } from '../agregar-archivo/agregar-archivo.component';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

@Component({
    selector    :   'app-mis-datos',
    templateUrl :   './mis-datos.component.html',
    styleUrls   : [ './mis-datos.component.scss' ]
})
export class MisDatosComponent extends FormBaseComponent implements OnInit {
  
    public esAgencia              : boolean = false; 
    public currentUser            : any = null;
    public mostrarCuit            : boolean = false;
    public linkOnboarding         : any;
    public datosCambiados         : boolean = false;
    public validarDireccion       : boolean = false;
    public habilitarGuardarCambios : boolean = false;

    public formVidriera!          : FormGroup;

    @ViewChild('archivoPortada')
    private archivos!: AgregarArchivoComponent;
    
    @ViewChild('componenteDireccion')
    public componenteDireccion !: DireccionComponent;

    constructor(
        private authSerivce       : AuthService,
        private dialog            : MatDialog,
        private router            : Router,
        private snackBar          : SnackBarService,
    ) {
        super();
    }
    
    public async ngOnInit() {
        this.createForm();
        this.createFormVidriera();
        this.spinnerService.go(async () => {
            this.currentUser = await this.obtenerYCompletar('me?opciones[business.redes_sociales]=true');
    
            if (this.currentUser.rol_id === 2) {
                this.esAgencia = true;
                this.completarCamposAgencia();
            } else {
                this.completarCamposParticular();
            }
            this.form.valueChanges.subscribe(() => {
                this.datosCambiados = true;
            });
        });


        this.linkOnboarding = environment.onboardingUrl + '/ingresar';
    }   

    protected get dataUrl(): string {
        return "/users";
    }

    private createForm() {
        this.addControls({
            apellido      : new FormControl({ value: '', disabled: false }),
            cuit          : new FormControl({ value: '', disabled: false }),
            email         : new FormControl({ value: '', disabled: false }, [emailValidator()]),
            nombre        : new FormControl({ value: '', disabled: false }),
            razon_social  : new FormControl({ value: '', disabled: false }),
            telefono      : new FormControl({ value: '', disabled: false }),
            provincia_id  : new FormControl({ value: '', disabled: false }),
            placeId       : new FormControl({ value: '', disabled: false }),
            codigo_postal : new FormControl({ value: '', disabled: false }),
            calle         : new FormControl({ value: '', disabled: false }),
            numero        : new FormControl({ value: '', disabled: false }),
            localidad     : new FormControl({ value: '', disabled: false }),
            provincia     : new FormControl({ value: '', disabled: false }),
            latitud       : new FormControl({ value: '', disabled: false }),
            longitud      : new FormControl({ value: '', disabled: false }),
            direccionCompleta : new FormControl({ value: '', disabled: false }),
        });

        this.form.get('telefono')?.valueChanges.subscribe((valor) => {
            if (!/^[^0][0-9]*$/.test(`${valor}`)) {
                this.setErrors({telefono: ['Debe ingresar sólo dígitos. No debe comenzar con cero']});
                return;
            }
        });
    }

    private createFormVidriera(){
        this.formVidriera = new FormGroup({
            instagram : new FormControl({ value: '', disabled: false }),
            facebook  : new FormControl({ value: '', disabled: false }),
            portada       : new FormControl({ value: '', disabled: false }),
            mini_portada  : new FormControl({ value: '', disabled: false }),
        });
    }

    public completarCamposAgencia(): void {
        // el map es para obtener la ruta entera en la variable usaers
        [this.currentUser.onboarding_user.business].map((user) => {
            console.log('user: ',user);
            this.form.patchValue({
                cuit          : user.cuit,
                razon_social  : user.name,
                telefono      : user.marketplace_phone,
            });

            this.formVidriera.patchValue({
                portada       : user.rutaImagenPortada,
                mini_portada  : user.rutaImagenMiniPortada,
                facebook      : user.redes_sociales.facebook,
                instagram     : user.redes_sociales.instagram
            });
        });
    }

    public completarCamposParticular() {
        this.form.patchValue({
            codigo_postal     : this.currentUser.codigo_postal,
            calle             : this.currentUser.calle,
            numero            : this.currentUser.numero,
            localidad         : this.currentUser.localidad,
            provincia         : this.currentUser.provincia,
            latitud           : this.currentUser.latitud,
            longitud          : this.currentUser.longitud,
            direccionCompleta : this.currentUser.direccionCompleta,
        });
    }

    public darDeBajaDialog(): void {
        this.dialog.open(DarseBajaDialogComponent, {
            disableClose: false,
            autoFocus: true,
        }).componentInstance.confirm.subscribe(()=>{
            this.aceptarBaja().subscribe(async ()=>{
                await this.apiService.post('/users/me/solicitarBaja',{})
                await this.authSerivce.logout();
                this.router.navigate(['/auth/login']);
            });
        });
    }

    public aceptarBaja(): Observable<void> {
        this.dialog.closeAll();
        return  this.dialog.open(AceptarBajaDialogComponent, {
            disableClose: false,
            autoFocus: true,
        }).componentInstance.confirm;
        
    }

    public guardarDatosDialog(): Observable<void> {
        return  this.dialog.open(DatosGuardadosDialogComponent, {
            disableClose: false,
            autoFocus: true,
        }).componentInstance.confirm;
    }

    public alElegirDireccionIncompleta() : void {
        this.validarDireccion = true;
    }

    public async submit(): Promise<void> {
        console.log('form al enviar: ', this.form);
        if(this.validarDireccion){
            if(!this.form.get('provincia')?.value){
                this.form.get('provincia')?.setErrors({error:'Obligatorio'});
            }
            else{
                this.form.get('provincia')?.setErrors(null);
            }
            if(!this.form.get('codigo_postal')?.value){
                this.form.get('codigo_postal')?.setErrors({error:'Obligatorio'});
            }
            else{
                this.form.get('codigo_postal')?.setErrors(null);
            }

            this.form.get('calle' )?.markAsTouched();
            this.form.get('numero')?.markAsTouched();
        }
        if (!this.form.valid) {
            return;
        }
        this.spinnerService.go(async () => {
            await this.enviarDatos();
            this.guardarDatosDialog();
        });
    }

    public alCambiarArchivos(data: Preview, archivo: string) {
        if(archivo == 'portada'){
            this.formVidriera.patchValue({
                portada : data != undefined ? data.original : '',
            });
        } else {
            this.formVidriera.patchValue({
                mini_portada : data != undefined ? data.original : '',
            });
        }

    }

    public onArchivosErrorChange(event : any) {
        if(event != '') this.habilitarGuardarCambios = true;
    }

    public async editarVidriera(){
        let body : any = {};


        if(this.formVidriera.get('portada')?.value instanceof File){
            body["portada"] = this.formVidriera.get('portada')?.value;
        }
        if(this.formVidriera.get('mini_portada')?.value instanceof File){
            body["mini_portada"] = this.formVidriera.get('mini_portada')?.value;
        }
        if(this.formVidriera.get('portada')?.value === ''){
            body["portada"] = 'eliminar' ;
        }
        if(this.formVidriera.get('mini_portada')?.value === ''){
            body["mini_portada"] = 'eliminar';
        }
        body["facebook"] = this.formVidriera.get('facebook')?.value;
        body["instagram"] = this.formVidriera.get('instagram')?.value;

        this.spinnerService.go(async () => {
            await this.apiService.post('/agencias/actualizar', body);
            this.snackBar.show("Vidriera actualizada con éxito.");
        });
       
    }
}
