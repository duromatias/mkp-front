import { Component          } from '@angular/core';
import { environment        } from 'src/environments/environment';
import { EventEmitter       } from '@angular/core';
import { MatDialogRef       } from '@angular/material/dialog';
import { OnInit             } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector    : 'email-dialog',
    templateUrl : './email.component.html',
    styleUrls   : ['./email.component.scss']
})
export class EmailComponent implements OnInit {

    public confirm : EventEmitter<void> = new EventEmitter<void>();
    public reject  : EventEmitter<void> = new EventEmitter<void>();

    constructor(
        public  dialogRef : MatDialogRef<EmailComponent>,
        private router : Router,
    ) { }

    public ngOnInit(): void {
    }

    public clickConfirm() : void {
        this.router.navigate(['/auth/login']);
        this.dialogRef.close();
        this.confirm.emit();
    }

    public clickReject() : void {
        this.dialogRef.close();
        this.reject.emit();
    }
}
