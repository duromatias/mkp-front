import { ActivatedRoute    } from '@angular/router';
import { Component         } from '@angular/core';
import { FormBaseComponent } from 'src/app/shared/components/form-base.component';
import { FormControl       } from '@angular/forms';
import { OnInit            } from '@angular/core';


@Component({
    selector    : 'app-usuarios-editar',
    templateUrl : './usuarios-editar.component.html',
    styleUrls   : ['./usuarios-editar.component.scss']
})
export class UsuariosEditarComponent extends FormBaseComponent implements OnInit {
    
    public esAgencia          : boolean = false;
    public usuario            : any;
    public message            : string   = "Operación realizada con éxito";
    public showErrorMessage   : boolean = false;
    public showSuccessMessage : boolean = false;
    public id                 : number | undefined;
    public showForm           : boolean = false;

    constructor(
      private route   : ActivatedRoute,
    ) 
    {
      super();
    }

    public ngOnInit() {
        this.createForm();
        this.watchRoute();
        
    }
    
    protected get dataUrl(): string {
        return '/users';
    }
    
    private createForm() {
        this.form = this.fb.group({
            id                : new FormControl({ value: '', disabled: true  }),
            email             : new FormControl({ value: '', disabled: false }),
            nombre            : new FormControl({ value: '', disabled: false }),
            apellido          : new FormControl({ value: '', disabled: false }),
            direccionCompleta : new FormControl({ value: '', disabled: false }),
            telefono          : new FormControl({ value: '', disabled: false }),
            dni               : new FormControl({ value: '', disabled: false }),
            rol_id            : new FormControl({ value: '', disabled: false }),
            
            cuit              : new FormControl({ value: '', disabled: false }),
            razon_social      : new FormControl({ value: '', disabled: false }),
        });
       
    }
    
    private  watchRoute()  {
        this.route.params.subscribe(async (params) => {
            if (params.id) {  
                this.id = params.id;
                this.usuario = await this.obtenerYCompletar(params.id);
                this.setEsAgencia();
                this.showForm = true;
                
            }
        });
    }
    
    private setEsAgencia() : void {
        if (this.usuario.rol_id === 2) {
            this.esAgencia = true;
            this.setCamposAgencia();
            return;
        }
    }

    private setCamposAgencia() : void {        
        if(this.usuario.onboarding_user.business === null){
            return;
        }
        let user = this.usuario.onboarding_user.business;
        this.form.patchValue({
            cuit          : user.cuit || "",
            razon_social  : user.name,
            telefono      : user.phone,
        });
    }

    public async submit()   {
        this.showSuccessMessage = false;
        this.showErrorMessage   = false;
        let response            = null;
        try{
            response  = await this.apiService.post(this.dataUrl +'/'+this.id+'/actualizarRol', this.getFormData());
        }
        catch(error : any){
            if(error.error.message === "El usuario no se encuentra registrado en onboarding"){
                this.showErrorMessage = true;
            }
        
        }
        finally{
            if(response === null){
                return;
            }
            if(this.esAgencia){
                this.message = 'Operación realizada con éxito. Se asignó el password ‘12345678‘'
            }
            this.showSuccessMessage = true;
        }
    }

}
