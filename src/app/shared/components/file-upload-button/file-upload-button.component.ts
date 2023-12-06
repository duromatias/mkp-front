import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload-button',
  templateUrl: './file-upload-button.component.html',
  styleUrls: ['./file-upload-button.component.scss']
})
export class FileUploadButtonComponent implements OnInit {

    @Input()
    public label: string = 'Subir archivo';

    @Input()
    public choosenFileLabel: string = 'Archivo elegido';

    @Output()
    public change: EventEmitter<any> = new EventEmitter<any>();

    public choosenFile!: File | null;

    public choosenFileContent!: string | ArrayBuffer | null

    constructor() { }

    ngOnInit(): void {
    }

    public onFileChange(event: any) {
        this.change.emit(event);
        const reader = new FileReader;
        if (event.target.files.length > 0) {
            const [file] = event.target.files;
            this.choosenFile = file;
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.choosenFileContent = reader.result;
            }
        }
    }

    public getFileContent(): string | ArrayBuffer | null {
        return this.choosenFileContent;
    }

    public reset() {
        this.choosenFile = null;
        this.choosenFileContent = null;
    }

}

