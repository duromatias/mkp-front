import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-darse-baja-dialog',
  templateUrl: './darse-baja-dialog.component.html',
  styleUrls: ['./darse-baja-dialog.component.scss']
})
export class DarseBajaDialogComponent implements OnInit {

    public confirm : EventEmitter<void> = new EventEmitter<void>();
    public reject  : EventEmitter<void> = new EventEmitter<void>();

    constructor(
        public  dialogRef : MatDialogRef<DarseBajaDialogComponent>,
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

