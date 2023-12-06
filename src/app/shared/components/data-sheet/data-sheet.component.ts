import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-data-sheet',
    templateUrl: './data-sheet.component.html',
    styleUrls: ['./data-sheet.component.scss']
})
export class DataSheetComponent implements OnInit {
    
    @Input()
    public rsData : any[] = [];

    constructor() { }

    ngOnInit(): void {
    }

}
