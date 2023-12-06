import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormBaseComponent } from 'src/app/shared/components/form-base.component';
import { matchingFields, minLength } from 'src/app/shared/form-validators/validators';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

@Component({
    selector: 'app-restablecer-password',
    templateUrl: './restablecer-password.component.html',
    styleUrls: ['./restablecer-password.component.scss']
})
export class RestablecerPasswordComponent extends FormBaseComponent implements OnInit {
    form!: FormGroup;
    hidePassword = true;


    constructor(
        private snackBar: SnackBarService,
        private route: ActivatedRoute
    ) {
        super();
    }

    ngOnInit(): void {
        this.setForm();
    }


    protected get dataUrl(): string {
        throw new Error('Method not implemented.');
    }

    setForm() {
        const email = this.route.snapshot.queryParamMap.get('email');
        const token = this.route.snapshot.queryParamMap.get('token');


        this.form = new FormGroup({
            email: new FormControl({ value: email, disabled: true }),
            password: new FormControl('', minLength(8)),
            password_confirmation: new FormControl(''),
            token: new FormControl(token)
        });

        this.form.get('password_confirmation')?.addValidators([matchingFields(this.form.get('password')!, 'matchPassword', 'Las contraseñas no coinciden')]);
    }

    getFieldErrorMessage(controlName: string): string | void {
        const errors = this.form.get(controlName)!.errors;

        for (const error of Object.values(errors!)) {
            if (typeof error === 'string') {
                return error;
            }
        }
    }

    submit() {
        if (this.form.valid) {
            this.apiService.post('/auth/reset-password', this.form.getRawValue())
                .then((response: any) => this.snackBar.show(response.status))
                .catch(errorResponse => this.setErrors(errorResponse.error.errors));
        }
    }

}
