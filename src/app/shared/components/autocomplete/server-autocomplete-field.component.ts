import { Component                   } from '@angular/core';
import { FormGroup                   } from '@angular/forms';
import { Input                       } from '@angular/core';
import { OnInit                      } from '@angular/core';
import { ServerAutocompleteComponent } from './server-autocomplete.component';

@Component({
    selector    :   'app-server-autocomplete-field',
    templateUrl :   './template/component.html',
    styleUrls   : [ './template/component.scss' ],
})
export class ServerAutocompleteFieldComponent extends ServerAutocompleteComponent implements OnInit {

    @Input()
    public form!      : FormGroup;

    @Input()
    public fieldName! : string;

    public ngOnInit(): void {
        this.value = this.form.get(this.fieldName)?.value;
        this.form.get(this.fieldName)?.valueChanges.subscribe((value)=>{
            this.value = value;
        });
        this.optionSelected.subscribe((value) => {
            this.form.get(this.fieldName)?.setValue(this.value);
        });
    }

}
