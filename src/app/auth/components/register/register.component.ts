import { AbstractControl              } from '@angular/forms';
import { ApiService                   } from 'src/app/shared/services/api.service';
import { AuthService                  } from '../../services/auth.service';
import { Component                    } from '@angular/core';
import { cuitFormat                   } from 'src/app/shared/form-validators/validators';
import { DireccionComponent           } from 'src/app/shared/components/direccion/direccion.component';
import { EmailComponent               } from '../email-dialog/email.component';
import { emailValidator               } from 'src/app/shared/form-validators/validators';
import { FormControl                  } from '@angular/forms';
import { FormGroup                    } from '@angular/forms';
import { matchingFields               } from 'src/app/shared/form-validators/validators';
import { MatDialog                    } from '@angular/material/dialog';
import { maxLength                    } from 'src/app/shared/form-validators/validators';
import { minLength                    } from 'src/app/shared/form-validators/validators';
import { Observable                   } from 'rxjs';
import { OnDestroy                    } from '@angular/core';
import { OnInit                       } from '@angular/core';
import { ROLES                        } from 'src/app/usuarios/models/rol.model';
import { RolInterface                 } from 'src/app/usuarios/models/rol.model';
import { Router                       } from '@angular/router';
import { Subject                      } from 'rxjs';
import { UserService                  } from '../../services/user.service';
import { ViewChild                    } from '@angular/core';

