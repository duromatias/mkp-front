import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {

    public playing: boolean = false;

    @Input()
    public src: string = '';

    @Input()
    public width: number = 100;

    @Input()
    public height: number = 100;

    @ViewChild('video')
    public video! : ElementRef<HTMLVideoElement>;


    /**
     * El video se mantiene oculto hasta que el usuario aprieta play,
     * ahí se muestra.
     * Esto es porque en iOS, si el video no está oculto, empuja hacia abajo
     * el overlay, pese a que ambos (video y el overlay) tienen position absolute e inset 0
     * Pero luego al apagarse y mostrarse de nuevo, esto se corrije.
     */
    public displayVideo = 'none';

    constructor() { }

    ngOnInit(): void {
    }

    public playVideo() {
        this.displayVideo = 'block';
        this.video.nativeElement.play();
        this.playing = true;
    }

    public clickVideo() {
        if (this.playing = false) {
            this.playVideo();
        } else {
            this.pauseVideo();
        }
    }

    public pauseVideo() {
        this.video.nativeElement.pause();
        this.playing = false;
    }

}
