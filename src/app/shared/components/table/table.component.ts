import { Component, EventEmitter, Output  } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Input      } from '@angular/core';
import { OnInit     } from '@angular/core';

import { ColumnDef  } from './column-def';
import { MenuItem   } from './menu-item';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    selector    :   'app-table',
    templateUrl :   './table.component.html',
    styleUrls   : [ './table.component.scss' ]
})
export class TableComponent<T> implements OnInit {

    @Input()
    public dataSource : T[] | DataSource<T> = [];

    @Input()
    public hideHeaders: boolean = false;

    @Output()
    public rowCheckChange: EventEmitter<any> = new EventEmitter;

    @Input()
    public columns : ColumnDef[] = [];

    public rowIdFn : (row: T) => any = (row: any) => row?.id;

    public menuItems: MenuItem[] = [];
    public fnMenuItems : Function = (row: any): MenuItem[] => { return []; }
    
    public constructor() { }

    public ngOnInit(): void {
    }

    public clearColumns() {
        this.columns = [];
    }

    public setColumns(columns: ColumnDef[]) {
        this.columns = columns;
    }

    public getColumn(name: string): ColumnDef {
        let list = this.columns.filter(c=>c.name===name);
        if (list.length !== 1) {
            throw new Error('No existe la columna ' + name);
        }
        return list[0];
    }

    public clickMenu(row: any) {
        this.menuItems = [];
        this.fnMenuItems(row);
    }

    public get columnsToShow(): string[] {
        return this.columns.filter(column => column.visible).map(column => column.name);
    }

    public addColumn(name: string, title: string, width: string, valueFn : Function  = function() {}): ColumnDef {
        let columnDef = new ColumnDef(name, title, width, valueFn);
        this.columns.push(columnDef);
        return columnDef;
    }

    public setRowIdFn(fn: (row: T) => any): this {
        this.rowIdFn = fn;
        return this;
    }

    public onRowChecked(event: MatCheckboxChange, row: T) {
        this.rowCheckChange.emit({
            checked: event.checked,
            row: row
        });
    }

    public addMenuItem(label: string, onClick: Function): this {
        this.menuItems.push(new MenuItem(label, onClick));
        return this;
    }

    public clearMenuItems(): this {
        this.menuItems = [];
        return this;
    }

    public setFnMenuItems(fn: Function): this {
        this.fnMenuItems = fn;
        return this;
    }
}
