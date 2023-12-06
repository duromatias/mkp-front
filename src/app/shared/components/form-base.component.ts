import { ApiService        } from "../services/api.service";
import { ConfirmService    } from "../services/confirm.service";
import { FormControl       } from "@angular/forms";
import { FormGroup         } from "@angular/forms";
import { FormBuilder       } from "@angular/forms";
import { LocatorService    } from "../services/locator.service";
import { MessagesService   } from "../services/messages.service";
import { SnackBarService   } from "../services/snack-bar.service";
import { SpinnerService    } from "../services/spinner.service";

export type FormControlHash = { [ x: string ]: FormControl };



export abstract class FormBaseComponent {

    public    id           : any;
    //@ts-ignore
    public    form         : FormGroup;
    public    errorMessage : string = "";
    public    mensaje      : string = '';

    public    apiService      = LocatorService.injector.get(ApiService     );
    protected fb              = LocatorService.injector.get(FormBuilder    );
    protected messages        = LocatorService.injector.get(MessagesService);
    protected confirmService  = LocatorService.injector.get(ConfirmService );
    protected snackbarService = LocatorService.injector.get(SnackBarService);
    protected spinnerService  = LocatorService.injector.get(SpinnerService );

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

    protected addControls(controls: FormControlHash) {
        this.form = this.fb.group(controls);
    }

    protected async enviarDatos(mostrarMensajes: boolean = false): Promise<any> {
        try {
            this.apiService.mostrarMensajes = mostrarMensajes;
            this.mensaje = '';
            let promise  = (this.id ? await this.actualizar() : await this.crear())["data"];
            this.mensaje = 'Datos guardados';
            return promise;
        } catch(e:any) {
            this.capturarErrores(e);
            throw e;
        } finally {
            this.apiService.mostrarMensajes = true;
        }
    }

    protected capturarErrores (e:any){
        console.log('error', e);
        this.setErrors(e.error.errors);
        this.errorMessage = e.error.message;
        console.log("errormessage",this.errorMessage)
    }

    protected obtenerDatos(id: any, params? : any): Promise<any> {
        return this.apiService.getData(this.getDataUrl(id), params);
    }

    protected crear(): Promise<any> {
        return this.apiService.post(this.getDataUrl(), this.getFormData());
    }

    protected actualizar(): Promise<any> {
        return this.apiService.put(this.getDataUrl() + '/' + this.id, this.getFormData());
    }

    protected abstract get dataUrl(): string;

    protected getDataUrl(id?: any) : string {
        return this.dataUrl + (id ? `/${id}` : '');
    }

    protected getFormData(): any {
        return this.form!.getRawValue();
    }

    protected completarCampos(data: any): void {
        this.form!.patchValue(data);
    }

    public async obtenerYCompletar(id: any, params?: any): Promise<any> {
        let data = await this.obtenerDatos(id, params);
        this.completarCampos(data);
        this.id = id;
        return data;
    }

}
