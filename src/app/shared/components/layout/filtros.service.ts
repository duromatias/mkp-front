import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject    } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FiltrosService {

    private limpiarBusqueda$ = new Subject<any>();

    private textoBusqueda$   = new Subject<any>();

    public textoBusqueda : string = '';

    public limpiarBusqueda() : void {
        this.limpiarBusqueda$.next();
    }

    public getLimpiarBusqueda$() : Observable<any> {
        return this.limpiarBusqueda$.asObservable();
    }

    public setTextoBusqueda(text : string) : void {
        this.textoBusqueda$.next(text);
    }

    public getTextoBusqueda() : Observable<any> {
        return this.textoBusqueda$.asObservable();
    }

}
