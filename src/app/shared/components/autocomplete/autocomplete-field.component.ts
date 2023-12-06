import { Component             } from '@angular/core';
import { FormGroup             } from '@angular/forms';
import { Input                 } from '@angular/core';
import { AutocompleteComponent } from './autocomplete.component';

@Component({
    selector    :   'app-autocomplete-field',
    templateUrl :   './template/component.html',
    styleUrls   : [ './template/component.scss' ],
})
export class AutocompleteFieldComponent extends AutocompleteComponent {

    @Input()
    public form!      : FormGroup;

    @Input()
    public fieldName! : string;

    public ngOnInit(): void {
        super.ngOnInit();
        this.form.get(this.fieldName)?.valueChanges.subscribe((value)=>{
            this.value = value;
        });
        this.optionSelected.subscribe((value) => {
            this.form.get(this.fieldName)?.setValue(this.value);
        });
    }

    public getFilteredData(): any[] {
        return this.data.filter((item) => {
            return String(item[this.labelColumn])
                .toLowerCase()
                .includes(
                    String(this.value||'').toLowerCase()
                );
        });
    }

}
