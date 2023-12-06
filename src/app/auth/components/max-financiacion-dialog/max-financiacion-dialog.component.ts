import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-max-financiacion-dialog',
  templateUrl: './max-financiacion-dialog.component.html',
  styleUrls: ['./max-financiacion-dialog.component.scss']
})
export class MaxFinanciacionDialogComponent implements OnInit {

    public confirm : EventEmitter<void> = new EventEmitter<void>();
    public reject  : EventEmitter<void> = new EventEmitter<void>();
    
    constructor(
        public  dialogRef : MatDialogRef<MaxFinanciacionDialogComponent>,
      ) { }
    
      ngOnInit(): void {
      }
    
        public clickConfirm() : void {
            this.dialogRef.close();
            this.confirm.emit();
        }
}
