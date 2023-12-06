import { Component       } from '@angular/core';
import { Input           } from '@angular/core';
import { OnInit          } from '@angular/core';
import { DeviceService   } from '../../services/device.service';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
    selector    : 'app-boton-compartir',
    templateUrl : './boton-compartir.component.html',
    styleUrls   : ['./boton-compartir.component.scss']
})
export class BotonCompartirComponent implements OnInit {

    public isDesktop : boolean = false;
    public isMobile  : boolean = false;

    @Input()
    public url : string = "";

    @Input()
    public texto : string = "";

    @Input()
    public title : string = "Compartir";

    constructor(
        private deviceService: DeviceService,
        private snackBar: SnackBarService,
    ){}

    public ngOnInit(): void {
    }

    public compartir() : void {
        if(this.deviceService.isDesktop){
            navigator.clipboard.writeText(this.url);
            this.snackBar.show('Se copió el vínculo');
        }
        if(this.deviceService.isMobile){
            console.log('navigator.share', {
                url   : this.url,
                text  : this.texto,
                title : this.title,
            });
            navigator.share({
                url   : this.url,
                text  : this.texto,
                title : this.title,
            });
        }
    }

}
