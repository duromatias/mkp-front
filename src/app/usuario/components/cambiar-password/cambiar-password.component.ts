import { Component                 } from '@angular/core';
import { OnInit                    } from '@angular/core';
import { ControlContainer, FormControl               } from '@angular/forms';
import { FormBaseComponent         } from 'src/app/shared/components/form-base.component';
import { matchingEqualFields, matchingFields, minLength } from 'src/app/shared/form-validators/validators';

class Campo {
    
    public constructor(
        public nombre: string,
        public titulo: string,
        public ocultar: boolean = true,
    ) {

    }
}

@Component({
    selector: 'app-cambiar-password',
    templateUrl: './cambiar-password.component.html',
    styleUrls: ['./cambiar-password.component.scss']
})
export class CambiarPasswordComponent extends FormBaseComponent implements OnInit {

    public hideOldPassword     = true;
    public hideNewPassword     = true;
    public hideConfirmPassword = true;
    public id = 'me';
    public campos = [
        new Campo('password_actual'  , 'Contraseña Actual'   ),
        new Campo('password_nueva'   , 'Contraseña Nueva'    ),
        new Campo('password_nueva_2' , 'Confirmar Contraseña'),
    ];

    protected get dataUrl(): string {
        return "";
    }

    ngOnInit(): void {
        this.createForm();
        this.form.get('password_nueva')?.valueChanges.subscribe(()=>{
            if(this.form.get('password_actual')?.value === this.form.get('password_nueva')?.value){
                this.form.get('password_nueva_2')?.disable();
            }
            if(this.form.get('password_actual')?.value !== this.form.get('password_nueva')?.value){
                this.form.get('password_nueva_2')?.enable();
            }
        })
    }

    private createForm() {
        this.form = this.fb.group({
            password_actual  : new FormControl({ value: '', disabled: false },[ minLength(6) ]),
            password_nueva   : new FormControl({ value: '', disabled: false },[ minLength(6) ]),
            password_nueva_2 : new FormControl({ value: '', disabled: false }),
        });

        this.form.get('password_nueva_2')?.addValidators([
            matchingFields(this.form.get('password_nueva')!, 'matchPassword', 'Las contraseñas no coinciden')
        ]);
        this.form.get('password_nueva')?.addValidators([
            matchingEqualFields(this.form.get('password_actual')!, 'matchPassword', 'La contraseña nueva debe ser distinta a la contraseña actual')
        ]);
        this.form.get('password_actual')?.addValidators([
            matchingEqualFields(this.form.get('password_nueva')!, 'matchPassword', 'La contraseña nueva debe ser distinta a la contraseña actual')
        ]);
    }

    protected actualizar(): Promise<any> {
        return this.apiService.post('/users/me/actualizarPassword', this.getFormData());
    }

    public submit() {
        if(!this.form.valid){
            return;
        }
        this.spinnerService.go(async () => {
            await this.enviarDatos();
            this.mensaje = 'Contraseña actualizada correctamente';
        });
    }

}
