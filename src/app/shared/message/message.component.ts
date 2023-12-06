import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {message: string},
        public dialogRef: MatDialogRef<MessageComponent>,        
    ) { }

    ngOnInit(): void {
    }

    close() {
        this.dialogRef.close();
    }

}
