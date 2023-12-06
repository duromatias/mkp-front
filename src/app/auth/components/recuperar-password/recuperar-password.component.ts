import { Component         } from '@angular/core';
import { emailValidator    } from 'src/app/shared/form-validators/validators';
import { environment       } from 'src/environments/environment';
import { FormBaseComponent } from 'src/app/shared/components/form-base.component';
import { FormControl, Validators       } from '@angular/forms';
import { FormGroup         } from '@angular/forms';
import { OnInit            } from '@angular/core';
import { SnackBarService   } from 'src/app/shared/services/snack-bar.service';

@Component({
    selector    : 'app-recuperar-password',
    templateUrl : './recuperar-password.component.html',
    styleUrls   : ['./recuperar-password.component.scss']
})
export class RecuperarPasswordComponent extends FormBaseComponent implements OnInit {
    
    public form!              : FormGroup;
    public showErrorMessage   : boolean = false;
    public showOnboardingLink : boolean = false;
    public showSuccessMessage : boolean = false;

    protected get dataUrl(): string {
        return "";
    }

    constructor(
        private snackBar: SnackBarService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.setForm();
    }

    public onKey($event: any){
        if ($event.key && /^Arrow/.test($event.key)) {
            return;
        }
        this.showErrorMessage   = false;
        this.showOnboardingLink = false; 
    }

    public setForm() : void {
        this.form = new FormGroup({
            email: new FormControl('', [emailValidator()])
        });
    }

    public getFieldErrorMessage(controlName: string): string | void {
        const errors = this.form.get(controlName)!.errors;
        for (const error of Object.values(errors!)) {
            if (typeof error === 'string') {
                return error;
            }
        }
    }

    public async submit() {
        this.showErrorMessage = false;
        this.showSuccessMessage = false;
        if(this.form.get('email')?.value === "") {
            this.form.get('email')?.setErrors({email: 'Email inválido'});
            return;
        }
        if (!this.form.valid){
            return;
        } 
        
        try {
            this.apiService.mostrarMensajes=false;
            const response: any = await this.apiService.post('/auth/recuperar-password', this.form.value);
            this.showSuccessMessage = true;
            this.form.get('email')?.setValue("");
            this.form.get('email')?.setErrors(null);
            //this.form.get('email')?.setValue("");
            //this.form.get('email')?.setValidators(Validators.required);

        }
        catch (errorResponse: any) {
            if (errorResponse.error.message === "Los datos ingresados son inválidos"){
                this.showErrorMessage = true;
            }
            if (errorResponse.error.name === 'RecuperarPasswordException') {
                this.showOnboardingLink = true;
            }
        } 
        finally{
            this.apiService.mostrarMensajes=true;
        }    
    }

    public getOnboardingLink() : string {
        return `${environment.onboardingUrl}/olvide_mi_contrasena`;
    }
}
