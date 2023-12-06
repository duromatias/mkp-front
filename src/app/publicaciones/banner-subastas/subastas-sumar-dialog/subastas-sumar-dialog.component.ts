import { Component    } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { OnInit       } from '@angular/core';
import { Router       } from '@angular/router';

@Component({
    selector    : 'app-subastas-sumar-dialog',
    templateUrl : './subastas-sumar-dialog.component.html',
    styleUrls   : ['./subastas-sumar-dialog.component.scss']
})
export class SubastasSumarDialogComponent implements OnInit {

    constructor(
        public  dialogRef : MatDialogRef<SubastasSumarDialogComponent>,
        private router : Router,
    ) { }

    ngOnInit(): void {
    }

    public publicarNuevo() : void {
        
        this.router.navigateByUrl(`/publicaciones/agregar?inscribir_subasta_id=${this.dialogRef.id}`);
        this.dialogRef.close();
    }

    public elegirDeStock() : void {
        this.router.navigate(['/publicaciones/mis-publicaciones']);
        this.dialogRef.close();
    }

}
