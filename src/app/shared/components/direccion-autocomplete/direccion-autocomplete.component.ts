import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ServerAutocompleteFieldComponent } from '../autocomplete/server-autocomplete-field.component';
import { v4 as uuidv4 } from 'uuid';

export type DetalleUbicacion = {
    placeId?       : string;
    direccion      : string;
    codigo_postal? : string;
    calle?         : string;
    numero         : number;
    localidad      : string;
    departamento   : string;
    provincia      : string;
    latitud        : number;
    longitud       : number;
};

@Component({
  selector: 'app-direccion-autocomplete',
  templateUrl: './direccion-autocomplete.component.html',
  styleUrls: ['./direccion-autocomplete.component.scss']
})
export class DireccionAutocompleteComponent implements OnInit {

    @Input()  public label            : string  = '';
    @Input()  public error            : string  = '';
    @Input()  public required         : boolean = false;
    @Input()  public data             : any[]   = [];
    @Input()  public value            : string  = '';
    @Output() public focus            : EventEmitter<any>              = new EventEmitter<any>();
    @Output() public ubicacionElegida : EventEmitter<DetalleUbicacion> = new EventEmitter<DetalleUbicacion>();

    @ViewChild('autocomplete')
    private autocomplete!: ServerAutocompleteFieldComponent;

    public sessionToken: string  = uuidv4();

    constructor(
        private apiService: ApiService,
    ) { }

    public ngOnInit(): void {
    }

    public async alElegirUbicacion() {
        if (!this.autocomplete.value) {
            return;
        }
        
        let place = await this.apiService.getData(`/google/places/obtenerDetalles/${this.autocomplete.value}`);
        if(place?.localidad.length === 0){
            this.error = 'Ingrese una localidad y provincia';
            return;
        }

        this.ubicacionElegida.emit(place);
    }

    public onFocus() {
        this.focus.emit();
    }

}
