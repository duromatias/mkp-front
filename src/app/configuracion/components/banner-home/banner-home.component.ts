import { Component, OnInit, ViewChild } from '@angular/core';
import { ListadoDataSource } from 'src/app/shared/components/listado.datasource';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { Router } from '@angular/router';
import { DeviceService } from '../../../shared/services/device.service';

@Component({
  selector: 'app-banner-home',
  templateUrl: './banner-home.component.html',
  styleUrls: ['./banner-home.component.scss']
})
export class BannerHomeComponent implements OnInit {

    @ViewChild('table', {static: true, read: TableComponent})
    public table!: TableComponent<ListadoDataSource<any>>;

    public constructor(
        private deviceService      : DeviceService,
        public  dataSource 		   : ListadoDataSource<any>,
        private router             : Router,
    ) {
    }

    public ngOnInit(): void {
        this.dataSource.uri = "/parametros/home-carousel-slides";
        console.log("datasource",this.dataSource)

        this.deviceService.observe((result:boolean) => {
            this.table.clearColumns();
            this.table.addColumn('Orden'  ,       'Orden'  ,    '70px' ).renderFn(row => row.orden).setAlign('right');
            this.table.addColumn('título' ,       'Título' ,    '300px').renderFn(row => row.titulo);
            this.table.addColumn('detalle',       'Detalle',	'300px').renderFn(row => row.detalle);
            this.table.addColumn('link'   ,	      'Link'   ,    '300px').renderFn(row => row.link);
            //Hay que agregar una columna par renderizar imagenes.
            this.table.addColumn('_acciones',    	'Acciones',      		'90px' ).setAsMenu().setAlign('right');
            this.table.setFnMenuItems((row: any) => {
                this.table.clearMenuItems();
                this.table.addMenuItem('Editar', () => {
                    this.router.navigateByUrl(`configuracion/banner/${row.id}`);
                });
            });
        });
    }

    public borrarFila(row:any){

    }

}
