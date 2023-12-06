import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private user                : any;
    private accesos             : any;
    private parametros          : any = {};
    private consultasPendientes : any;
    public readonly stateChanged: EventEmitter<any> = new EventEmitter();

    public setAccessToken(value: string) : void {
        localStorage.setItem('accessToken', value);
    }

    public setOnBoardingAccessToken(value: string) : void {
        localStorage.setItem('onBoardingAccessToken', value);
    }

    public removeSessionData() : void {
        localStorage.removeItem('accessToken');
    }

    public setState(user: any, accesos: any, parametros: [], consultas_pendientes: any) : void {
        this.user       = user;
        this.accesos    = accesos;
        this.parametros = parametros;
        this.consultasPendientes = consultas_pendientes;
        this.stateChanged.emit();
    }

    public getAccessToken() : string | null {
        return localStorage.getItem('accessToken');
    }

    public getOnBoardingAccessToken() : string | null {
        return localStorage.getItem('onBoardingAccessToken');
    }

    public getUser(): any {
        return this.user;
    }

    public getAccesos(): any[] {
        return this.accesos;
    }

    public getParametros(): any {
        return this.parametros;
    }

    public getConsultasPendientes(): any{
        return this.consultasPendientes;
    }

    public esAdministrador(): boolean {
        return (this.user?.rol_id) === 1;
    }

    public esAgencia(): boolean {
        return (this.user?.rol_id) === 2;
    }

    public esAgenciaReady(): boolean {
        if(this.user?.onboarding_user?.business.ready_at){
            return true;
        }
        return false;
    }

    // Estos 3 métodos deberían estar en una clase User
    // pero sólo tenemos una intefaz...
    public getNombreUsuario() {
        if (this.user?.rol_id == 2) {
            if (!this.user.onboarding_user?.user_personal_data) {
                return undefined;
            }
            return `${this.user.onboarding_user?.user_personal_data?.first_name} ${this.user.onboarding_user?.user_personal_data?.last_name}`;
        } else {
            return this.user?.nombre;
        }
    }

    public getRazonSocial() {
        if (this.user?.rol_id !== 2) {
            return;
        }
        return this.user?.onboarding_user?.business?.name;
    }

    public getEmail() {
        return this.user?.email;
    }
    // fin de los 3 métodos.

}