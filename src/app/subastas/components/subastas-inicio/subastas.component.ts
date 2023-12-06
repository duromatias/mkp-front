import { ActivatedRoute                    } from '@angular/router';
import { ApiService                        } from 'src/app/shared/services/api.service';
import { Component                         } from '@angular/core';
import { FiltrosComponent                  } from '../../../publicaciones/filtros/filtros.component';
import { ListadoComponent                  } from 'src/app/publicaciones/listado/component';
import { ListadoDataSource                 } from 'src/app/shared/components/listado.datasource';
import { MatDialog                         } from '@angular/material/dialog';
import { OnInit                            } from '@angular/core';
import { OrdenarOpciones                   } from 'src/app/shared/components/layout/listado/ordenar-dialog/ordenarOpciones';
import { SubastasOnboardingDialogComponent } from 'src/app/publicaciones/banner-subastas/subastas-onboarding-dialog/subastas-onboarding-dialog';
import { SubastasSumarDialogComponent      } from 'src/app/publicaciones/banner-subastas/subastas-sumar-dialog/subastas-sumar-dialog.component';
import { UserService                       } from 'src/app/auth/services/user.service';
import { ViewChild                         } from '@angular/core';
import { DeviceService                     } from '../../../shared/services/device.service';
import * as moment from 'moment';


type Filtro = {
    valor: any,
    descripcion: string,
}

@Component({
    selector    : 'app-subastas',
    templateUrl : './subastas.component.html',
    styleUrls   : ['./subastas.component.scss']
})
export class SubastasComponent implements OnInit {

    public filtros : any = {};
    public estadoSubasta : 'Inscripcion' | 'Oferta' | '' = '';
    public fechaFinInscripcion! : string;
    public diasFinOferta!       : number;
    public urlListado           : string = '/publicaciones/*/subastas/home';
    public esAgencia            : boolean = false;
    public isMobile!            : boolean;
    public fechaDesde           : Date     = new Date();
    public fechaHasta           : Date     = new Date();
    public mostrarTipoVendedor  : boolean = false;
    public mostrarOportunidad   : boolean = false;
    public mostrarFiltros       : boolean = false;
    public mostrarFiltrosMisVehiculos: boolean = true;
    public filtroMisVehiculos   : boolean = false;
    public mostrarFiltrosSubastas  : 'none' | 'block' = 'block';
    public mostrarFiltrosAvanzados : 'none' | 'block' = 'none';
    public mostrarFiltrosMisPujas: boolean = true;
    public filtroMisPujas       : boolean = false;
    public filtroSubastaFechaDesde    : any;
    public filtroSubastaFechaHasta    : any;
    public showListado : boolean = false;

    public diasRestantes!       : number;
    public horasRestantes!      : number;
    public minutosRestantes!    : number;
    public textoTiempoRestante! : string;

    baseUrl: string = '/publicaciones';

    public monedas             : Filtro[] = [];
    public anios               : Filtro[] = [];
    public marcas              : Filtro[] = [];
    public modelos             : Filtro[] = [];

    public filtrosBaseUrl       : string  = '/publicaciones/*';

    public subastaId! : any;

    @ViewChild('listado')
    public listado!: ListadoComponent;


    @ViewChild('filtrosComponent1', {static: true})
    public filtrosComponent1!: FiltrosComponent; 

    @ViewChild('filtrosComponent2', {static: true})
    public filtrosComponent2!: FiltrosComponent; 

    public ordenarOpciones : Array<OrdenarOpciones> =[
        {
            value   : '',
            text    : 'Más recientes',
            nombre  : '',
            default : true,
        },
        {
            value   : 'DESC',
            text    : 'Mayor precio',
            nombre  : 'precio',
            default : false,
        },
        {
            value   : 'ASC',
            text    : 'Menor precio',
            nombre  : 'precio',
            default : false, 
        }
    ];


    constructor(
        private apiService    : ApiService,
        private deviceService : DeviceService,
        public  dataSource    : ListadoDataSource<any>,
        private dialog        : MatDialog,
        private route         : ActivatedRoute,
        public  userService   : UserService,

    ) {
        this.anios.push({ valor: null, descripcion: 'Todos' });

        let toYear = (new Date).getFullYear();
        for(let year=1991; year <= toYear; year++) {
            this.anios.push({
                valor: `${year}`,
                descripcion: `${year}`,
            });
        }

        this.anios.reverse();
    }

