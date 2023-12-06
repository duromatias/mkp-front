import { Component            } from '@angular/core';
import { ElementRef           } from '@angular/core';
import { EventEmitter         } from '@angular/core';
import { EventManager         } from '@angular/platform-browser';
import { Input                } from '@angular/core';
import { OnDestroy            } from '@angular/core';
import { OnInit               } from '@angular/core';
import { Output               } from '@angular/core';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { ViewChild            } from '@angular/core';

@Component({
    selector    : 'carousel',
    templateUrl : './carousel.component.html',
    styleUrls   : ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, OnDestroy {

    @Input()
    public es_oportunidad  : boolean = false;

    @Input()
    public currentPosition : number = 0;

    @Input()
    public items           : any[] = [];

    public itemsToShow     : any[] = [];

    @Input()
    public atributoUrl     : string = 'url';

    @Output()
    public changePosition  : EventEmitter<any> = new EventEmitter<any>();

    @Input()
    public showArrows : boolean = true;

    @ViewChild('hole', {static: true, read: ElementRef })
    public hole!: ElementRef<HTMLElement>;

    @ViewChild('videoPlayer')
    public videoPlayer? : VideoPlayerComponent;

    @ViewChild('rightArrow' ,{ read: ElementRef })
    public rightArrow! : ElementRef<HTMLElement>;

    @ViewChild('leftArrow' ,{ read: ElementRef })
    public leftArrow! : ElementRef<HTMLElement>;

    public  width                : number = 0;
    public  height               : number = 0;
    public  holeStyle            : any    = {};
    public  padding              : number = 0;
    public  widthCarousel        : number = 0;
    public  tripMarginLeft       : number = 0;
    private removeReiszeListener : Function = () => {};
    public  transition           : string = 'none';
    public  dimensionsFixed      : boolean = false;
    public  visibility           : string  = 'visible';

    constructor(
        private events: EventManager
    ) { }

    public ngOnInit() : void {
        if(!this.showArrows){
            this.visibility = 'hidden';
        }
        this.fixDimensions();
        //@ts-ignore;
        this.removeResizeListener = this.events.addEventListener(window, 'resize', () => {
            this.fixDimensions();
        });

        this.setTripPosition();

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
    }

    public ngOnDestroy(): void {
        this.removeReiszeListener();
    }

    public fixDimensions() {
        this.transition = 'none';
        let parent = this.hole.nativeElement.parentElement;
        if (parent) {
            this.width   = parent.offsetWidth + 1; // el +1 es para fixear los pixeles decimales, que la librería no los lee
            this.height  = parent.offsetHeight;
        }

        this.holeStyle = {
            width: (this.width - 1) + 'px',
            height: this.height + 'px',
        }

        this.dimensionsFixed = true;

        this.padding = (this.height - 40) / 2; //40 es lo que mide el boton
        if(this.items.length < 1){
            this.widthCarousel = this.width;
        } else{
            this.widthCarousel = this.width * this.items.length;
        }

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

        this.transition = '0.7s all ease-in-out'
        this.currentPosition+=increment;
        if(this.currentPosition > this.items.length -1) {
            this.currentPosition = 0
        }
        if (this.currentPosition < 0) {
            this.currentPosition = this.items.length -1;
        }
        this.videoPlayer?.pauseVideo();
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
        this.tripMarginLeft = this.currentPosition * this.width * -1;
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
