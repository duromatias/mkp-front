import { Component       } from '@angular/core';
import { environment     } from 'src/environments/environment';
import { EventEmitter    } from '@angular/core';
import { Inject          } from '@angular/core';
import { MatDialogRef    } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OnInit          } from '@angular/core';
import { Optional        }    from '@angular/core';
import { UserService } from 'src/app/auth/services/user.service';

@Component({
    selector    : 'app-login-dialog-ask-onboarding',
    templateUrl : './subastas-onboarding-dialog.html',
    styleUrls   : ['./subastas-onboarding-dialog.scss']
})
export class SubastasOnboardingDialogComponent implements OnInit {

    public confirm : EventEmitter<void> = new EventEmitter<void>();
    public reject  : EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private userService : UserService,
        public dialogRef : MatDialogRef<SubastasOnboardingDialogComponent>, 
        @Optional() @Inject(MAT_DIALOG_DATA)public data: any,
    ) { }

    public ngOnInit(): void {
    }

    public clickConfirm() : void {

        location.href = `${environment.onboardingUrl}/registro?token=${this.userService.getOnBoardingAccessToken()}`;
        this.dialogRef.close();
        this.confirm.emit();
    }

    public clickReject() : void {
        this.dialogRef.close();
        this.reject.emit();     
    }
}
