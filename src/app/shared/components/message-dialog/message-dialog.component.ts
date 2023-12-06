import { Component       } from '@angular/core';
import { Inject          } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef    } from '@angular/material/dialog';
import { OnInit          } from '@angular/core';

@Component({
    selector    : 'app-message-dialog',
    templateUrl : './message-dialog.component.html',
    styleUrls   : ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {
    
    public textdialog : string = '';
    
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {textDialog: string},
        public  dialogRef : MatDialogRef<MessageDialogComponent>,
    ) 
    {}
    
    ngOnInit(): void {
        this.textdialog = this.data.textDialog;
    }
    
    public clickConfirm() : void {
        this.dialogRef.close();
    }
}