@Component({
    selector    : 'app-register',
    templateUrl : './register.component.html',
    styleUrls   : ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

    public apiErrors             : any = {};
    public form!                 : FormGroup;
    public email                 : any;
    public hidePassword          : boolean = true;
    public messageErrorUbicacion : string = '';
    public ngDestroy$            : Subject<unknown> = new Subject();
    public roles                 : RolInterface[] = [];
    public submitted             : boolean = false;
    public success               : boolean = false;
    public terminosCondiciones   : boolean = false;
    public textValidado          : boolean = true;

    public validarDireccionIncompleta : boolean = true;

    @ViewChild('componenteDireccion')
    private componenteDireccion!: DireccionComponent;

    constructor(
        private apiService          : ApiService,
        private authService         : AuthService,
        private dialog              : MatDialog,
        private router              : Router,
        private userService         : UserService,
    ) { }


    public ngOnInit(): void {
        this.fetchRoles();
        this.setForm();
    }


    async fetchRoles() {
        let roles = await this.authService.getRoles();
        this.roles = roles.filter(rol => [ROLES.USUARIO_AGENCIA, ROLES.USUARIO_PARTICULAR].includes(rol.id));
    }



    public async verifyEmail() : Promise<void> {
        let email_confirmation = this.form.get("email_confirmation")?.value;

        let puedeRegistrarEmail = await this.apiService.getData('/auth/puedeRegistrarEmailEnOnboarding', {email:email_confirmation});
        if(!puedeRegistrarEmail){
            this.mailDialog();
        }
    }

    public mailDialog(): Observable<void> {
        return this.dialog.open(EmailComponent, {
            disableClose: false,
            autoFocus: true,
        }).componentInstance.confirm;
    }

    public setForm() {
        this.form = new FormGroup({
            email                 : new FormControl('', [emailValidator()]),
            email_confirmation    : new FormControl('', emailValidator()),
            password              : new FormControl('', [minLength(8)]),
            password_confirmation : new FormControl(''),
            rol_id                : new FormControl(''),

            // Agencia
            razon_social          : new FormControl(''),
            cuit                  : new FormControl('', [cuitFormat()]),
            provincia_id          : new FormControl({ value: '', disabled: false }),
            placeId               : new FormControl({ value: '', disabled: false }),
            codigo_postal         : new FormControl({ value: '', disabled: false }),
            calle                 : new FormControl({ value: '', disabled: false }),
            numero                : new FormControl({ value: '', disabled: false }),
            localidad             : new FormControl({ value: '', disabled: false }),
            provincia             : new FormControl({ value: '', disabled: false }),
            latitud               : new FormControl({ value: '', disabled: false }),
            longitud              : new FormControl({ value: '', disabled: false }),
            direccionCompleta     : new FormControl({ value: '', disabled: false }),
            codigo_area           : new FormControl('', [minLength(2), maxLength(4)]),
            telefono              : new FormControl('', [minLength(5), maxLength(8)]),

            // PARTICULAR
            nombre                : new FormControl(''),
        
        });


        // Add matching validators
        this.form.get('email_confirmation')?.addValidators([matchingFields(this.form.get('email')!, 'matchEmail', 'Los emails no coinciden')]);
        this.form.get('password_confirmation')?.addValidators([matchingFields(this.form.get('password')!, 'matchPassword', 'Las contraseñas no coinciden')]);

    }


  getOptionDescription(option: { description: string, place_id: string }) {
    return option.description;
  }


  showAgenciaRolFields() {
    return this.form.get('rol_id')!.value === ROLES.USUARIO_AGENCIA;
  }

  showParticularRolFields() {
    return this.form.get('rol_id')!.value === ROLES.USUARIO_PARTICULAR;
  }


  getFieldErrorMessage(controlName: string) {
    // Dividir para poder acceder a nested controls
    const controlNames = controlName.split('.');

    let control: AbstractControl = this.form;
    for (const controlName of controlNames) {
      control = control.get(controlName)!;
    }

    const errors = control.errors;

    for (const error of Object.values(errors!)) {
      if (typeof error === 'string') {
        return error;
      }
    }

    return;
  }

    public validarForm() : boolean {
        const rol = this.form.get('rol_id')?.value;

        if( rol === ROLES.USUARIO_AGENCIA){
            if(this.validarDireccionIncompleta){
                console.log('se ejecuto');
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
            return this.form.valid
        }
        else{
            let fieldsParticular : Array<string> = ['email','email_confirmation','password','password_confirmation','nombre']
            let formValido = true;
            fieldsParticular.forEach(element => {
                if(this.form.get(element)?.invalid){
                    formValido = false;
                }
            });
            return formValido
        }
        
    }


    public submit(): void {
        this.submitted = true;

        if (!this.validarDireccion() && !this.validarDireccionIncompleta) {
            this.form.get('direccion')?.setErrors({error:'Ingrese una dirección valida'});
            return;
        }
        if (!this.terminosCondiciones) {
            return;
        }
        
        if (this.validarForm()) {
            this.apiErrors = {};

            let body = this.form.value;

            const rol = this.form.get('rol_id')?.value;

            // Registrar usuario particular
            if (rol === ROLES.USUARIO_PARTICULAR) {

                this.authService.registrarUsuarioParticular(body).subscribe({
                next: (response: any) => {
                    this.userService.setAccessToken(response.access_token);
                    this.authService.getCurrentUser();
                    this.handleSuccessRegistro();
                },
                error: errorResponse => this.apiErrors = errorResponse.error.errors
                });
            }

            // registrar agencia
            if (rol === ROLES.USUARIO_AGENCIA) {
                
                const codigo_area = this.form.get('codigo_area')?.value;
                const telefono = this.form.get('telefono')?.value;

                body['telefono'] = `0${codigo_area} 15${telefono}`;
                body['cuit'] = `${body['cuit']}`;

                this.authService.registrarUsuarioAgencia(body).subscribe({
                next: (response: any) => {
                    this.userService.setAccessToken(response.access_token);
                    this.authService.getCurrentUser();
                    this.handleSuccessRegistro();
                },
                error: errorResponse => this.apiErrors = errorResponse.error.errors
                });
            }
        }
    }

    public changeDireccion() : void {
        if(!this.validarDireccion()){
            this.form.get('direccion')?.setErrors({error:'Ingrese una dirección válida'});
        }
    }

    private validarDireccion() : boolean {
        const rol = this.form.get('rol_id')?.value;
        if(rol !== ROLES.USUARIO_AGENCIA){
            return true;
        }

        return this.componenteDireccion.verificarCamposCompletos();
    }


  handleSuccessRegistro() {
    this.success = true;

    setTimeout(() => {
      this.router.navigate(['']);
      window.scroll(0, 0);
    }, 2000);
  }

  ngOnDestroy() {
    this.ngDestroy$.next();
    this.ngDestroy$.complete();
  }

  //@ts-ignore
  validarCaracteres(event: any) {
    if (!/^[a-zäëïöüáéíóúàèìòùâêîôûäëïöüñ\' ]$/i.test(event.key)) {
      return false;
    }
  }

    public keyDownDireccion(event : any) : any{
        if(['Enter'].includes(event.key)){
            return false;
        }
    }

    public alElegirDireccionIncompleta() : void {
        this.validarDireccionIncompleta = true;
    }

    public cambiarTipoDeUsuario(event : any) : void {
        let rolSeleccionado = event.value;
        if(rolSeleccionado === 3){
            this.validarDireccionIncompleta = false;
        }
    }
}
