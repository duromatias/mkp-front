import { Component         } from '@angular/core';
import { MenuBaseComponent } from '../menu-base.component';

@Component({
    selector    : 'app-menu-desktop',
    templateUrl : './menu-desktop.component.html',
    styleUrls   : ['./menu-desktop.component.scss']
})
export class MenuDesktopComponent extends MenuBaseComponent {

    public getProfilePicture() : string {
        return "assets/images/avatar.png";
    }

}
