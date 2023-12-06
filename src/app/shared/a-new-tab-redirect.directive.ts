import { Directive    } from '@angular/core';
import { environment  } from 'src/environments/environment';
import { HostListener } from '@angular/core';


@Directive({
    selector: '[app-a-new-tab-redirect]'
})
export class AnweTabRedirectDirective {

    @HostListener('click', ['$event'])
    public click(event: any): any {
        
        const words = [
            'XiaoMi', 'MiuiBrowser'
        ];
        const appVersion : string = event.view.clientInformation.appVersion;

        let redirect : boolean = false;
        words.forEach(element => {
            if(appVersion.includes(element)){
                redirect = true;
            }
        });
        
        if(redirect){
            window.open(`${environment.urlMarketplace}/auth/tyc`);
            event.preventDefault();

        }

    }


}
