import { Component               } from '@angular/core';
import { OnInit                  } from '@angular/core';
import { SpinnerService          } from './shared/services/spinner.service';
import { NavigationEnd, Router   } from '@angular/router';
import { GoogleTagManagerService } from 'angular-google-tag-manager';

@Component({
    selector    :   'app-root',
    templateUrl :   './app.component.html',
    styleUrls   : [ './app.component.scss']
})
export class AppComponent implements OnInit {

    public showSpinner : boolean = false;
    public showCap     : boolean = true;

    public constructor(
        private router         : Router,
        private spinnerService : SpinnerService,
        private gtmService     : GoogleTagManagerService,
    ) {

    }

    public ngOnInit(): void {

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.gtmService.pushTag({
                    event: 'page',
                    pageName: event.urlAfterRedirects,
                });
            }
        });

        this.spinnerService.state.subscribe((value)=>{
            setTimeout(() => {
                this.showSpinner = value;
            }, 0);
        });

        setTimeout(() => {
            let script = document.createElement('script');
            script.setAttribute('src', 'https://cdn.kodear.net/resources/logo/logo.js');
            // document.head.appendChild(script);
        }, 2000);
    }

}
