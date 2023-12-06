import { ApiService                        } from 'src/app/shared/services/api.service';
import { Component                         } from '@angular/core';
import { OnInit                            } from '@angular/core';
import { MatDialog                         } from '@angular/material/dialog';
import { SubastasSumarDialogComponent      } from './subastas-sumar-dialog/subastas-sumar-dialog.component';
import { SubastasOnboardingDialogComponent } from './subastas-onboarding-dialog/subastas-onboarding-dialog';
import { UserService                       } from 'src/app/auth/services/user.service';

@Component({
    selector    : 'app-banner-subastas',
    templateUrl : './banner-subastas.component.html',
    styleUrls   : ['./banner-subastas.component.scss']
})
export class BannerSubastasComponent implements OnInit {

    public diasRestantes!       : number;
    public mostrarBanner        : boolean = false;
    public tipoSubasta!         : 'Oferta' | 'Inscripción';
    public subasta              : any;
    public horasRestantes!      : number;
    public minutosRestantes!    : number;
    public textoTiempoRestante! : string;

    constructor(
        private apiService  : ApiService,
        private dialog      : MatDialog,
        private userService : UserService,

    ) { }

    async ngOnInit(): Promise<void> {
        this.checkSubastas();
    }

    private async checkSubastas() : Promise<void> {
        this.subasta = await this.apiService.getData(`/subastas/*/disponible`);
        let fechaHoy = new Date();
        if(!Array.isArray(this.subasta)){
            if (this.subasta.puede_inscribir) {
                this.tipoSubasta = 'Inscripción';
                let fechaFin = new Date(this.subasta.fecha_fin_inscripcion);
                fechaFin.setDate(fechaFin.getDate()+1);
                fechaFin.setHours(fechaFin.getHours()+3);
                let diasRestantes = (fechaFin.getTime() - fechaHoy.getTime()) / (1000 * 60 * 60 * 24);
                this.diasRestantes = Math.ceil(diasRestantes)-1;
                this.setTextoTiempoRestante(fechaHoy,'Queda',' para sumar vehículos a la subasta en curso!');
            }
            if(this.subasta.puede_ofertar){
                this.tipoSubasta = 'Oferta';
                let fechaFin = new Date(this.subasta.fecha_fin_ofertas);
                fechaFin.setDate(fechaFin.getDate()+1);
                fechaFin.setHours(fechaFin.getHours()+3);
                let diasRestantes = (fechaFin.getTime() - fechaHoy.getTime())/(1000*60*60*24);
                this.diasRestantes = Math.ceil(diasRestantes)-1;
                this.setTextoTiempoRestante(fechaHoy, '¡Pronto cierra la subasta! Queda',' para ofertar.');
            }
            this.mostrarBanner = true;
        }

    }

    public sumarVehiculo() : void {
        if(this.userService.esAgenciaReady()){
            this.dialog.open(SubastasSumarDialogComponent,  {
                autoFocus    : true,
                disableClose : false,
                id           : this.subasta.id,
            });
        }
        else{
            this.dialog.open(SubastasOnboardingDialogComponent,  {
                disableClose : false,
                autoFocus    : true,
            });
        }

    }

    public setTextoTiempoRestante(fechaHoy : Date, comienzoTexto : string, finTexto : string) : void {
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
            if(this.diasRestantes > 1 || (this.diasRestantes === 0 && this.horasRestantes > 1) || (this.diasRestantes === 0 && this.horasRestantes === 0 && this.minutosRestantes > 1)){
                comienzoTexto = comienzoTexto + 'n';
            }
            this.textoTiempoRestante = comienzoTexto + this.textoTiempoRestante + finTexto;
            return;
        }
        else{
            if (this.diasRestantes <= 1){
                console.log('entro',this.diasRestantes + 1);
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
        if(this.diasRestantes > 1){
            comienzoTexto = comienzoTexto + 'n';
        }
        this.textoTiempoRestante = comienzoTexto + diasRestantes + finTexto;

    }

}
