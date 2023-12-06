import { ApiService         } from 'src/app/shared/services/api.service';
import { DeviceService      } from 'src/app/shared/services/device.service';
import { Component          } from '@angular/core';
import { FormControl        } from '@angular/forms';
import { FormGroup          } from '@angular/forms';
import { OnInit             } from '@angular/core';
import { Router             } from '@angular/router';
import { UserService        } from 'src/app/auth/services/user.service';
import { Utils              } from 'src/app/shared/utils';

@Component({
    selector    : 'app-landing',
    templateUrl : './landing.component.html',
    styleUrls   : ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

    public user!            : any; //usuario
    public form!            : FormGroup; //formulario de buscar por marca y modelo
    public isMobile!        : boolean; //checkear si se contrae la pantalla
    public publicaciones    : any = []; //array de publicaciones
    public subastas         : any = []; //array de subastadas (si es user no es agencia toma publicaciones)
    public haySubasta       : boolean = false; //checkear si hay subasta activa

    constructor(
        private apiService         : ApiService,
        public  deviceService      : DeviceService,
        private router             : Router,
        private userService        : UserService,
        private utils              : Utils,
        ) { }

    async ngOnInit(): Promise<void> {
        this.user = this.userService.getUser(); 
        this.setForm();

        //llamada para establecer el punto de quiebre de la pantalla
        this.deviceService.observe((result:boolean) => {
            this.isMobile = result;
        });

        await this.fetchPublicacionesSubastas();
    }

    //método que setea el form de buscar por marca y modelo de la seccion 1
    public setForm() : void {
        this.form = new FormGroup({
            marcaModelo : new FormControl(),
        });
    }

    //método que setea el filtro según lo ingresado en el form y redirige al home actual con dicho valor
    public search(){
        let value = this.form.value['marcaModelo'];
        this.router.navigateByUrl('/publicaciones' + ((value) ? '?search=' + value : ''));
    }

    //método que busca en la API las ultimas publicaciones y subastas
    public async fetchPublicacionesSubastas(){
        let data = await this.apiService.getData('/publicaciones', {
            page: 1,
            limit: 8,
            filtros: {
                "sin_subasta" : true,
            }
        });

        this.publicaciones = this.mapData(data.listado.splice(0, 4)); // sustraemos los 4 primeros registros
        this.subastas      = this.mapData(data.listado); // el array queda modificado, con los datos restantes

        if (this.user?.rol_id === 2) {
            if (await this.haySubastaDisponible()) {
                this.haySubasta = true;
                let subastas = await this.apiService.getData('/publicaciones/*/subastas/home', {
                    page: 1,
                    limit: 4,
                });
                this.subastas = this.mapData(subastas.listado);
            }
        }
    }

    //método que mapea la response de /publicaciones a array de publicaciones
    public mapData(data: any){
        let map = (data as any[]).map((item : any) => {
            item.anio           = item.año;
            item.ubicacion      = item.localidad + ', ' + item.provincia;
            item.precio         = this.utils.formatNumero(item.precio.toString());
            item.multimedia     = item.multimedia.filter((element : any) => element.tipo === "image");
            item.kilometros     = item.kilometros ? this.utils.formatNumero(item.kilometros.toString()) : item.kilometros;
            item.marca          = item.marca;
            item.modelo         = item.modelo;
            return item;
        });

        return map;
    }

    //método que checkea si hay alguna subasta en recepción de ofertas actualmente
    public async haySubastaDisponible() {

        let response = await this.apiService.getData('/subastas/*/disponible', {}); 
        if (response === []) {
            return false;
        } else {
            return response.puede_ofertar === true;
        }
    }

}