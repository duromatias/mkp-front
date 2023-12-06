import { ApiService } from 'src/app/shared/services/api.service';
import { Component  } from '@angular/core';
import { OnInit     } from '@angular/core';

@Component({
    selector    : 'app-consulta-tyc',
    templateUrl : './consulta-terminos-ycondiciones.component.html',
    styleUrls   : ['./consulta-terminos-ycondiciones.component.scss']
})
export class ConsultaTerminosYCondicionesComponent implements OnInit {

    constructor(
       private apiService : ApiService
    ) { }

    public tyc           : any;

    public async ngOnInit(): Promise<void> {
        let data = await this.apiService.getData('/auth/tyc');
        this.tyc  = data.tyc;
    }

}
