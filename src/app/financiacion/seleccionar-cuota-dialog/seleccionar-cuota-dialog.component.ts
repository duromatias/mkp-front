import { Component       } from '@angular/core';
import { EventEmitter    } from '@angular/core';
import { Inject          } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef    } from '@angular/material/dialog';
import { OnInit          } from '@angular/core';
import { Router } from '@angular/router';

type Types  = 'Preaprobada' | 'No disponible' | 'Pendiente' | 'confirmar' | 'contactar';
type Icons  = '' |'success' | 'alert' | 'clock';

@Component({
    selector    :   'app-seleccionar-cuota-dialog',
    templateUrl :   './seleccionar-cuota-dialog.component.html',
    styleUrls   : [ './seleccionar-cuota-dialog.component.scss' ]
})
export class SeleccionarCuotaDialogComponent implements OnInit {


    public type               : Types =  'Preaprobada';
    public icon               : Icons  = '';
    public title              : string = '';
    public subtitle           : string = '';
    public message            : string = '';
    public closeButtonText    : string = 'Volver';
    public confirmButtonText  : string = 'Contactar';
    public readonly close     : EventEmitter<void> = new EventEmitter<void>();
    public readonly confirm   : EventEmitter<void> = new EventEmitter<void>();
    public telefonoContacto   : string = '';

    constructor(
        public  dialogRef : MatDialogRef<SeleccionarCuotaDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private router    : Router,
    ) {
        this.type = data.type;
        if(this.type === 'Preaprobada'){
            this.title    = '¡Financiación preaprobada!';
            this.subtitle = '¿Deseas confirmar la financiación?';
            this.message  = 'Tené en cuenta que luego de confirmar, deberás contactarte con la agencia para avanzar con la compra del vehículo.';
            this.icon     = 'success'
            this.closeButtonText = 'No, cancelar';
            this.confirmButtonText = 'Si, confirmar';
        };
        if(this.type === 'No disponible'){
            this.title = 'Financiación no disponible';
            this.subtitle = 'Por el momento no disponemos de productos que puedan cubrir la compra del vehículo.';
            this.message  = 'Para avanzar con otras alternativas crediticias, comunicate con Decreditos.';
            this.icon     = 'alert';
        };
        if(this.type === 'Pendiente'){
            let agencia = data.publicacion.nombreVendedor;
            this.telefonoContacto = data.publicacion.telefonoContacto
            console.log('datos: ',agencia,this.telefonoContacto);
            this.title   = '¡Tenés pendiente una financiación!';
            this.message = `Ya tenés un crédito con la agencia <b>${agencia}.</b> En caso de realizar alguna modificación, contactate con la agencia.`;
            this.icon    = 'clock';
        }
        if(this.type === 'confirmar'){
            this.title   = '¿Desea confirmar la financiación?';
            this.message = `Tené en cuenta que luego de confirmar, deberás contactarte con la agencia para avanzar con la compra del vehículo.`;
            this.icon     = 'alert';
            this.closeButtonText = 'No, cancelar';
            this.confirmButtonText = 'Si, confirmar';
        }
        if(this.type === 'contactar'){
            this.title    = '¡Procesa tu financiación!';
            this.message  = 'Para completar tu solicitud es necesario que te contactes con la agencia.';
            this.icon     = 'success'
            this.closeButtonText = 'Salir';
            this.confirmButtonText = 'Contactar';
            this.telefonoContacto = (data.publicacion !== undefined ? data.publicacion.telefonoContacto : '');
            if(data.message){
                this.message = data.message
            }
        };
    }

    public ngOnInit(): void {
    }

    public clickClose() {
        if(this.type === 'Pendiente'){
            this.router.navigate(['/publicaciones/529']);
        }
        if(this.type === 'contactar'){
            this.router.navigate(['/publicaciones']);
        }
        this.dialogRef.close();
        this.close.emit();
    }

    public clickConfirm() {
        if(this.type === 'Pendiente'){
            window.open(`https://wa.me/${this.telefonoContacto}`, '_blank');
        }
        if(this.type === 'contactar'){
            window.open(`https://wa.me/${this.telefonoContacto}`, '_blank');
        }
        this.dialogRef.close();
        this.confirm.emit();
    }

}