    ngOnInit(): void {
        this.checkParams()
        setTimeout(
            () => this.showListado = true,
            0
        )
        this.dataSource.uri = "/subastas";
        this.checkEstadoSubasta();
        this.deviceService.observe((result: boolean) => {
            this.isMobile = result;
        });

    }

    private checkParams() {
        this.route.queryParams.subscribe((params) => {
            if (params) {
                this.filtroSubastaFechaDesde = params.fechaSubasta;
                this.filtroSubastaFechaHasta = params.fechaSubasta;
                this.fixFiltrosSubasta();
            }

        });
    }

    private async checkEstadoSubasta() : Promise<void> {
        let subasta = await this.apiService.getData(`/subastas/*/disponible`);
        if(subasta.puede_inscribir){
            this.subastaId = subasta.id;
            this.fechaFinInscripcion = (subasta.fecha_fin_inscripcion as String).split('-').reverse().join('/');
            this.estadoSubasta = 'Inscripcion';
            return;
        }

        if(subasta.puede_ofertar){
            this.estadoSubasta = 'Oferta'
            let fechaHoy = new Date();
            let fechaFin = new Date(subasta.fecha_fin_ofertas);
            fechaFin.setDate(fechaFin.getDate()+1);
            fechaFin.setHours(fechaFin.getHours()+3);
            let diasRestantes = (fechaFin.getTime() - fechaHoy.getTime())/(1000*60*60*24);
            this.diasRestantes = Math.ceil(diasRestantes)-1; 
            this.setTextoTiempoRestante(fechaHoy, fechaFin);  
            return;
        }
    }

    public setTextoTiempoRestante(fechaHoy : Date, fechaFin : Date) : void {
        let diasRestantes = ` ${this.diasRestantes} días`;  
        let horasRestantes = 24 - fechaHoy.getHours();
        let minutosRestantes = 60 -fechaHoy.getMinutes(); 
        
        if(this.diasRestantes <= 1 && !(horasRestantes === 24 && minutosRestantes === 60) ){
            if(minutosRestantes === 60){
                horasRestantes = horasRestantes + 1;
                minutosRestantes = 0;
            }
            if(minutosRestantes !== 60 && horasRestantes !== 0){
                horasRestantes = horasRestantes -1;
            }
            let textoHoras = `, ${horasRestantes} horas`;
            let textoMinutos = `, ${minutosRestantes} min`;
            if(horasRestantes === 1){
                textoHoras = textoHoras.replace('s','');
                
            }
            if(horasRestantes === 0){
                textoHoras = '';
                textoMinutos = textoMinutos.replace(',','');
            }
            else{
                if(minutosRestantes === 0){
                    textoMinutos='';
                }
            }
            if(minutosRestantes === 1){
                textoMinutos = textoMinutos.replace('s','');
            }
            
            this.textoTiempoRestante = diasRestantes.replace('s','') + textoHoras + textoMinutos;
            if(this.diasRestantes === 0){
                textoHoras = textoHoras.replace(',','');
                this.textoTiempoRestante = textoHoras + textoMinutos;
            }
            this.horasRestantes = horasRestantes;
            this.minutosRestantes = minutosRestantes;
            
            this.textoTiempoRestante = this.textoTiempoRestante;
            return;
        }
        else{
            if (this.diasRestantes <= 1){
                this.diasRestantes = this.diasRestantes +1;
            }
            diasRestantes = ` ${this.diasRestantes} día`;
            if(this.diasRestantes === 1){
                diasRestantes = ` ${this.diasRestantes} día`;
            }
            else{
                diasRestantes = ` ${this.diasRestantes} días`;
            }
        }
        
        this.textoTiempoRestante =  diasRestantes ;

    }

    public clickSubastar() : void {
        if(this.userService.esAgenciaReady()){
            this.dialog.open(SubastasSumarDialogComponent,  {
                disableClose : false,
                autoFocus    : true,
                id           : this.subastaId,
            });
        }
        else{
            this.dialog.open(SubastasOnboardingDialogComponent,  {
                disableClose : false,
                autoFocus    : true,
            });
        }
    }

