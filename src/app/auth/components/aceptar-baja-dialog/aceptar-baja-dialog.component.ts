import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-aceptar-baja-dialog',
  templateUrl: './aceptar-baja-dialog.component.html',
  styleUrls: ['./aceptar-baja-dialog.component.scss']
})
export class AceptarBajaDialogComponent implements OnInit {
    public confirm : EventEmitter<void> = new EventEmitter<void>();
    public reject  : EventEmitter<void> = new EventEmitter<void>();

    constructor(
        public  dialogRef : MatDialogRef<AceptarBajaDialogComponent>,
    ) { }

    public ngOnInit(): void {
    }

    public clickConfirm() : void {
        this.dialogRef.close();
        this.confirm.emit();
    }

    public clickReject() : void {
        this.dialogRef.close();
        this.reject.emit();
    }
    
}
