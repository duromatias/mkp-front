import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable  } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RouteGuard implements CanActivate, CanActivateChild {

    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.check(state.url);
    }

    canActivate() {
        return this.check();
    }

    private async check(url: string | null = null) {

        if (url !== null){
            if (url.split('').filter((a)=>a==='/').length <= 1) {
                return true;
            }
        }
        console.log("url",url)
        if ([null, '/','/landing','/auth/login','/auth/tyc','/auth/register','/auth/recuperar-password','/auth/restablecer-password','/seguros/cotizar'].filter(i=>i===url).length === 1) {
            return true;
        }
        console.log('url antes del ?', url?.split('?')[0]);
        if(url?.split('?')[0]){
            if(['/auth/restablecer-password','/seguros/listar','/seguros/detalles'].includes(url?.split('?')[0])){
                return true;
            }
        }
        if(url?.startsWith('/auth/login')){
            return true;
        }
        if (url !== null && /^\/publicaciones\/\d+/.test(url)) {
            return true;
        }

        if (url === null || url.length === 0) {
            return false;
        }

        let puedeNavegar = await this.authService.puedeNavegar(url);
        console.log("puede navegar",url,puedeNavegar);
        if (puedeNavegar === true) {
            if (!this.authService.estaLogueado()) {
                this.router.navigateByUrl('/auth/login');
                window.scroll(0,0);
            }
        }
        return puedeNavegar;
    }

}
