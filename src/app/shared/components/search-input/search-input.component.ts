import { Component    } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Input        } from '@angular/core';
import { OnInit       } from '@angular/core';
import { Output       } from '@angular/core';

@Component({
    selector    :   'app-search-input',
    templateUrl :   './search-input.component.html',
    styleUrls   : [ './search-input.component.scss' ]
})
export class SearchInputComponent implements OnInit {

    @Input()
    public autocompleteValue : any;

    @Input()
    public label: string = 'Buscar...';

    @Input()
    public value: any = '';

    @Input()
    public valueDefault: any;

    @Output()
    public valueChange: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public change: EventEmitter<any> = new EventEmitter<any>();

    protected to: any;

    constructor() { }

    public ngOnInit(): void {
    }

    public keyup() {
        if (this.to) {
            clearTimeout(this.to);
        }
        this.to = setTimeout(() => {
            this.emitChange();
        }, 400);
    }

    public emitChange() {
        this.valueChange.emit(this.value);
        this.change.emit(this.value);
    }

    public clear() {
        this.value = '';
        this.emitChange();
    }

}
