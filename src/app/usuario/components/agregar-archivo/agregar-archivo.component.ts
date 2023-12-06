import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Preview } from 'src/app/publicaciones/archivos/preview';

@Component({
  selector: 'app-agregar-archivo',
  templateUrl: './agregar-archivo.component.html',
  styleUrls: ['./agregar-archivo.component.scss']
})
export class AgregarArchivoComponent implements OnInit {

	@Input()
    public titulo : string = "";

	@Input()
    public subtitulo : string = "";

    @Input()
    public valorInicial : string = "";

	@Input()
    public archivo!: Preview | undefined; 

	@Input()
    public error: string = '';

	@Output()
    public errorChange : EventEmitter<string> = new EventEmitter<string>();

	@Output()
    public archivoChange : EventEmitter<Preview> = new EventEmitter<Preview>();

    public url : string | null = null;

	constructor() { }

	ngOnInit(): void {
        if(this.valorInicial != ""){
            this.url = this.valorInicial;
        }
	}

	public async onFileChange(event: any) {
        this.archivo = undefined;
        this.url = null;
		let file = event.target.files[0] as File;
		let preview = new Preview(file);

		this.archivo = preview;

        event.target.value = '';
        this.checkSize();

        this.archivoChange.emit(this.archivo);
        return;
    }

    public eliminarImagen(){
        this.archivo = undefined;
        this.url = null;
        this.setError('');
        this.archivoChange.emit(this.archivo);
        return;
    }

	private checkSize() {
		this.archivo!.hasError = false;

		if (this.archivo!.sizeMB > 10) {
			this.setError('El archivo supera el tamaño máximo permitido (10 MB).');
			this.archivo!.hasError = true;
			return;
		}

		if (this.archivo!.original.type === 'image/webp' || this.archivo!.original.type === 'image/webpm') {
			this.setError('No se permite el formato .webp o .webpm .');
			this.archivo!.hasError = true;
			return;
		}

        this.setError('');
    }

	private setError(mensaje: string) {
        this.error = mensaje;
        this.errorChange.emit(mensaje);
    }

}
