import { ApiService         } from 'src/app/shared/services/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ListadoDataSource } from 'src/app/shared/components/listado.datasource';
import { formatDate } from '@angular/common';
import { ConfirmService } from 'src/app/shared/services/confirm.service';
import { UserService } from 'src/app/auth/services/user.service';
import { TableComponent } from '../../../shared/components/table/table.component';
import { Router } from '@angular/router';
import { DeviceService } from '../../../shared/services/device.service';

@Component({
    selector: 'app-consultas',
    templateUrl: './consultas-listar.component.html',
    styleUrls: ['./consultas-listar.component.scss']
})
export class ConsultasListarComponent implements OnInit {

    public filtroPublicacion             : any;

    public user                          : any;

    public isMobile!              : boolean;

    public esParticular                  :boolean = false;

    @ViewChild('table', {static: true, read: TableComponent})
    public table!: TableComponent<ListadoDataSource<any>>;

    constructor(
        private apiService     : ApiService,
        private confirmService : ConfirmService,
        private deviceService  : DeviceService,
        public  dataSource 	   : ListadoDataSource<any>,
        private userService    : UserService,
        private router         : Router,
    ) {

    }

    ngOnInit(): void {

        if (this.userService.getUser()?.rol_id === 3) {
          this.esParticular = true;
        }

        this.user = this.userService.getUser();
        this.dataSource.uri = "/publicaciones/*/consultas";
        this.dataSource.queryParams['opciones'] = {with_relation: ['usuarioOrigen','publicacion']};
        this.dataSource.ordenes.created_at = "desc";
        this.deviceService.observe((result: boolean) => {
            this.table.clearColumns();
            this.table.addColumn('fecha',       'Fecha',             '125px').renderFn(row => formatDate(row.created_at,'dd-MM-yyyy', 'en-US'));
            this.table.addColumn('nombre',      'Nombre Y Apellido', '200px').renderFn(row => row.nombre);
            this.table.addColumn('email',       'Email',             '240px').renderFn(row => row.email);
            this.table.addColumn('telefono',    'Teléfono',          '130px').renderFn(row => row.telefono);
            this.table.addColumn('publicacion', 'Publicación',       '435px').renderFn(row => row.publicacion.marca + ' ' + row.publicacion.modelo + ' ' + row.publicacion.año)
                .setAsLink(row => '/publicaciones/' + row.publicacion.id);
            this.table.addColumn('estado',      'Estado',            '40px' ).renderFn(row => row.estado);
            this.table.addColumn('_acciones',   'Acción',      		   '30px' ).setAsMenu().setAlign('right');
            this.table.setFnMenuItems((row: any) => {
                this.table.clearMenuItems();
                if (row.estado === 'Resuelta'){
                    this.table.addMenuItem('Consultar', () => {
                        this.router.navigateByUrl(`/usuario/consultas/${row.id}`);
                    })
                }
                if (row.estado === 'Pendiente') {
                    this.table.addMenuItem('Resolver', () => {
                        this.router.navigateByUrl(`/usuario/consultas/${row.id}`);
                    });
                }
            });
            this.isMobile = result;
        });
    }

    public cambiarEstado(id : number): void {
        this.confirmService.ask(`¿Desea marcar la consulta como resuelta?`).subscribe( async ()=>{
            await this.apiService.post(`/publicaciones/*/consultas/${id}:resolver`,{});
            this.dataSource.refreshData();
        });
    }

    public publicacionesChange(){
        if(this.filtroPublicacion === 'TODAS'){
            delete this.dataSource.filtros.usuario_destino_id;
        } else{
            this.dataSource.filtros.usuario_destino_id = this.user.id;
        }
        this.dataSource.refreshData(0);
    }
}
