import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'publicaciones-wp-button',
    templateUrl: './wp-button.component.html',
    styleUrls: ['./wp-button.component.scss']
})
export class WpButtonComponent implements OnInit {

    @Input()
    public publicacion!: any;
    public link: string = '';

    constructor() { }

    ngOnInit(): void {

        let nombreVendedor = this.publicacion.nombreVendedor;
        let vehiculo       = [this.publicacion.marca, this.publicacion.modelo, this.publicacion.año].join(' ');
        let link           = window.location;
        let telefono       = this.publicacion.telefonoContacto.replace(/\s/g, '');
        let mensaje        = encodeURIComponent(`Hola ${nombreVendedor} te contacto por la publicación del ${vehiculo} en: ${link}`);

        this.link = `https://wa.me/${telefono}?text=${mensaje}`;
    }

}
