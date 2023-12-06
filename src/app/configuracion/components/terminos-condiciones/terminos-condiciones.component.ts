import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import ckEditorClassic from '@ckeditor/ckeditor5-build-classic';
import { ApiService } from 'src/app/shared/services/api.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';


@Component({
    selector: 'app-terminos-condiciones',
    templateUrl: './terminos-condiciones.component.html',
    styleUrls: ['./terminos-condiciones.component.scss']
})
export class TerminosCondicionesComponent implements OnInit {
    public classicEditor       : any;
    public terminosCondiciones : string = '';

    constructor(
        private apiService : ApiService,
        private snackBar   : SnackBarService,
        private router     : Router,

    ) {
        this.classicEditor = ckEditorClassic;
    }

    public async ngOnInit(): Promise<void> {
        let data = await this.apiService.getData('/auth/tyc');
        this.terminosCondiciones = data.tyc;
    }


    public async saveTyC() {
        await this.apiService.put('/auth/admin/tyc', {tyc:this.terminosCondiciones});
        this.snackBar.show('Datos guardados exitosamente');
        this.router.navigate(['/configuracion']);
    }

}
