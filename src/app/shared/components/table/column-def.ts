export class ColumnDef {
    public type      : 'text' | 'number' | 'custom' | 'figure' | 'menu' | 'button' | 'checkbox' | 'input' | 'link' = 'text';
    public align     : 'left' | 'right'  | 'center' = 'left';
    public visible   : boolean = true;
    public icon      : string = '';
    public fnOnClick : Function = () => {};
    public sticky    : 'start' | 'end' | 'none' = 'none';
    public required  : boolean = false;
    public routerLinkFn : (row: any) => string = () => '';

    constructor(
        public name    : string,
        public title   : string,
        public width   : string,
        public valueFn : Function  = function() {},
    ) {}

    public renderFn(fn: (row: any)=> any): this {
        this.valueFn = fn;
        return this;
    }

    public setAsMenu(): this {
        this.sticky = 'end';
        this.type = 'menu';
        return this;
    }

    public setAsCheckBox(): this {
        this.type = 'checkbox';
        this.sticky = 'end';
        return this;
    }

    public setAsButton(icon: string): this {
        this.type = 'button';
        this.icon = icon;
        return this;
    }

    public setAsText(): this {
        this.type = 'text';
        return this;
    }

    public setAsNumber(): this {
        this.type = 'number';
        return this;
    }

    public setAsFigure(): this {
        this.type = 'figure'
        return this;
    }

    public setAsCustom(): this {
        this.type = 'custom'
        return this;
    }

    public setAsInput(): this {
        this.type = 'input';
        return this;
    }

    public setAsLink(routerLinkFn: (row: any) => string): this {
        this.type = 'link';
        this.routerLinkFn = routerLinkFn;
        return this;
    }

    public setSticky(sticky: 'start' | 'end' | 'none') {
        this.sticky = sticky;
    }

    public hide(): this {
        this.visible = false;
        return this;
    }

    public show(): this {
        this.visible = true;
        return this;
    }

    public setWidth(value: string): this {
        this.width = value;
        return this;
    }

    public setAlign(value: 'left' | 'right' | 'center'): this {
        this.align = value;
        return this;
    }

    public setIcon(value: string): this {
        this.icon = value;
        return this;
    }

    public click(row: any): void {
        this.fnOnClick(row);
    }

    public onClick(fn: Function): this {
        this.fnOnClick = fn;
        return this;
    }

    public setRequired(value: boolean = true): this {
        this.required = value;
        return this;
    }
}
    