import { ActivatedRoute                     } from '@angular/router';
import { AuthService                        } from '../../services/auth.service';
import { Component                          } from '@angular/core';
import { emailValidator                     } from 'src/app/shared/form-validators/validators';
import { FormControl                        } from '@angular/forms';
import { FormGroup                          } from '@angular/forms';
import { MatDialog                          } from '@angular/material/dialog';
import { minLength                          } from 'src/app/shared/form-validators/validators';
import { Observable                         } from 'rxjs';
import { OnInit                             } from '@angular/core';
import { Router                             } from '@angular/router';

import { FormBaseComponent                  } from 'src/app/shared/components/form-base.component';
import { LoginDialogAskOnboardingComponent  } from '../login-dialog-ask-onboarding/login-dialog-ask-onboarding.component';

@Component({
    selector    : 'app-login',
    templateUrl : './login.component.html',
    styleUrls   : ['./login.component.scss']
})
export class LoginComponent extends FormBaseComponent implements OnInit {

    public form!            : FormGroup;
    public hidePassword     : boolean = true;
    
    private redirect : any = null;
    
    constructor(
        private authService : AuthService,
        private dialog      : MatDialog,
        private router      : Router,
                route       : ActivatedRoute,    ){
        super();
        let queryParams = route.snapshot.queryParams;
        if(queryParams.redirect){
            this.redirect = queryParams.redirect
        }

    }

    public ngOnInit(): void {
        this.setForm();
    }

    public get dataUrl() : string {
        return "/auth/login"
    }

    public async submit() : Promise<any>{     
        if(!this.form.valid){
            return;
        }
        this.spinnerService.show();
        try{        
            await this.authService.login(
                this.form.get("email"   )?.value,
                this.form.get("password")?.value,
            );
            if(this.redirect){
                this.router.navigateByUrl(this.redirect);
                return;
            }
            this.router.navigateByUrl('/');
        }
        catch(e:any){
            this.setErrors(e.error.errors);
            if (e.error.name == "DatosUsuarioLivianoIncompletosException"){
                this.ask();
            } else {       
                this.errorMessage = e.error.message;
            }
        }
        finally{
            this.spinnerService.hide();
        }
    }

    public passwordKeyPress($event : any) : boolean {
        if ($event.key === "Enter") {
            this.submit();
            return false;
        }
        return true;
    }

    public setForm() : void {
        this.form = new FormGroup({
            email    : new FormControl('', [emailValidator()]),
            password : new FormControl('', [minLength(6)    ]),
        });
    }

    public ask() : Observable<void> {
        return this.dialog.open(LoginDialogAskOnboardingComponent,  {
            disableClose : false,
            autoFocus    : true,
        }).componentInstance.confirm;
    }

}
