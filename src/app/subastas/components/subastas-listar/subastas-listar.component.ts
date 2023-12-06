import { ApiService        } from 'src/app/shared/services/api.service';
import { Component         } from '@angular/core';
import { DeviceService     } from 'src/app/shared/services/device.service';
import { ListadoComponent  } from 'src/app/shared/components/listados/listado.component';
import { ListadoDataSource } from 'src/app/shared/components/listado.datasource';
import { OnInit            } from '@angular/core';
import { Router            } from '@angular/router';
import { UserService       } from 'src/app/auth/services/user.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';


@Component({
    selector    : 'app-subastas-listar',
    templateUrl : './subastas-listar.component.html',
    styleUrls   : ['./subastas-listar.component.scss'],
    providers   : [
		ListadoDataSource,
	],
    })
export class SubastasListarComponent extends ListadoComponent implements OnInit {

    public isAdmin : boolean = false;

    constructor(
        private apiService    : ApiService,
        public  dataSource    : ListadoDataSource<any>,
        public  deviceService : DeviceService,
        private snackBar      : SnackBarService,
        private router        : Router,
        private userService   : UserService,
    ) {
        super();
    }

    async ngOnInit(): Promise<void> {
        //Esto tendría que resolverlo el routeGuard
        this.isAdmin = this.userService.esAdministrador();

        this.dataSource.uri = "/subastas";
        this.dataSource.ordenes.id = "DESC";
        this.clearColumns();
        this.setTable();
    }

    private setTable() {
        this.addColumn('fecha_inicio_inscripcion', 'Inicio de inscripcion', '170px').renderFn(row => this.formatDate(row.fecha_inicio_inscripcion));
        this.addColumn('fecha_fin_inscripcion', 'Fin de inscripcion', '170px').renderFn(row => this.formatDate(row.fecha_fin_inscripcion));
        this.addColumn('fecha_inicio_ofertas', 'Inicio de ofertas', '170px').renderFn(row => this.formatDate(row.fecha_inicio_ofertas));
        this.addColumn('fecha_fin_ofertas', 'Fin de ofertas', '170px').renderFn(row => this.formatDate(row.fecha_fin_ofertas));
        this.addColumn('estado', 'Estado', '130px').renderFn(row => row.estado).setAlign('center');
        this.addColumn('cantidad', 'Cantidad de vehículos', '150px').renderFn(row => {
            if(row.cantidad_publicaciones){
                return row.cantidad_publicaciones;
            }
            else {
                return '0';
            }
        }).setAlign('center');
        this.addColumn('_acciones', 'Acciones', '50px').setAsMenu().setAlign('right');
    }

    private formatDate(date : string) : string {
        let arrayDate = date.split('-');
        arrayDate.reverse();
        date = arrayDate[0] + '-' + arrayDate[1] + '-' + arrayDate[2];
        return date;
    }

    public async cancelarSubasta(id:any) {
        await this.apiService.post(`/subastas/${id}:cancelar`,{});
        this.snackBar.show('Subasta Cancelada');
        window.location.reload();
    }

    public async editarSubasta(id:any) {
        this.router.navigate([`/subastas/editar/${id}`]);
    }
    
    public consultarVehiculos(row : any) : void {
        this.router.navigateByUrl(`/subastas?fechaSubasta=${row.fecha_fin_ofertas}`);
    }
}
