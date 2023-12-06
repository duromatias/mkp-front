import { Component     } from '@angular/core';
import { DeviceService } from 'src/app/shared/services/device.service';
import { EventEmitter  } from '@angular/core';
import { Input         } from '@angular/core';
import { OnInit        } from '@angular/core';
import { Output        } from '@angular/core';
import { Utils         } from 'src/app/shared/utils';

@Component({
    selector    : 'app-cuota',
    templateUrl : './cuota.component.html',
    styleUrls   : ['./cuota.component.scss']
})
export class CuotaComponent implements OnInit {

    @Input()
    public selected : boolean = false;

    @Input()
    public gray     : boolean = false;

    @Input()
    public numeroCuota : number = 0;

    @Input()
    public valorCuota  : number = 0;

    @Output()
    public mouseOver   : EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public mouseLeave  : EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public selectCuota : EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private deviceService : DeviceService,
        public  utils         : Utils,
    ) { }

    ngOnInit(): void {
    }

    public emitMouseOver() : void {
        if(this.deviceService.isDesktop){
            console.log('over');
            this.mouseOver.emit();
        }
    }

    public emitMouseLeave() : void {
        if(this.deviceService.isDesktop){
            console.log('leave');
            this.mouseLeave.emit();
        }
    }

    public clickCuota() : void {
        if(this.deviceService.isMobile){
            this.selected = true;
            this.mouseOver.emit()
        }
    }

    public emitSelectCuota() : void {
        this.selectCuota.emit();
    }

}
