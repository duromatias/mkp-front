import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';


export type PlaceDetalle = {
    provincia: string;
    departamento: string;
    localidad: string;
    direccion: string;
    codigo_postal: string;
    latitud: number;
    longitud: number;
    nombre: string;
}


@Injectable({
    providedIn: 'root'
})
export class GooglePlacesService {
    private uuidv4 = uuidv4();

    constructor(
        private http: HttpClient
    ) { }

    getPlaces(direccion: string) {
        const url = `${environment.apiEndpoint}/google/places/buscar`;

        return this.http.get<{ description: string, place_id: string }[]>(url, {
            params: {
                text: direccion,
                sessionToken: this.uuidv4
            }
        });
    }

    getDetalles(place_id: string) {
        const url = `${environment.apiEndpoint}/google/places/obtenerDetalles/${place_id}`;

        return this.http.get<PlaceDetalle>(url, {
            params: {
                sessionToken: this.uuidv4
            }
        });
    }
}
