import { Component, OnInit } from '@angular/core';
import { ListadoDataSource } from 'src/app/shared/components/listado.datasource';
import { ListadoComponent } from 'src/app/shared/components/listados/listado.component';
import { ApiService } from 'src/app/shared/services/api.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

@Component({
    selector: 'app-listar-parametros',
    templateUrl: './listar-parametros.component.html',
    styleUrls: ['./listar-parametros.component.scss']
})
export class ListarParametrosComponent extends ListadoComponent implements OnInit {

    public constructor(
        public dataSource: ListadoDataSource<any>,
        private apiService: ApiService,
        private snackBar: SnackBarService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.setTable();
    }

    public setTable() {
        this.dataSource.uri = "/parametros";

        this.addColumn('descripcion', 'Descripción', '');
        this.addColumn('valor', 'Valor', '450px').setAsInput().setRequired();
    }

    public async onSubmit() {
        for (const parametro of this.dataSource.currentData) {
            if (parametro.valor == '') {
                return;
            }
        }

        const data = {
            parametros: this.dataSource.currentData
        }

        await this.apiService.put('/parametros/mass-update', data);

        this.snackBar.show('Datos guardados exitosamente');
    }
}
