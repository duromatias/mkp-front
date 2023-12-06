import * as moment from 'moment';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/auth/services/user.service';
import { FormBaseComponent } from 'src/app/shared/components/form-base.component';
import { Utils } from 'src/app/shared/utils';

@Component({
    selector: 'app-publicacion-subasta-terminada',
    templateUrl: './publicacion-subasta-terminada.component.html',
    styleUrls: ['./publicacion-subasta-terminada.component.scss']
})
export class PublicacionSubastaTerminadaComponent extends FormBaseComponent implements OnInit {

    @Input()
    public publicacion                      : any;
    
    public mostrarCalificar                 : boolean = false;
    public mostrarCalificarComprador        : boolean = false;
    public mostrarVentaRealizada            : boolean = false;
    public mostrarOfertaGanadora            : boolean = false;
    public mostrarObservaciones             : boolean = false;
    public mostrarPublicacionSinOfertas     : boolean = false;
    public mostrarOfertaSuperada            : boolean = false;
    public esComprador                      : boolean = false;
    public esGanador                        : boolean = false;
    public esAgencia                        : boolean = false;
    public puntosPosibles                   : number[] = [1,2,3,4,5];
    public puntuacion                       : number = 0;
    public publicacionId                    : any;
    public simboloMoneda                    : any;
    public todayDate                        : any;
    public telefono                         : any;
    public linkWsp                          : any;
    public precio                           : any;

    constructor(
        private userService : UserService,
        public  utils       : Utils,
    ) {
        super()
    }

    public get dataUrl() {
        return ``;
    }

    ngOnInit(): void {
        this.obtenerFechaHoy();
        this.setForm();
        this.form.setValue({
            observaciones:'',
        });

        try {
            this.publicacionId = Number(this.publicacion.id);
            this.precio        = this.utils.formatNumero(`${this.publicacion.precio}`);
            this.verificarRol();
            this.parsearTelefono();
            //If para mostrar la informacion final de subasta

            // Subasta terminada?
            if (this.publicacion.subasta.fecha_fin_ofertas < this.todayDate) {

                if(this.esComprador === true) {
                    if (this.esGanador === true) {
                        if(this.publicacion.compra_realizada === null) {
                            this.mostrarCalificarComprador = true;
                        }
                    } else {
                        this.mostrarCalificar = false;
                        this.mostrarCalificarComprador = false;
                        this.mostrarOfertaSuperada = true;
                    }

                }
                if(this.esAgencia === true){
                    if(this.publicacion.ofertas_ultima_oferta === null && this.publicacion.venta_realizada === null) {
                        this.mostrarPublicacionSinOfertas = true;
                    } else {
                        if(this.publicacion.venta_realizada === null) {
                            this.mostrarCalificarComprador = true;
                        }
                    }
                }
            }
            this.verificarSimboloPrecio();
        }
        catch(e:any){
            throw e
        };
        this.verificarRol();

    }

    public setForm(){
        this.form = new FormGroup({
            observaciones  : new FormControl(''),
        });
    }

    public verificarRol(){
        let user = this.userService.getUser();
        if(this.publicacion.usuario_id === user.id){
            this.esAgencia = true;
            return;
        }
        if(this.publicacion.ofertas_ultima_oferta != null){
            if(this.publicacion.ofertas_ultima_oferta_propia !== null) {
                this.esComprador = true;
                if(this.publicacion.ofertas_ultima_oferta.usuario_id === user.id) {
                    this.esGanador = true;
                }
            }
        }
    }

    public verificarSimboloPrecio() {
        if(this.publicacion.moneda === 'Pesos'){
            this.simboloMoneda = '$'
        }else{
            this.simboloMoneda = 'U$S'
        }
    }

    public activarVentaRealizada(){
        this.mostrarVentaRealizada = true;
        this.mostrarCalificar = false;
        this.mostrarCalificarComprador = false;
    }

    public async activarOfertaGanadora(){
        await this.apiService.post('/subastas/finalizada/resultadooperacion/operacion-realizada',{
            publicacion_id : this.publicacionId,
            resultado: 1
        });
        this.mostrarOfertaGanadora = true;
        this.mostrarVentaRealizada = false;
    }

    public async activarObservaciones(){
        await this.apiService.post('/subastas/finalizada/resultadooperacion/calificacion',{
            publicacion_id : this.publicacionId,
            calificacion: this.puntuacion
        });
        this.mostrarObservaciones = true;
        this.mostrarOfertaGanadora = false;
    }

    public async enviarObservaciones(){
        await this.apiService.post('/subastas/finalizada/resultadooperacion/observaciones',{
            publicacion_id : this.publicacionId,
            observaciones: this.form.value.observaciones
        });
        this.mostrarObservaciones = false;
    }

    public cerrarModal(){
        this.mostrarCalificar              = false;
        this.mostrarCalificarComprador     = false;
        this.mostrarVentaRealizada         = false;
        this.mostrarOfertaGanadora         = false;
        this.mostrarObservaciones          = false;
        this.mostrarPublicacionSinOfertas  = false;
        this.mostrarOfertaSuperada         = false;
    }

    public async cerrarPublicacion(){
        if(this.mostrarPublicacionSinOfertas === true){
            await this.apiService.post('/subastas/finalizada/resultadooperacion/operacion-realizada',{
                publicacion_id : this.publicacionId,
                resultado: 0
            });
        }
        console.log("se mando");
        this.cerrarModal();
    }

    public async cambiarPuntuacion(puntos: number){
        this.puntuacion = puntos;
    }

    private obtenerFechaHoy(){
        this.todayDate = moment().add(0,"day").format("YYYY-MM-DD");
    }

    public parsearTelefono(){
        if(this.esAgencia){
            this.telefono = this.publicacion.telefonoContacto.replace(/\s/g, '');
        }
        if(this.esComprador){
            this.telefono = this.publicacion.ofertas_ultima_oferta.usuario.telefonoContacto.replace(/\s/g, '');
        }
        this.linkWsp = `https://wa.me/${this.telefono}?`;
    }

}
