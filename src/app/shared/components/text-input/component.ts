import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector    :   'app-text-input',
    templateUrl :   './component.html',
    styleUrls   : [ './component.scss' ]
})
export class TextInputComponent implements OnInit {

    @Input()
    public label    : string = 'Label';

    @Input()
    public error    : string = '';

    @Input()
    public value    : any = null;

    @Input()
    public readOnly : boolean = false;

    @Output()
    public valueChange : EventEmitter<any> = new EventEmitter<any>();

    constructor() { }

    public ngOnInit(): void {
    }

    public notifyChange(): void {
        this.valueChange.emit(this.value.replace(/\./g,''));
    }

}
