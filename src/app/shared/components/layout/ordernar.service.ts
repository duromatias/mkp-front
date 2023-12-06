import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject    } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrdenarService {
    
    private ordenarIndex$   = new Subject<any>();

    public setOrdenarIndex(index : number) : void {
        this.ordenarIndex$.next(index);
    }

    public getOrdenarIndex() : Observable<any> {
        return this.ordenarIndex$.asObservable();
    }

}
