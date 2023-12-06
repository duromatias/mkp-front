import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[app-input-numeric]'
})
export class InputNumericDirective {

    constructor(
        private element: ElementRef
    ) {  }

    @HostListener('keypress', ['$event'])
    public onKeypress(event: any): boolean {

        // Bug en el teclado numérico de Chrome en Android
        if (event.key === 'Unidentified') {
            return true;
        }

        // Prevenimos la inserción de cualquier tecla que no sea un número
        return /\d/.test(event.key);
    }

    @HostListener('ngModelChange')
    public onChange() {
        let el = this.element.nativeElement;
        el.value = this.formatValue(el.value);
        //event.target.value = this.formatValue(event.target.value);
    }

    @HostListener('keyup', ['$event'])
    public onKeyup(event: any) {

        // Si no tiene caracteres numéricos no hacemos nada
        // No se incluye la , porque si hay una "," ya no hay
        // que trabajar decimales.
        if (!/^(\d)([0-9\.]*)(\d)$/.test(event.target.value)) {
            return;
        }

        // Se transforma en array
        // Se invierte, y se agrega un punto cada 3 dígitos
        // Se vuelve a invertir y se une.
        let value = this.formatValue(event.target.value);

        event.target.value = value;

        return true;
    }

    private formatValue(value: any) {
        return `${value}`.replace(/\./g, '').split('').reverse().map((d, i) => {
            return (i) % 3 === 0 && i>1 ? d + '.' : d;
        }).reverse().join('');
    }

}
