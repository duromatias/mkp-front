import { Component         } from '@angular/core';
import { emailValidator    } from 'src/app/shared/form-validators/validators';
import { FormBaseComponent } from 'src/app/shared/components/form-base.component';
import { FormControl       } from '@angular/forms';
import { FormGroup         } from '@angular/forms';
import { Input             } from '@angular/core';
import { OnInit            } from '@angular/core';
import { SnackBarService   } from 'src/app/shared/services/snack-bar.service';
import { UserService       } from 'src/app/auth/services/user.service';
import { UsuarioInterface  } from 'src/app/usuarios/models/user.model';
import { DeviceService } from 'src/app/shared/services/device.service';

@Component({
    selector    : 'publicaciones-form-consulta',
    templateUrl : './form-consulta.component.html',
    styleUrls   : ['./form-consulta.component.scss']
})
export class FormConsultaComponent extends FormBaseComponent implements OnInit {


    @Input()
    public publicacion : any;

    @Input()
    public user! : UsuarioInterface;

    public email : string = '';
    public name  : string = '';
    public phone : string  = '';
    public publicacionPropia : boolean = false;
    public heightFormConsulta       : number = 0;
    public showFormConsulta         : 'none' | 'block' = 'none';

    constructor(
        public  deviceService   : DeviceService,
        private snackService    : SnackBarService,
        private userService     : UserService,
    )
    {
        super()
    }

    public get dataUrl() {
        return `/publicaciones/*/consultas`;
    }


    ngOnInit(): void {
        this.user = this.userService.getUser();
        if(this.publicacion.financiacion === 0){
            this.openFormConsulta();
        }
        this.setForm();
        this.checkPublicacionPropia();
    }

    public setForm() : void {
        this.form = new FormGroup({
            nombre         : new FormControl(''),
            email          : new FormControl('', [emailValidator()]),
            telefono       : new FormControl('', ),
            texto          : new FormControl(''),
            publicacion_id : new FormControl(''),
        });
        this.setFields();
    }

    setFields() {
        this.form.get('publicacion_id')?.setValue(this.publicacion.id);

        if(this.user === null){
            return;
        }

        this.form.get('email')?.setValue(this.user.email);

        if(this.user.rol_id === 1 || this.user.rol_id === 3){
            this.name = this.user.nombre;
            this.form.get('nombre')?.setValue(this.name);
            if(this.user.telefono){
                this.form.get('telefono')?.setValue(this.user.telefono);
                this.phone = this.user.telefono;
            }
            return;
        }

        if(this.user.rol_id === 2){
            if(this.user.onboarding_user.user_personal_data){
                this.name = this.user.onboarding_user.user_personal_data?.first_name + ' ' + this.user.onboarding_user.user_personal_data?.last_name;
                this.form.get('nombre')?.setValue(this.name);
            }
            this.form.get('nombre')?.setValue(this.name);

            let telefono = this.user?.onboarding_user?.business?.marketplace_phone;
            this.form.get('telefono')?.setValue(this.formatearTelefono(telefono));
            return;
        }

    }

    public validarCaracteres(event : any) : boolean {
        if ( /^[a-zäëïöüáéíóúàèìòùâêîôûäëïöüñ\' ]$/i.test(event.key)) {
          return true;
        }
        return false;
    }

    public validarCaracteresTelefono(event : any) {
        if ( /^[0-9\s]+$/g.test(event.key)) {
          return true;
        }
        return false;
    }

    public checkTelefono() : void {
        let telefono : string = this.form.get('telefono')?.value;

        if(telefono[0] === '0'){
            this.form.get('telefono')?.setErrors({telefono:'No puede comenzar con 0'});
        }
    }

    public async submit()  {
        if(!this.form.valid){
            return;
        }

        try {
            this.name = this.form.get('nombre')?.value;
            await this.enviarDatos();
            this.snackService.show('Consulta enviada con éxito');
            this.form.reset();
            this.setFields();
            Object.keys(this.form.controls).forEach(key => {
                this.form.get(key)?.setErrors(null) ;
            });
        }
        catch (error : any) {
            this.snackService.show(error);
        }
    }

    private checkPublicacionPropia() {
        if (this.publicacion.usuario_id === this.user?.id) {
            this.publicacionPropia = true;
        }
        else {
            this.publicacionPropia = false;
        }
    }

    public openFormConsulta() : void {
        this.showFormConsulta         = 'block';
        setTimeout(() => this.heightFormConsulta = 100,0)
    }

    private formatearTelefono(telefonoSinFormato : string) : string {
        let telefonoSinEspacios = telefonoSinFormato.split(/\s+/).join('');
        let telefonoSinCeroAlComienzo : string;
        if(telefonoSinEspacios[0] === '0' ){
            telefonoSinCeroAlComienzo = telefonoSinEspacios.slice(1, -1);     
        }
        else{
            telefonoSinCeroAlComienzo = telefonoSinEspacios
        }
        return telefonoSinCeroAlComienzo;
    }
}
