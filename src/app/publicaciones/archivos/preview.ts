import { Multimedia } from "./multimedia";

export class Preview {
    public src       : string  = '';
    public esPortada : boolean = false;
    public type      : string  = '';
    public size      : number  = 0;
    public sizeMB    : number  = 0;
    public hasError  : boolean = false;

    public constructor(
        public original : Multimedia | File
    ) {
        this.type = this.getType();
        this.getSource(this.original).then((src) => {
            this.src = src;
        });

        if (original instanceof File) {
            this.size   = original.size;
            this.sizeMB = this.size / (1024 * 1024);
        }
    }

    public isValid(): boolean {
        return this.type === 'image' || this.type === 'video';
    }

    public getType() {
        if (this.original instanceof Multimedia) {
            return this.original.type;
        }

        return this.original.type.split('/')[0];
    }

    public getSource(file: File | Multimedia): Promise<any> {
        return new Promise(async (resolve) => {
            if (file instanceof Multimedia) {
                resolve(file.url);
                return;
            }

            let src = await this.getContentAsUrl(file as File);
            return resolve(src);
        });
    }

    private getContentAsUrl(file: File): Promise<any> {
        return new Promise((resolve) => {
            const reader = new FileReader;
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result);
            }
        });
    }
}