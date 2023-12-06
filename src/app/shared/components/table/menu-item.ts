export class MenuItem {

    public constructor(
        public readonly label: string,
        public readonly click: Function = () => {},
    ) {}
}
    