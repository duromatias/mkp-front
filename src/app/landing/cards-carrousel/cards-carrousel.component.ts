import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../auth/services/user.service';

@Component({
  selector: 'landing-cards-carrousel',
  templateUrl: './cards-carrousel.component.html',
  styleUrls: ['./cards-carrousel.component.scss']
})
export class LandingCardsCarrouselComponent implements OnInit {

    @Input()
    public publicaciones: any[] = [];
    public user: any;

    constructor(
        private userService: UserService
    ) { }

    public ngOnInit(): void {
        this.user = this.userService.getUser();
    }

}
