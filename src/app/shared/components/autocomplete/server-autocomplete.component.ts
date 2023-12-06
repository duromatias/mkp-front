import { Component             } from '@angular/core';
import { ElementRef            } from '@angular/core';
import { EventEmitter          } from '@angular/core';
import { Input                 } from '@angular/core';
import { Output                } from '@angular/core';
import { ApiService            } from '../../services/api.service';
import { AutocompleteComponent } from './autocomplete.component';

@Component({
    selector    :   'app-server-autocomplete',
    templateUrl :   './template/component.html',
    styleUrls   : [ './template/component.scss' ],
})
export class ServerAutocompleteComponent extends AutocompleteComponent {

    @Input()  public preventCallWithEmptyValue : boolean = false;
    @Input()  public dataUrl           : string = '';
    @Input()  public dataParams        : any    = {};
    @Input()  public searchParam       : string = 'busqueda';
    @Input()  public searchPrefix      : string = 'filtros';
    @Input()  public searchLimit       : number = 10;
    @Input()  public caracteresMinimos : number = 0;
    
    @Output() public fetchData      : EventEmitter<any> = new EventEmitter<any>();
    
    constructor(
        private apiService: ApiService,
        element   : ElementRef,
    ) {
        super(element);
    }

    public emitOptionSelected() {
        this.valueChange.emit(this.value);
        this.inputCambiando = false;
        this.optionSelected.emit(this.obtenerRegistro());
    }

    public async refresh(searchString: string | null = null) {
        if (!searchString) {
            if (this.preventCallWithEmptyValue) {
                return;
            }
        }
        if ((searchString || '').length < this.caracteresMinimos) {
            return;
        }

        let params = Object.assign({
            filtros: {},
            ordenes: {},
        }, this.dataParams);

        if (this.searchPrefix) {
            params[this.searchPrefix][this.searchParam] = searchString;
        } else {
            params[this.searchParam] = searchString;
        }
        
        params.limit = this.searchLimit;
        this.showSpinner = true;
        try {
            let data = await this.apiService.getData(this.dataUrl, params);
            this.data = data;
            this.fixPanelPosition();
            this.fetchData.emit(data);
        } finally {
            this.showSpinner = false;
        }
    }

    public obtenerRegistro(): any {
        return this.data.filter((row) => {
            return row[this.valueColumn] === this.value
        })[0];
    }

}
