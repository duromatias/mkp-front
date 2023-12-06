import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    public closeAll: EventEmitter<void> = new EventEmitter<void>();
}