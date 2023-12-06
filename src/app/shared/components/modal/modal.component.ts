import { Component, EventEmitter, Output    } from '@angular/core';
import { Input        } from '@angular/core';
import { OnInit       } from '@angular/core';

@Component({
    selector    : 'app-modal',
    templateUrl : './modal.component.html',
    styleUrls   : ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

    @Input()
    public title      : string = 'Título';

    @Input()
    public textButton : string = 'Text';

    @Input()
    public onClick: string = '';

    @Output()
    public clickBoton  : EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public closeBoton  : EventEmitter<any> = new EventEmitter<any>();

    constructor() {

    }

    ngOnInit(): void {
    }

    public onClickBoton($event: any){
        this.clickBoton.emit();
    }

    public onCloseBoton($event: any){
        this.closeBoton.emit();
    }
}
