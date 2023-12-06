import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-datos-guardados-dialog',
  templateUrl: './datos-guardados-dialog.component.html',
  styleUrls: ['./datos-guardados-dialog.component.scss']
})
export class DatosGuardadosDialogComponent implements OnInit {

    public confirm : EventEmitter<void> = new EventEmitter<void>();
    public reject  : EventEmitter<void> = new EventEmitter<void>();

    constructor(
        public  dialogRef : MatDialogRef<DatosGuardadosDialogComponent>,
    ) { }

    public ngOnInit(): void {
    }

    public clickConfirm() : void {
        window.location.reload();
        this.dialogRef.close();
        this.confirm.emit();

    }

    public clickReject() : void {
        this.dialogRef.close();
        this.reject.emit();
    }  
}