    public onFetchData(data: any) {
        Object.assign(this.filtrosComponent1, data.filtrosDisponibles);
        Object.assign(this.filtrosComponent2, data.filtrosDisponibles);
    }

    public onCardClick(id: any) {
        //this.router.navigateByUrl('/publicaciones/' + id);
    }

    public clickTab(event : any) : void {
        let tab : string = event.tab.textLabel;
        this.limpiarFiltros();
        if(tab === 'Subasta' ){
            this.listado.url = '/publicaciones/*/subastas/home';
            this.filtroMisVehiculos = false;
            this.filtroMisPujas = false;
            this.mostrarFiltrosSubastas = 'block';
        }
        if(tab === 'Mis vehículos' ){
            this.listado.url = '/publicaciones/*/subastas/mis-publicaciones';
            this.filtroMisVehiculos = true;
            this.filtroMisPujas = false;
            this.mostrarFiltrosSubastas = 'none';
        }
        if(tab === 'Mis pujas' ){
            this.listado.url = '/publicaciones/*/subastas/mis-pujas';
            this.filtroMisVehiculos = false;
            this.filtroMisPujas = true;
            this.mostrarFiltrosSubastas = 'none';
        }
        if(tab === 'Me interesa' ){
            this.listado.url = '/publicaciones/*/subastas/mis-favoritos';
            this.filtroMisVehiculos = false;
            this.filtroMisPujas = false;
            this.mostrarFiltrosSubastas = 'block';
        }
        this.listado.setInitPage();
        this.actualizarListado();
    }

    public limpiarFiltros(){
        this.filtroSubastaFechaDesde = null;
        this.filtroSubastaFechaHasta = null;
        for(let key in this.filtros) {
            if (this.filtros[key] && key !== 'business_name' && key !== 'busqueda_marca_modelo') {
                delete this.filtros[key];
            }
        }
    }

    public onClearFilters() : void {
        this.limpiarFiltros();
        this.actualizarListado();
    }

    public async actualizarListado() {
        this.fixFiltrosSubasta();
        this.listado.filtros = this.filtros;
        this.listado.actualizarListado();
        this.configurarFiltros();
    }

    private fixFiltrosSubasta() : void {
        if(this.filtroSubastaFechaDesde){
            let fechaDesde = moment(this.filtroSubastaFechaDesde).format('YYYY-MM-DD');
            this.filtros.subasta_fecha_fin_ofertas_desde = fechaDesde;
        }
        if(this.filtroSubastaFechaHasta){
            let fechaHasta = moment(this.filtroSubastaFechaHasta).format('YYYY-MM-DD');
            this.filtros.subasta_fecha_fin_ofertas_hasta = fechaHasta;
        }
    }

    private checkRol() : void {
        if (this.userService.getUser()?.rol_id === 2 || this.userService.getUser()?.rol_id === 1 ) {
            this.mostrarTipoVendedor = true;
            this.mostrarOportunidad = true;
            if(this.userService.getUser()?.rol_id === 2){
                this.esAgencia = true;
            }
        }
    }

    public visualizarFiltrosAvanzados(){
        this.mostrarFiltros = !this.mostrarFiltros;
        if(this.mostrarFiltrosAvanzados === 'block'){
            this.mostrarFiltrosAvanzados = 'none';
        }
        else{
            this.mostrarFiltrosAvanzados = 'block';
        }
    }

    public visualizarFiltrosMisVehiculos(){
        this.mostrarFiltrosMisVehiculos = !this.mostrarFiltrosMisVehiculos;
    }

    public visualizarFiltrosMisPujas(){
        this.mostrarFiltrosMisPujas = !this.mostrarFiltrosMisPujas;
    }

    public configurarFiltros() {
        if (this.filtros.subasta_fecha_fin_ofertas_desde) {
            this.fechaDesde = this.filtros.subasta_fecha_fin_ofertas_desde ;
        }

        if (this.filtros.subasta_fecha_fin_ofertas_hasta) {
            this.fechaHasta = this.filtros.subasta_fecha_fin_ofertas_hasta ;
        }
    }

    public buscar(event : any) : void {
        this.filtros['busqueda_marca_modelo']=event;
        this.actualizarListado();
    }

}
