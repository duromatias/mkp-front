import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/auth/services/user.service';

@Component({
    selector: 'app-networks',
    templateUrl: './networks.component.html',
    styleUrls: ['./networks.component.scss']
})
export class NetworksComponent implements OnInit {

    public parametros: any = {};

    constructor(
        private userService: UserService,
    ) { }

    public ngOnInit(): void {
        this.parametros = this.userService.getParametros();
    }

}
