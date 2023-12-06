export class Multimedia {

    public constructor(
        public id   : number = 0,
        public url  : string = '',
        public type : 'image' | 'video' = 'image',
    ) { }
}