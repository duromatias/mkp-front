import { Component    } from '@angular/core';
import { ElementRef   } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Input        } from '@angular/core';
import { OnInit       } from '@angular/core';
import { Output       } from '@angular/core';

@Component({
    selector    :   'app-autocomplete',
    templateUrl :   './template/component.html',
    styleUrls   : [ './template/component.scss' ],
})
export class AutocompleteComponent implements OnInit {

    @Input()  public keydownFn      : Function = () => {};
    @Input()  public value          : any     = null;
    @Input()  public label          : string  = 'Nombre del campo';
    @Input()  public placeholder    : string  = 'Escriba para buscar...';
    @Input()  public labelForAll    : string  = '';
    @Input()  public valueColumn    : string  = 'id';
    @Input()  public labelColumn    : string  = 'nombre';
    @Input()  public listIcon       : string  = '';
    @Input()  public listIconFn     : ((row: any) => string) | null = null;
    @Input()  public appearance     : any     = 'outlined';
    @Input()  public error          : string  = '';
    @Input()  public customErrors   : boolean = false;
    @Input()  public required       : boolean = false;
    @Input()  public disabled       : boolean = false;
    @Input()  public data           : any[]   = [];
    @Input()  public filteredData   : any[]   = [];
    @Input()  public debounceTime   : number  = 400;
    @Output() public valueChange    : EventEmitter<any> = new EventEmitter<any>();
    @Output() public change         : EventEmitter<any> = new EventEmitter<any>();
    @Output() public optionSelected : EventEmitter<any> = new EventEmitter<any>();
    @Output() public filter         : EventEmitter<any> = new EventEmitter<any>();
    @Output() public invalidOption  : EventEmitter<any> = new EventEmitter<any>();
    @Output() public focus          : EventEmitter<any> = new EventEmitter<any>();

    public  displayWithFn           : (value: any) => string;
    public  showSpinner             : boolean = false;

    private   optionActivatedValue    : any;
    private   optionActivatedText     : string | null = '';
    protected inputCambiando          : boolean = false
    private   to                      : any;

    constructor(
        private element   : ElementRef,
    ) {
        this.displayWithFn = (value: any) => {
            return (this.data.filter(row => {
                return row[this.valueColumn] === value;
            })[0]||{})[this.labelColumn];
        }
    }

    public ngOnInit() {

    }

    public getFilteredData() {
        return this.data;
    }

    public async refresh(searchString: string | null = null) {
        
    }

    public clearList() : void {
        this.data = [];
    }

    public inputClick() {
        if(this.value === null){
            this.value = '';
        }
        this.refresh();
    }

    public keyup(event: any) {
        // Cuando estamos en android, el teclado no informa
        // la tecla, por tanto no podemos evaluarlas.
        if (event.key !== 'Unidentified') {
            // Esto es para evitar que se dispare la solicitud
            // de datos al servidor por presiones de tecla
            // que no afectan al texto. Ejemplo, flechas,
            if (!/^([a-z0-9\s]{1}|Backspace|Delete)$/i.test(event.key) ) {
                return;
            }
        }
        if (this.to) {
            clearTimeout(this.to);
        }
        
        this.to = setTimeout(() => {
            this.emitChange();
        
            this.refresh(this.value);
        }, this.debounceTime);
    }

    //@ts-ignore
    public keydown(event: any) {
        let ret = this.keydownFn(event);
        if (ret === false) {
            return false;
        }
    }

    public emitChange() {
        this.change.emit(this.value);
    }

    public emitOptionSelected() {
        this.valueChange.emit(this.value);
        this.inputCambiando = false;
        this.optionSelected.emit(this.value);
    }

    public get hasIcon(): boolean {
        return this.listIcon !== '' || this.listIconFn !== null;
    }

    public getIcon(row: any): string {
        let icon = this.listIcon;
        if (this.listIconFn) {
            icon = this.listIconFn(row);
        }
        return icon || '';
    }

    public onPanelClosed() {
        this.chooseCurrentOption();
    }

    public onPanelOpened() {
        this.optionActivatedValue = null;
        this.fixPanelPosition();
    }

    public onFocus() {
        this.focus.emit();
    }

    protected fixPanelPosition() {
        let collection  = document.getElementsByClassName('cdk-overlay-pane');
        let rectangle   = (this.element.nativeElement as HTMLElement).getBoundingClientRect();
        let topPosition = rectangle.bottom - 22; // 22px es el espacio para el mensaje de error
        
        let fixFn = () => {
            for(let index = 0; index < collection.length; index++) {
                let element = collection[index] as HTMLElement;
                element.style.position = 'fixed';
                element.style.top = `${topPosition}px`;
                element.classList.remove('autocomplete-custom-class');
            }
        }

        setTimeout(fixFn,    0);
        setTimeout(fixFn,  200);
        setTimeout(fixFn,  300);
        setTimeout(fixFn,  500);
        setTimeout(fixFn, 1000);
    }

    private chooseCurrentOption() {
        // Esto es porque a veces no se dispara el evento que
        // rellena estos valores, y para zafarlo, tomamos el primer
        // Elemento de la lista.
        if (!this.optionActivatedValue) {
            let filteredData = this.getFilteredData();
            
            if (filteredData.length) {
                this.optionActivatedValue = filteredData[0][this.valueColumn];
                this.optionActivatedText  = filteredData[0][this.labelColumn];
            }
        }
        this.value = this.optionActivatedValue;
        this.emitOptionSelected();
    }

    public onOptionActivated(event: any) {
        this.optionActivatedValue = event.option.value;
        this.optionActivatedText  = event.option.viewValue;
    }

    public onOptionSelected(event: any) {
        this.onOptionActivated(event);
        this.chooseCurrentOption();
    }

    public inputChange() : void {
        this.inputCambiando = true;
        setTimeout(() => {
            if(this.inputCambiando){
                this.invalidOption.emit();
            }
        }, 500);
    }

}
