/**
 * Basado en el siguiente código:
 * 
 * https://github.com/erdoganbavas/web-practices/tree/master/bday-balloons
 * 
 */

import { Injectable } from '@angular/core';
import { NgModule   } from '@angular/core';

@Injectable()
@NgModule()
export class BalloonsMotionService {

    private density      : number   = 7; // concurrent balloon count
    private colors       : string[] = ['yellow', 'green', 'blue', 'red'];
    private cssInstalled : boolean  = false;
    private stopped      : boolean  = false;

    public start(density: number = 7) {
        this.installCss();
        this.density = density;

        for (let i = 0; i < this.density; i++) {
            const element = this.createBalloon();
            document.body.append(element);

            setTimeout(() => {
                if (this.stopped) {
                    return;
                }
                this.releaseBalloon(element, 20);
            }, this.random(100, 1000) * i);
        }
    }

    public stop() {
        this.stopped = true;
    }

    private createBalloon() {

        /**
         * Es un contenedor, para que no interfiera a la animación
         * el hecho que el globo está rotado
         */
        const component = document.createElement('div');
        component.classList.add('balloon-component');
        const balloon = document.createElement('div');

        /**
         * El elemento que dibuja el globo en sí mismo
         */
        balloon.classList.add('balloon');
        balloon.classList.add(this.randomColor());

        /**
         * La cuerda del globo
         */
        const string = document.createElement('div');
        string.classList.add('string');


        /**
         * Se componen los elementos.
         */
        balloon.append(string);
        component.append(balloon);

        return component;
    }

    private randomColor() {
        return this.colors[this.random(0, this.colors.length)];
    }

    private random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    private releaseBalloon(balloon: any, delay: number) {
        if (this.stopped) {
            return;
        }
        const x = this.random(0, 100); // random x value to fly

        balloon.style.left = `${1 * x}vw`;

        const sequence = [{
            transform: `translateY(-130vh)`
        }];

        const balloonAnimation = balloon.animate(sequence, {
            duration: 3000,
            delay: delay
        });

        balloonAnimation.onfinish = () => {
            this.releaseBalloon(balloon, delay);
        }
    }

    private installCss() {
        if (this.cssInstalled) {
            return;
        }

        let el = document.createElement('style');
        el.setAttribute('id', 'balloons-motion-css');
        el.innerHTML = `
            .balloon-component {
                position: fixed;
                bottom: 0;
                left: 0;
                z-index:9999;
            }
            .balloon {
                --balloonDimension: 5vmax; /* 15% of min(viewport width, height) */
                width: var(--balloonDimension);
                height: var(--balloonDimension);
                border-radius: 100% 100% 15% 100%;
                margin: 0 0 0 25px;
                transform: rotateZ(45deg);
                position: absolute;
                bottom: calc(-1 * var(--balloonDimension));
                left: 0;
                background-color: aqua;
                z-index:9999
            }
            .balloon::before {
                content: "";
                width: 10%;
                height: 25%;
                background: radial-gradient(circle, rgba(255,255,255,.7) 0%, rgba(255,255,255,.1) 100%);
                position: absolute;
                left: 15%;
                top: 45%;
                border-radius: 100%;
            }
            .balloon::after {
                content: "";
                width: 13%;
                height: 5%;
                background-color: inherit;
                position: absolute;
                left: 90%;
                top: 94%;
                border-radius: 22%;
                transform: rotateZ(-45deg);
            }
            .balloon .string {
                position: absolute;
                background-color: #990;
                width: 2px;
                height: calc(var(--balloonDimension) * .6);
                transform-origin: top center;
                transform: rotateZ(-45deg);
                top: calc(var(--balloonDimension) - 6px);
                left: calc(var(--balloonDimension) - 8px);
                z-index:9999
            }
            .yellow{
                background-color: rgba(150, 150, 0, .45);
            }
            .green{
                background-color: rgba(0, 150, 0, .45);
            }
            .blue{
                background-color: rgba(0, 0, 150, .45);
            }
            .red{
                background-color: rgba(150, 0, 0, .45);
            }
        `;
        document.head.appendChild(el);


        this.cssInstalled = true;
    }
}