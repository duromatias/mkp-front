import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class LoggedInGuard implements CanActivateChild {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivateChild() {
        const accessToken = this.authService.accessToken;

        if (!accessToken) {
            this.router.navigate(['/login']);
            window.scroll(0,0);   
        }

        return true;
    }

}
