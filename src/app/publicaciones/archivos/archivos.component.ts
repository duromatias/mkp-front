import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Multimedia } from './multimedia';
import { Preview } from './preview';

@Component({
    selector    :   'publicaciones-archivos',
    templateUrl :   './archivos.component.html',
    styleUrls   : [ './archivos.component.scss' ]
})
export class ArchivosComponent implements OnInit {

    @Input()
    public archivos: Preview[] = [];

    @Input()
    public error: string = '';

    @Output()
    public archivosChange : EventEmitter<Preview[]> = new EventEmitter<Preview[]>();

    @Output()
    public errorChange : EventEmitter<string> = new EventEmitter<string>();

    @Input()
    public tamanioMaximoPorArchivo = 10;

    @Input()
    public tamanioMaximoTotal      = 100;

    @Input()
    public tamanioMaximoTextoError = '';

    constructor() { }

    ngOnInit(): void {
        
    }

    public async onFileChange(event: any) {
        for (let i=0;i < event.target.files.length; i++) {
            let file = event.target.files[i] as File;
            let preview = new Preview(file);

            if (!preview.isValid()) {
                continue;
            }
            this.archivos.push(preview);
        }
        event.target.value = '';
        this.checkPortada();
        this.checkSize();

        this.notificar();
        return;
    }

    public setFiles(registros : (File | Multimedia)[]) {
        this.archivos.concat(registros.map(i => new Preview(i)));
    }

    private getPortadas(): Preview[] {
        return this.archivos.filter((i) => i.esPortada);
    }

    private checkPortada() {
        let imagenes = this.archivos.filter(i => i.type === 'image');
        if (this.getPortadas().length === 0 && imagenes.length > 0) {
            this.marcarPortada(imagenes[0]);
        }
    }

    private checkSize() {
        let total = 0;
        this.archivos.map((archivo: Preview) => {
            archivo.hasError = false;
        });
        for (let archivo of this.archivos) {
            if (archivo.sizeMB > this.tamanioMaximoPorArchivo) {
                this.setError(this.tamanioMaximoTextoError);
                archivo.hasError = true;
                return;
            }
            total += archivo.sizeMB;

            if (archivo.original.type === 'image/webp' ||
                archivo.original.type === 'image/webpm') {
                this.setError('No se permite el formato .webp o .webpm .');
                archivo.hasError = true;
                return;
            }

            if (total > this.tamanioMaximoTotal) {
                this.setError(this.tamanioMaximoTextoError);
                archivo.hasError = true;
                return;
            }
        };
        this.setError('');
    }

    private marcarPortada(preview: Preview) {
        this.getPortadas().map((i) => i.esPortada = false);
        preview.esPortada = true;
    }

    public getArhivosOrdenados() {
        return this.archivos.filter(i => i.esPortada).concat(this.archivos.filter(i => !i.esPortada));
    }

    public clickMarcarPortada(preview: Preview) {
        this.marcarPortada(preview);
        this.notificar();
    }

    public clickEliminar(preview: Preview) {
        this.archivos = this.archivos.filter(i => i !== preview);
        this.checkPortada();
        this.checkSize();
        this.notificar();
    }

    private notificar() {
        this.archivosChange.emit(this.archivos);
    }

    private setError(mensaje: string) {
        this.error = mensaje
        console.log('this.errorChange.emit(', mensaje, ')');
        this.errorChange.emit(mensaje);
    }

}
