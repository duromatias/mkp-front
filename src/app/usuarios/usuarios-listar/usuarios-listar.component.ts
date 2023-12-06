import { ApiService         } from 'src/app/shared/services/api.service';
import { Component          } from '@angular/core';
import { ConfirmService     } from 'src/app/shared/services/confirm.service';
import { ListadoComponent   } from 'src/app/shared/components/listados/listado.component';
import { ListadoDataSource  } from 'src/app/shared/components/listado.datasource';
import { OnInit             } from '@angular/core';
import { DeviceService      } from '../../shared/services/device.service';

@Component({
  	selector    : 'app-usuarios-listar',
  	templateUrl : './usuarios-listar.component.html',
  	styleUrls   : ['./usuarios-listar.component.scss'],
	providers   : [
		ListadoDataSource,
	],
})
export class UsuariosListarComponent extends ListadoComponent implements OnInit {

    public isMobile!              : boolean;

 	constructor(
		private apiService     : ApiService,
		private confirmService : ConfirmService,
		public  dataSource 	   : ListadoDataSource<any>,
		private deviceService  : DeviceService,
	) {
		super();
	}

  	public ngOnInit(): void {
		this.dataSource.filtros.rol_id = "";
		this.dataSource.filtros.estado = "";
		this.dataSource.filtros.dni ="";
		this.dataSource.ordenes.estado="asc";
		this.dataSource.ordenes.created_at = "desc";
		this.dataSource.uri = "/users";
        this.deviceService.observe((result: boolean) => {
            this.clearColumns();
            this.addColumn('email',         'Email',       			'270px').renderFn(row => row.email);
            this.addColumn('rol',         	'Rol',       			'150px').renderFn(row => row.rol.descripcion);
            this.addColumn('nombre',        'Nombre Y Apellido',	''     ).renderFn(this.getNombre);
            this.addColumn('razon_social',	'Razón social',       	'200px').renderFn(this.getRazonSocial);//row.onboarding.businesses.name);
            this.addColumn('estado',       	'Estado',       		'90px' ).renderFn(row => row.estado);
            this.addColumn('_acciones',    	'Acciones',      		'90px' ).setAsMenu().setAlign('right');
			/*
            if (result) {
                this.getColumn('nombre'      ).setWidth('200px');
            }*/

            this.isMobile = result;
        });
  	}

	private getNombre(row : any) : string {
		if (row.rol.id === 2) {
			if (row.onboarding_user.user_personal_data !== null){
				return row.onboarding_user.user_personal_data.first_name + " " + row.onboarding_user.user_personal_data.last_name;
			}
			return "";
		}
		return row.nombre;
	}

	private getRazonSocial(row : any) : string {
		if (row.rol.id === 2) {
			if (row.onboarding_user.business !== null) {
				return row.onboarding_user.business.name;
			}
			else{
				return "";
			}
		}
		return "-";
	}

	public habilitarUsuario(nombre : string, id : number) : void {
		this.confirmService.ask(`¿Desea habilitar al usuario ${nombre}?`).subscribe(async ()=>{
			await this.apiService.put(`/users/${id}/habilitar`,{});
			this.dataSource.refreshData();
		});
	}

	public deshabilitarUsuario(nombre : string, id : number): void {
		this.confirmService.ask(`¿Desea deshabilitar al usuario ${nombre}?`).subscribe( async ()=>{
			await this.apiService.put(`/users/${id}/deshabilitar`,{});
			this.dataSource.refreshData();
		});
	}

}
