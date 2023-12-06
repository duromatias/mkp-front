import { Component            } from '@angular/core';
import { ElementRef           } from '@angular/core';
import { EventEmitter         } from '@angular/core';
import { EventManager         } from '@angular/platform-browser';
import { Input                } from '@angular/core';
import { OnDestroy            } from '@angular/core';
import { OnInit               } from '@angular/core';
import { Output               } from '@angular/core';
import { ViewChild            } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { DeviceService } from '../../shared/services/device.service';

@Component({
  selector: 'app-imagenes-carrousel',
  templateUrl: './imagenes-carrousel.component.html',
  styleUrls: ['./imagenes-carrousel.component.scss']
})
export class ImagenesCarrouselComponent implements OnInit, OnDestroy {

    @Input()
    public currentPosition : number = 0;

    public items           : any[] = [];

    public itemsToShow     : any[] = [];

    public showArrows : boolean = true;

    @Output()
    public changePosition  : EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('rightArrow' ,{ read: ElementRef })
    public rightArrow! : ElementRef<HTMLElement>;

    @ViewChild('leftArrow' ,{ read: ElementRef })
    public leftArrow! : ElementRef<HTMLElement>;

    public  padding              : number = 0;
    public  widthCarousel        : number = 0;
    public  tripMarginLeft       : number = 0;
    private removeReiszeListener : Function = () => {};
    public  transition           : string = 'none';
    public  dimensionsFixed      : boolean = false;
    public  visibility           : string  = 'visible';
    public  isMobile!            : boolean;
    public  isMobileGalaxyFold!  : boolean;

    constructor(
        private events         : EventManager,
        private apiService     : ApiService,
        private deviceService  : DeviceService,
    ) { }

    public async ngOnInit() {
        if(!this.showArrows){
            this.visibility = 'hidden';
        }
        this.fixDimensions();
        //@ts-ignore;
        this.removeResizeListener = this.events.addEventListener(window, 'resize', () => {
            this.fixDimensions();
        });

        this.setTripPosition();

        this.items = await this.fetchImagenesCarousel();

        // Para evitar pedirse todas las imágenes,
        // se agrega sólo la primer imagen en itemsToShow
        // Luego, si el usuario toca los botones de
        // desplazamiento, se agregaran todas a itemsToShow
        if (this.items.length>0) {
            this.itemsToShow = [this.items[0]];
        }

        // Pero, cuando se solicita una posición específica
        // ahí mostramos todas las imágenes.
        if (this.currentPosition!==0) {
            this.itemsToShow = this.items;
        }

        this.deviceService.observe((result:any) => {
            this.isMobile = this.deviceService.isMobile;
            this.isMobileGalaxyFold = this.deviceService.isMobileGalaxyFold;
        });
    }

    public ngOnDestroy(): void {
        this.removeReiszeListener();
    }

    public async fetchImagenesCarousel(){
        let data = (await this.apiService.getData('/parametros/home-carousel-slides', {
        }));
        (data as []).sort((a:any,b:any)=>{
            return a.orden - b.orden
        }) 
        return data;
    }

    public fixDimensions() {

        this.dimensionsFixed = true;

        this.setTripPosition();
    }

    public setCurrentPosition(position : number) : void {
        this.currentPosition = position;
    }

    public getCurrentItem() : any {
        return this.items[this.currentPosition];
    }

    public increment(event:any, increment: number) {

        // Al mover el carrousel, se agregarán todas
        // las imágenes la variable de render itemsToShow
        if (this.itemsToShow.length !== this.items.length) {
            this.itemsToShow = this.items;
        }

        console.log(this.itemsToShow);

        this.transition = '0.7s all ease-in-out';
        this.currentPosition+=increment;
        if(this.currentPosition > this.items.length -1) {
            this.currentPosition = 0;
        }
        if (this.currentPosition < 0) {
            this.currentPosition = this.items.length -1;
        }
        this.setTripPosition();
        event.stopPropagation();
        this.changePositionCarousel();
        return false;
    }

    public mouseDown($event: any) {
        $event.stopPropagation();
        $event.preventDefault();
        return false;
    }

    public setTripPosition() {
        if(this.isMobileGalaxyFold){
            this.tripMarginLeft = this.currentPosition * 130;
        } else{
            this.tripMarginLeft = this.currentPosition * 100;
        }
    }

    public changePositionCarousel() {
        this.changePosition.emit(this.currentPosition);
    }

    public clickRightArrow(){
        this.rightArrow.nativeElement.click();
    }

    public clickLeftArrow(){
        this.leftArrow.nativeElement.click();
    }
}
