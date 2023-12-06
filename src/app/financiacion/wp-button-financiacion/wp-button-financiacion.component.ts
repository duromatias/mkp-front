import { Component } from '@angular/core';
import { Input     } from '@angular/core';
import { OnInit    } from '@angular/core';

@Component({
    selector    : 'app-wp-button-financiacion',
    templateUrl : './wp-button-financiacion.component.html',
    styleUrls   : ['./wp-button-financiacion.component.scss']
})
export class WpButtonFinanciacionComponent implements OnInit {

    @Input()
    public textButton : string = '';

    @Input()
    public colorButton : string = '';


    @Input()
    public telefono!: any;
    
    public link: string = '';

    constructor() { }

    ngOnInit(): void {

        /*let nombreVendedor = this.publicacion.nombreVendedor;
        let vehiculo       = [this.publicacion.marca, this.publicacion.modelo, this.publicacion.año].join(' ');
        let link           = window.location;
        let telefono       = this.publicacion.telefonoContacto.replace(/\s/g, '');
        let mensaje        = encodeURIComponent(`Hola ${nombreVendedor} te contacto por la publicación del ${vehiculo} en: ${link}`);
        */
       console.log(this.telefono);
        this.link =`https://wa.me/${this.telefono}`;
    }

}
