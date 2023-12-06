import { Component          } from '@angular/core';
import { environment        } from 'src/environments/environment';
import { EventEmitter       } from '@angular/core';
import { MatDialogRef       } from '@angular/material/dialog';
import { OnInit             } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
    selector    : 'app-login-dialog-ask-onboarding',
    templateUrl : './login-dialog-ask-onboarding.component.html',
    styleUrls   : ['./login-dialog-ask-onboarding.component.scss']
})
export class LoginDialogAskOnboardingComponent implements OnInit {

    public confirm : EventEmitter<void> = new EventEmitter<void>();
    public reject  : EventEmitter<void> = new EventEmitter<void>();

    constructor(
        public dialogRef: MatDialogRef<LoginDialogAskOnboardingComponent>,  
        private userService: UserService,
    ) { }

    public ngOnInit(): void {
    }

    public clickConfirm() : void {

        location.href = `${environment.onboardingUrl}/registro?token=${this.userService.getOnBoardingAccessToken()}/registro?redirect_url=${environment.urlMarketplace}/auth/login`;
        this.dialogRef.close();
        this.confirm.emit();
    }

    public clickReject() : void {
        this.dialogRef.close();
        this.reject.emit();     
    }
}
