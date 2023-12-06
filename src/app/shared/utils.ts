import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class Utils {
    constructor() {       
    }

    /**
     * Recibe un número y devuelve el mismo en un string con el formato de puntos cada 3 cifras.
     * 
     * @param num Número en string (Sin puntos ni comas).
     */
     public formatNumero (num : string) : string {
        let arrayNumero = num.split("."); 
        let arrayParteEntera = arrayNumero[0].split("").reverse();
        let string : string = '';
        for (let index = 0; index < arrayParteEntera.length; index++) {
            const element = arrayParteEntera[index];
            if((index+1)%3 === 0){
                string = string + element +'.';
            }
            else{
                string = string + element;
            }    
        }
        arrayParteEntera = string.split('').reverse();
        arrayParteEntera[0] === '.' ? arrayParteEntera.shift() : '';
        string = '';
        arrayParteEntera.forEach(element => {
            string = string + element;
        });
        if(arrayNumero.length > 1){
            let parteDecimal;
            if(arrayNumero[1].length>2){
                parteDecimal = arrayNumero[1][0] + arrayNumero[1][1];
            }
            else{
                parteDecimal = arrayNumero[1];
            }
            string = string + ',' + parteDecimal;
        }
        return string;   
    }

    public quitarPuntos(s : string) : string {
        let array = s.split('.');
        s = '';
        array.forEach(element => {
            s = s + element
        });
        return s;
    }

    /**
     * Recibe una fecha en formato YYYY-MM-DD y la devuelve como DD/MM/YYYY.
     *
     * @param fecha fecha en formato YYYY-MM-DD.
     */
    public formatFecha(fecha : string) : string {
        let arrayFecha = fecha.split('-');
        arrayFecha.reverse();
        let dia = arrayFecha[0];
        let mes = arrayFecha[1];
        let anio = arrayFecha[2];
        let fechaFormateada : string = dia + '/' + mes + '/' + anio;
        return fechaFormateada;
    }

    /**
     * Recibe una texto que comience o no con + y lo devuelve eliminadolo si existe.
     *
     * @param texto string que comienza o no con +.
     */
     public quitarSignoMas(texto : string) : string {
        let arrayTexto = texto.split('');
        if(arrayTexto[0] === '+'){
            arrayTexto.shift()
        }
        let numeroSinSignoMas : string = '';
        arrayTexto.forEach(element => {
            numeroSinSignoMas = numeroSinSignoMas + element;
        });
        return numeroSinSignoMas;
    }

    /**
     *  Recibe una texto separado por guiones bajos ("_") y convierte las primeras letras de cada palabra en mayúsculas.
     *  Ejemplo de texto: "palabra1_palabra2" => Palabra1 Palabra2
     * @param texto Texto a formatear
     */
    public formatearTextoConGuionesYMinusculas(texto : string ): string {
        let arrayTexto = texto.split('_');
        for (let index = 0; index < arrayTexto.length; index++) {
            arrayTexto[index] = arrayTexto[index][0].toUpperCase() + arrayTexto[index].substring(1);
        }
        let textoFormateado = '';
        arrayTexto.forEach(element => {
            textoFormateado = textoFormateado + ' ' + element;
        });
        return textoFormateado;
    }
}