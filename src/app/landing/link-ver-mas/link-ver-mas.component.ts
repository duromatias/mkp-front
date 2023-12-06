import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'landing-link-ver-mas',
  templateUrl: './link-ver-mas.component.html',
  styleUrls: ['./link-ver-mas.component.scss']
})
export class LinkVerMasComponent implements OnInit {

    @Input()
    public titulo: string = '';

    @Input()
    public link: string = '/';

    constructor() { }

    ngOnInit(): void {
    }

}
