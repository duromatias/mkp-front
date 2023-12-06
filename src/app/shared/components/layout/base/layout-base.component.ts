import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DeviceService } from '../../../services/device.service';

@Component({
    selector    :   'app-layout-base',
    templateUrl :   './layout-base.component.html',
    styleUrls   : [ './layout-base.component.scss']
})
export class LayoutBaseComponent implements OnInit {

    @Input()
    public titulo: string = '';
    
    @ViewChild('panelPrincipal')
    public panelPrincipal!: MatSidenav;

    @ViewChild('panelSecundario')
    public panelSecundario!: MatSidenav;

    @Input()
    public drawerMode: 'side' | 'over' = 'side';

    @Input()
    public drawerOpened: boolean = false;

    @Input()
    public customBehavior: boolean = false;

    @Input()
    public mostrarPanelPrincipal: boolean = true;

    @Input()
    public mostrarPanelSecundario: boolean = true;

    @Input()
    public lienzo : boolean = true;

    @Input()
    public set posicionPanelPrincipal(value: 'start' | 'end') {
        this._panelPrincipalPosition  = value;
    }

    @Input()
    public set posicionPanelSecundario(value: 'start' | 'end') {
        this._panelSecundarioPosition = value 
    }

    public _panelPrincipalPosition  : 'start' | 'end' = 'start';
    public _panelSecundarioPosition : 'start' | 'end' = 'start';

    constructor(
        private deviceService: DeviceService,
    ) { }

    ngOnInit(): void {
        this.deviceService.observe((result:boolean) => {
            if (result) {
                this.drawerMode = 'over';
                this.drawerOpened = false;
            } else {
                this.drawerMode = 'side';
                this.drawerOpened = true;
            }
        });
    }

    public getPanelPrincipal() {
        return this.panelPrincipal;
    }

    public getPanelSecundario() {
        return this.panelSecundario;
    }

    close() {
        this.panelPrincipal.close();
    }

    openDrawer() {
        this.panelPrincipal.open();
    }

    toggle() {
        this.panelPrincipal.toggle();
    }

}
