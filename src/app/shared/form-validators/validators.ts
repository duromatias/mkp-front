import { AbstractControl } from "@angular/forms";

export function matchingFields(matchingControl: AbstractControl, errorProperyName: string, errorMessage: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.value !== matchingControl.value) {
            return {
                [errorProperyName]: errorMessage
            };
        }

        return null;
    }
}

export function matchingEqualFields(matchingControl: AbstractControl, errorProperyName: string, errorMessage: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.value === matchingControl.value) {
            return {
                [errorProperyName]: errorMessage
            };
        }

        return null;
    }
}

export function emailValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(control.value)) {
            return {
                email: 'Email inválido'
            };
        }

        return null;
    }
}


export function minLength(minLength: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.value.length < minLength) {
            return {
                minLength: `Al menos ${minLength} caracteres`
            }
        }

        return null;
    }
}

export function maxLength(maxLength: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.value.length > maxLength) {
            return {
                minLength: `Máximo ${maxLength} caracteres`
            }
        }

        return null;
    }
}

export function cuitFormat() {
    return (control: AbstractControl): { [key: string]: any } | null => {
        let cuitRegex = /^(20|23|24|25|26|27|30|33|34)[0-9]{9}$/;

        if (!cuitRegex.test(control.value)) {
            return {
                cuitFormat: 'Formato de cuit inválido'
            };
        }

        let digitoVerificador = Number(String(control.value)[10]);
        
        let tipoAndNumero = `${control?.value}`.slice(0, 10);

        let reversedTipoAndNumero = tipoAndNumero.split('').reverse();
        let factors = [2, 3, 4, 5, 6, 7, 2, 3, 4, 5];

        let totalSum = 0;

        for (let i = 0; i < reversedTipoAndNumero.length; i++) {
            totalSum += Number(reversedTipoAndNumero[i]) * factors[i];
        }

        let verificadorCalculado = 11 - (totalSum % 11);

        if (verificadorCalculado === 11) {
            verificadorCalculado = 0;
        }
        else if (verificadorCalculado === 10) {
            verificadorCalculado = 1;
        }
        console.log("verificadorCalculado != digitoVerificador", verificadorCalculado , digitoVerificador)

        if (verificadorCalculado != digitoVerificador) {
            return {
                cuitInvalido: 'Cuit inválido'
            };
        }

        return null;
    }
}

export function startsWith(start: any) {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.value.indexOf(start)) {
            return {
                startsWith: 'Debe comenzar con ' + start
            };
        }

        return null;
    }
}