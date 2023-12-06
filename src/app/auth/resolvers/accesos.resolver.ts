import { Injectable  } from '@angular/core';
import { Resolve     } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AccesosResolver implements Resolve<Promise<Object>> {
    
    constructor(
        private authService: AuthService
    ) { }

    public resolve(): Promise<Object> {
        return this.authService.getCurrentUser();
    }
}
