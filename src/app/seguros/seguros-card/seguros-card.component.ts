import { Component } from '@angular/core';
import { Input     } from '@angular/core';
import { OnInit    } from '@angular/core';
import { Utils     } from 'src/app/shared/utils';

@Component({
    selector    : 'app-seguros-card',
    templateUrl : './seguros-card.component.html',
    styleUrls   : ['./seguros-card.component.scss']
})
export class SegurosCardComponent implements OnInit {

    constructor(
        public utils : Utils,
    ) { }

    @Input()
    public seguro : any = {
        emisionInmediata : false,
    };

    ngOnInit(): void {
    }

}
