import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector    :   'app-select-input',
    templateUrl :   './component.html',
    styleUrls   : [ './component.scss']
})
export class SelectInputComponent implements OnInit {

    @Input()
    public emptyOption: string | null = null;

    @Input()
    public options: any[] = []

    @Input()
    public label: string = 'Label';

    @Input()
    public optionsValue: string = 'valor';

    @Input()
    public optionsLabel: string = 'descripcion';

    @Input()
    public error: string = '';

    @Input()
    public value: any = null;

    @Output()
    public valueChange : EventEmitter<any> = new EventEmitter<any>();

    constructor() { }

    public ngOnInit(): void {
    }

    public notifyChange(): void {
        this.valueChange.emit(this.value);
    }

}
