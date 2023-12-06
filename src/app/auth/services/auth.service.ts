import { AccesoInterface  } from '../models/acceso.model';
import { ApiService       } from 'src/app/shared/services/api.service';
import { environment      } from 'src/environments/environment';
import { HttpClient       } from '@angular/common/http';
import { Injectable       } from '@angular/core';
import { RolInterface     } from 'src/app/usuarios/models/rol.model';
import { UserService      } from './user.service';
import { UsuarioInterface } from 'src/app/usuarios/models/user.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _accessToken: string | null = null;

    constructor (
        private apiService  : ApiService,
        private http        : HttpClient,
        private router      : Router,
        private userService : UserService,
    ) { }

    get currentUser(): UsuarioInterface | null {
        return this.userService.getUser();
    }

    get accesos(): AccesoInterface[] {
        return this.userService.getAccesos();
    }

    get accessToken() {
        if (!this._accessToken) {
            this._accessToken = window.localStorage.getItem('access_token');
        }

        return this._accessToken;
    }

    public async getCurrentUser(): Promise<any> {
        const url = `${environment.apiEndpoint}/auth/me`;

        let response = await this.http.get<any>(url).toPromise();

        this.userService.setState(response['user'], response['accesos'], response['parametros'],response['consultas_pendientes']);

        return response;
    }

    public async getRoles() {
        const url = `${environment.apiEndpoint}/auth/roles`;

        return (await this.http.get<{ data: RolInterface[] }>(url).toPromise()).data;
    }


    registrarUsuarioParticular(formData: any) {
        const url = `${environment.apiEndpoint}/auth/registrar/particular`;

        return this.http.post<UsuarioInterface>(url, formData);
    }

    registrarUsuarioAgencia(formData: any) {
        const url = `${environment.apiEndpoint}/auth/registrar/agencia`;

        return this.http.post<UsuarioInterface>(url, formData);
    }

    public async login(email:string,password:string) : Promise<void> {
        const response = await this.apiService.post("/auth/login",{
            email    : email,
            password : password
        });

        this.userService.setAccessToken(response.access_token);
        this.userService.setOnBoardingAccessToken(response.onboarding_access_token);

        await this.getCurrentUser();
    }

    public async logout() : Promise<any> {
        await this.apiService.post("/auth/logout",{});
        if(this.router.url === '/') window.location.reload();
        await this.getCurrentUser();
    } 

    public async puedeNavegar(uri: string): Promise<boolean> {
        let accesos = await this.fetchAccesos();
        return accesos.filter((row: any) => uri.startsWith(row.ruta)).length > 0;
    }

    public async fetchAccesos(): Promise<any> {
        let accesos = this.userService.getAccesos();
        
        if (accesos) {
            return accesos;
        }
        await this.getCurrentUser();
        return this.userService.getAccesos();
    }

    public estaLogueado() : boolean {
        return this.currentUser !== null;
    }

}
