import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import {UserService} from "../../auth/services/user.service"

@Injectable()
export class BearerTokenInterceptor implements HttpInterceptor {
    
    constructor(private userService: UserService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this.userService.getAccessToken();
        if (accessToken !== undefined) {
            const authReq = req.clone({
                setHeaders: { Authorization: 'Bearer ' + accessToken }
            });
    
            return next.handle(authReq);
        }

        return next.handle(req);
    }
}