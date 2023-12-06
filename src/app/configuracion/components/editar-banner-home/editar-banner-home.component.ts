import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadButtonComponent     } from 'src/app/shared/components/file-upload-button/file-upload-button.component';
import { FormBaseComponent } from 'src/app/shared/components/form-base.component';
import { ListadoDataSource } from 'src/app/shared/components/listado.datasource';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

@Component({
  selector: 'app-editar-banner-home',
  templateUrl: './editar-banner-home.component.html',
  styleUrls: ['./editar-banner-home.component.scss']
})
export class EditarBannerHomeComponent extends FormBaseComponent implements OnInit {

    public homeBanner : any;

    @ViewChild('uploadButtonMobile', {static: true})
    public uploadButtonMobile!: FileUploadButtonComponent;

    @ViewChild('uploadButtonDesktop', {static: true})
    public uploadButtonDesktop!: FileUploadButtonComponent;

    public idBannerHome     : any;
    public imagenDesktopUrl : string = '';
    public imagenMobileUrl  : string = ''; 


    constructor(
        public  dataSource 		   : ListadoDataSource<any>,
        private route              : ActivatedRoute,
        private router             : Router,
        private snackBar           : SnackBarService,
    )
    {
      super();
    }

    ngOnInit(): void {
        this.createForm();
        this.route.params.subscribe((params) => {
            this.spinnerService.go(async() => {
                this.homeBanner = await this.apiService.getData('/parametros/home-carousel-slides/' + params.id,{});
                this.idBannerHome = params.id;
                this.form.patchValue({
                    titulo         : this.homeBanner.titulo,
                    orden          : this.homeBanner.orden,
                    detalle        : this.homeBanner.detalle,
                    link           : this.homeBanner.link,
                });
                
                // Esto es para que no tome las imagenes desde el caché.
                let ts = (new Date).getTime();

                this.imagenDesktopUrl = this.homeBanner.imagen_desktop + `?ts=${ts}`;
                this.imagenMobileUrl  = this.homeBanner.imagen_mobile  + `?ts=${ts}`;
            });
        });
    }

    protected get dataUrl(): string {
        return '/configuracion/editar-home-banner/';
    }

    private createForm() {
        this.form = this.fb.group({
            titulo              : new FormControl({ value: '', disabled: false }),
            orden               : new FormControl({ value: '', disabled: false }),
            detalle             : new FormControl({ value: '', disabled: false }),
            link                : new FormControl({ value: '', disabled: false }),
            imagen_desktop      : new FormControl({ value: '', disabled: false }),
            imagen_mobile       : new FormControl({ value: '', disabled: false }),
        });

    }

    public async alElegirImagenMobile() {
        let choosenFile = this.uploadButtonMobile.choosenFile;
        if (choosenFile) {
            this.form.get('imagen_mobile')?.patchValue(choosenFile);
            this.imagenMobileUrl = await this.getContentAsUrl(choosenFile);
        }
    }

    public async alElegirImagenDesktop() {
        let choosenFile = this.uploadButtonDesktop.choosenFile;
        if (choosenFile) {
            this.form.get('imagen_desktop')?.patchValue(choosenFile);
            this.imagenDesktopUrl = await this.getContentAsUrl(choosenFile);
        }
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

    public async submit (){
        
        let data: any = {
            titulo  : this.form.get('titulo' )?.value,
            orden   : this.form.get('orden'  )?.value,
            detalle : this.form.get('detalle')?.value,
            link    : this.form.get('link'   )?.value,
        };
        if(this.form.get('imagen_mobile' )?.value) {
            data.imagen_mobile = this.form.get('imagen_mobile' )?.value;
        }
        if(this.form.get('imagen_desktop' )?.value) {
            data.imagen_desktop = this.form.get('imagen_desktop' )?.value;
        }

        this.spinnerService.go(async () => {
            await this.apiService.post(`/parametros/home-carousel-slides/${this.idBannerHome}`, data);
            this.snackBar.show('Datos guardados exitosamente');
            this.router.navigate(['/configuracion/banner']);
        });
    }
}
