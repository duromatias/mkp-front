import { ArchivosComponent                 } from '../archivos/archivos.component';
import { ActivatedRoute                    } from '@angular/router';
import { AuthService                       } from 'src/app/auth/services/auth.service';
import { Component                         } from '@angular/core';
import { DeviceService                     } from 'src/app/shared/services/device.service';
import { FinanciacionDialogComponent       } from 'src/app/auth/components/financiacion-dialog/financiacion-dialog.component'
import { FormBaseComponent                 } from 'src/app/shared/components/form-base.component';
import { FormControl                       } from '@angular/forms';
import { formatDate                        } from '@angular/common';
import { HttpErrorResponse                 } from '@angular/common/http';
import { MatDialog                         } from '@angular/material/dialog';
import { Multimedia                        } from '../archivos/multimedia';
import { Observable                        } from 'rxjs';
import { OnInit                            } from '@angular/core';
import { Preview                           } from '../archivos/preview';
import { Router                            } from '@angular/router';
import { ServerAutocompleteFieldComponent  } from 'src/app/shared/components/autocomplete/server-autocomplete-field.component';
import { SubastasOnboardingDialogComponent } from '../banner-subastas/subastas-onboarding-dialog/subastas-onboarding-dialog';
import { UserService                       } from 'src/app/auth/services/user.service';
import { UsuarioInterface                  } from 'src/app/usuarios/models/user.model';
import { Utils                             } from 'src/app/shared/utils';
import { ViewChild                         } from '@angular/core';

@Component({
    selector    : 'app-agregar-publicacion',
    templateUrl : './agregar-publicacion.component.html',
    styleUrls   : ['./agregar-publicacion.component.scss']
})
export class AgregarPublicacionComponent extends FormBaseComponent implements OnInit {

    public colores                    : any;
    public combustibles               : any;
    public editPhone                  : boolean                 = false;
    public enabledSubmit              : boolean                 = true;
    public isMobile                   : boolean                 = false;
    public mostrarMensajeTelefonoAgencia : boolean = false;
    public marcas                     : any[]                   = [];
    public modelos                    : any[]                   = [];
    public precioSugerido             : string | null           = null;
    public precioSugeridoNoDisponible : boolean = false;
    public publicacion                : any;
    public user                       : UsuarioInterface | null = null;
    public valorMinimo!               : any;
    public years                      : any[]  = [];
    public fecha                      : string = '';
    public simboloMoneda              : any;
    public habilitarAnio              : boolean = true;
    public habilitarModelo            : boolean = true;
    public publicacionData            : any;
    public esParticular!              : boolean;
    public validarDireccionIncompleta : boolean = false;

    //Subasta
    public fechaFinInscripcion       : any;
    public fechaFinOfertas           : any;
    public fechaInicioOfertas        : any;
    public mostrarInfoSubasta        : boolean = false;
    public puedeModificarInscripcion : boolean = false;
    public subastaId                 : any;

    //Financiacion
    public mostrarFinanciacion     : boolean = false;
    public mostarErrorFinanciacion : boolean = false;

    @ViewChild('archivos')
    private archivos!: ArchivosComponent;

    @ViewChild('modelosField')
    public modelosField! : ServerAutocompleteFieldComponent

    constructor(
        private authService : AuthService,
        private dialog      : MatDialog,
        public  deviceService      : DeviceService,
        private route       : ActivatedRoute,
        private router      : Router,
        public  userService : UserService,
        private utils       : Utils,
    ) {
        super();
    }

    protected get dataUrl(): string {
        return "/publicaciones/*/mis-publicaciones";
    }

    public async ngOnInit(): Promise<void> {
        this.createForm();
        this.completarDatosUsuario();
        this.publicacionData = await this.apiService.getData("/publicaciones/*/mis-publicaciones/opciones-formulario",{})
        this.getValorMinimo();
        this.route.params.subscribe(async (params) => {
            await this.spinnerService.go(async () => {
                await this.getColores();
                await this.getCombustibles();
                await this.fetchMarcas();
                if (params.id) {
                    this.publicacion = await this.obtenerYCompletar(params.id);
                    if(this.form.get('financiacion')?.value===1){
                        this.form.get('financiacion')?.setValue(true);
                    }
                    this.archivos.archivos = (this.form.get('multimedia')?.value as any[]).map((item: any, index) => {
                        let preview = new Preview(new Multimedia(item.id, item.url, item.type));
                        if (item.es_portada === 'SI') {
                            preview.esPortada = true;
                            this.form.patchValue({portada_index: index});
                        }
                        return preview;
                    });
                    this.verificarSimboloPrecio();
                    this.buscarPrecioSugerido(this.publicacion.codia, this.publicacion.año);
                    if(this.publicacion.financiacion){
                        this.mostrarFinanciacion = this.publicacion.financiacion;
                    }
                    else{
                        let {financiable} = await this.apiService.get('/financiacion/verificar',{
                            brand_name : this.publicacion.marca,
                            model_name : this.publicacion.modelo,
                            year       : this.publicacion.año,
                        }).toPromise();
                        if(financiable){
                            this.mostrarFinanciacion = true;
                        }
                    }
                }
                else {
                    this.configurarCamposMarcaAnioModelo();
                }

                this.route.queryParams.subscribe(async (queryParams) => {
                    if (queryParams['inscribir_subasta_id']) {
                        this.form.get('subasta_id')?.setValue(queryParams['inscribir_subasta_id']);
                        console.log(this.form.get('subasta_id')?.value);
                        this.mostrarInfoSubasta = true;
                        this.form.get('incluirEnSubasta')?.setValue(true);
                        await this.verificarSubastas();
                    }
                    else{
                        this.evaluarEstadoDatosSubasta();
                    }

                });
            });
        });
        this.deviceService.observe((result:boolean) => {
            this.isMobile = result;
         });

        if (this.userService.getUser()?.rol_id === 3) {
            this.esParticular = true;
        }
    }

    public evaluarEstadoDatosSubasta() {
        if (this.publicacion?.subasta) {
            const subasta = this.publicacion.subasta;
            this.mostrarInfoSubasta = true;
            this.form.get('incluirEnSubasta')?.setValue(true);
            this.form.get('subasta_id')?.setValue(subasta.id);
            this.fechaFinInscripcion = formatDate(subasta.fecha_fin_inscripcion, 'dd/MM/yyyy', 'en-US');
            this.fechaInicioOfertas  = formatDate(subasta.fecha_inicio_ofertas,  'dd/MM/yyyy', 'en-US');
            this.fechaFinOfertas     = formatDate(subasta.fecha_fin_ofertas,     'dd/MM/yyyy', 'en-US');
            if(this.publicacion.ofertas_ultima_oferta){
                this.puedeModificarInscripcion = false;
                this.form.get('precio_base')?.disable();
            }
            else{
                this.puedeModificarInscripcion = true;
                this.form.get('precio_base')?.enable();
            }
        }
        else {
            this.verificarSubastas();
            this.form.get('precio_base')?.disable();
        }
    }

    public incluirEnSubastaChange() {
        let value = this.form.get('incluirEnSubasta')?.value;

        if(value === true){
            this.form.patchValue({subasta_id: this.subastaId});
            this.form.get('precio_base')?.enable();
        }else{
            this.form.patchValue({subasta_id: null, precio_base: null});
            this.form.get('precio_base')?.disable();
        }
    }

    private createForm() : void {
        this.addControls({
            brand_id            : new FormControl({ value: '',      disabled: false }),
            codia               : new FormControl({ value: '',      disabled: false }),
            año                 : new FormControl({ value: '',      disabled: false }),
            color               : new FormControl({ value: '',      disabled: false }),
            condicion           : new FormControl({ value: '',      disabled: false }),
            descripcion         : new FormControl({ value: '',      disabled: false }),
            kilometros          : new FormControl({ value: '',      disabled: false }),
            marca               : new FormControl({ value: '',      disabled: false }),
            modelo              : new FormControl({ value: '',      disabled: false }),
            moneda              : new FormControl({ value: 'Pesos', disabled: false }),
            precio              : new FormControl({ value: '',      disabled: false }),
            puertas             : new FormControl({ value: '',      disabled: false }),
            telefono            : new FormControl({ value: '',      disabled: false }),
            tipo_combustible_id : new FormControl({ value: '',      disabled: false }),
            direccionCompleta   : new FormControl({ value: '',      disabled: false }),
            multimedia          : new FormControl({ value: '',      disabled: false }),
            portada_index       : new FormControl({ value: '',      disabled: false }),
            monedaPrecioEsperado: new FormControl({ value: 'Pesos', disabled: false }),
            precioEsperado      : new FormControl({ value: '',      disabled: false }),
            monedaPrecioSugerido: new FormControl({ value: 'Pesos', disabled: false }),
            precioSugerido      : new FormControl({ value: '',      disabled: false }),
            incluirEnSubasta    : new FormControl({ value: false,   disabled: false }),
            precio_base         : new FormControl({ value: '',      disabled: false }),
            subasta_id          : new FormControl({ value: '',      disabled: false }),
            financiacion        : new FormControl({ value: false,   disabled: false }),
            dominio             : new FormControl({ value: '',      disabled: false }),
            provincia_id        : new FormControl({ value: '',      disabled: false }),
            placeId             : new FormControl({ value: '',      disabled: false }),
            codigo_postal       : new FormControl({ value: '',      disabled: false }),
            calle               : new FormControl({ value: '',      disabled: false }),
            numero              : new FormControl({ value: '',      disabled: false }),
            localidad           : new FormControl({ value: '',      disabled: false }),
            provincia           : new FormControl({ value: '',      disabled: false }),
            latitud             : new FormControl({ value: '',      disabled: false }),
            longitud            : new FormControl({ value: '',      disabled: false }),
        });
    }

    private completarDatosUsuario() : void {
        this.user = this.userService.getUser();
        this.form.patchValue({
            calle             : this.user?.calle,
            numero            : this.user?.numero,
            provincia         : this.user?.provincia,
            localidad         : this.user?.localidad,
            codigo_postal     : this.user?.codigo_postal,
            latitud           : this.user?.latitud,
            longitud          : this.user?.longitud,
            direccionCompleta : this.user?.direccionCompleta,
        });

        if(this.user?.rol_id === 3){
            let telefono = this.user.telefono;
            if (telefono && telefono !== "") {
                this.form.get('telefono')?.setValue(telefono);
            }
            this.editPhone = true;

        } else {
            let telefono = this.user?.onboarding_user?.business?.marketplace_phone;
            if (telefono && telefono !== "") {
                this.form.get('telefono')?.setValue(telefono.replace(/ /g, ""))
            } else {
                this.enabledSubmit = false;
                this.mostrarMensajeTelefonoAgencia = true;
            }
        }
    }

    private generarAnios(desde: number, hasta: number){
        let anios : number[] = []
        for (let index = desde; index < hasta+1; index++) {
            anios.push(index);
        }

        anios.sort((a: any, b: any) => {
            return b - a;
        });

        return anios.map((i) => {
            return {
                id: i,
                name: i,
            }
        });
    }

    private async buscarPrecioSugerido(codia: number, anio: number) {
        this.precioSugeridoNoDisponible = false;

        try {
            this.apiService.mostrarMensajes = false;
            let valor = await this.apiService.getData('/vehiculos/precioSugerido', {
                codia  : codia,
                anio   : anio,
            });
            this.precioSugerido = this.utils.formatNumero(valor.toString() || '');
        } catch (e) {
            this.precioSugeridoNoDisponible = true;
        } finally {
            this.apiService.mostrarMensajes = true;
        }

    }

    private async getColores() : Promise<void> {
        this.colores = this.publicacionData.colores;
    }

    private async getCombustibles() : Promise<void> {
        this.combustibles = this.publicacionData.tipos_combustible;
    }

    private async fetchMarcas(): Promise<void> {
        this.marcas = this.publicacionData.marcas;
    }

    public alCambiarArchivos(data: Preview[]) {

        let portadaIndex = 0;
        this.archivos.archivos.map((preview: Preview, index: number) => {
            if (preview.esPortada) {
                portadaIndex = index;
            }
        }),
        this.form.patchValue({
            multimedia    : data.map(i => i.original),
            portada_index : portadaIndex,
        });
    }

    public getFormData(): any {
        let formData = super.getFormData();
        // transformo el número en algo que se pueda enviar.
        ['precio', 'precio_base','kilometros'].map((nombre) => {
            formData[nombre] = String(formData[nombre]).replace(/\./g, '').replace(',', '.');
        });
        return formData;
    }

    protected actualizar(): Promise<any> {
        return this.apiService.post(this.getDataUrl() + '/' + this.id + '/actualizar', this.getFormData());
    }

    public configurarCamposMarcaAnioModelo() : void {
        this.form.get('brand_id')?.valueChanges.subscribe((value)=>{
            this.mostrarFinanciacion = false;
            this.form.get('financiacion')?.setValue(false);
            //Esta variable habilita el campo año
            this.habilitarAnio = false;
            this.form.get('codia')?.setValue(null);
            this.form.get('año')?.setValue(null);
            this.marcas.filter((marca: any) => marca.id === value).map((marca: any) => {
                this.years = this.generarAnios(marca.prices_from, marca.prices_to);
                console.log('this.years', this.years);
            });
            this.modelosField.clearList();
        })
        // Codigo para habilitar el campo de modelo
        this.form.get('año')?.valueChanges.subscribe((value)=>{
            this.mostrarFinanciacion = false;
            this.form.get('financiacion')?.setValue(false);
            this.form.patchValue({"codia": ""});
            if(value){
                this.habilitarModelo = false;
            }else{
                this.habilitarModelo = true;
            }
        });

        this.form.get('codia')?.valueChanges.subscribe(async (value:any) => {
            this.modelosField.data = [];
            this.form.get('financiacion')?.setValue(false);
            this.mostrarFinanciacion = false;
            if (!value) {
                return;
            }
            this.validarFinanciacion();
            let anio = this.form.get('año' )?.value;
            this.buscarPrecioSugerido(value, anio);
        });
    }

    public onFetchModelos(event : any) : void {
        this.modelos = event;
    }

    private async validarFinanciacion() : Promise<void> {
        let codia = this.form.get('codia')?.value;
        let [modelo] = this.modelos.filter(element => element.codia === codia );
        let {financiable} = await this.apiService.get('/financiacion/verificar',{
            brand_name : modelo.brand.name,
            model_name : modelo.description,
            year  : this.form.get('año')?.value,
        }).toPromise();
        if(!financiable){
            this.mostrarFinanciacion = false;
            return;
        }
        if(!this.userService.esAgencia()){
            this.mostrarFinanciacion = false;
            return;
        }
        this.mostrarFinanciacion = true;
    }

    public verificarCantidadImagenes(): boolean {
        let cantidad = 0;
        //Recorro para ir sumando la cantidad de archivos que son imagenes
        for(let i=0;i < this.archivos.archivos.length; i=i+1){
            if(this.archivos.archivos[i].type === 'image'){
                //Si es imagen se suman para la posterior validacion
                cantidad++;
            }
        }
        return cantidad >= 4;
    }

    public async submit() : Promise<void> {
        let puedeEnvar = true;
        if (!this.verificarCantidadImagenes()) {
            this.archivos.error = ('Debe subir al menos 4 fotos');
            puedeEnvar = false;
        }
        if(this.validarDireccionIncompleta){
            if(!this.form.get('provincia')?.value){
                this.form.get('provincia')?.setErrors({error:'Obligatorio'});
            }
            else{
                this.form.get('provincia')?.setErrors(null);
            }
            if(!this.form.get('codigo_postal')?.value){
                this.form.get('codigo_postal')?.setErrors({error:'Obligatorio'});
            }
            else{
                this.form.get('codigo_postal')?.setErrors(null);
            }

            this.form.get('calle' )?.markAsTouched();
            this.form.get('numero')?.markAsTouched();
        }
        
        if (!this.form?.get('direccionCompleta')?.value || this.form?.get('direccionCompleta')?.value === '') {
            this.setErrors({direccionCompleta:['Ingrese una dirección válida']});
            puedeEnvar = false;
        }

        if(!this.userService.esAgenciaReady() && this.form.get('incluirEnSubasta')?.value){
            this.dialog.open(SubastasOnboardingDialogComponent,  {
                disableClose : false,
                autoFocus    : true,
            });
            puedeEnvar = false;
        }

        this.mostarErrorFinanciacion = false;
        if(!this.mostrarFinanciacion){
            this.form.get('financiacion')?.setValue(false);
        }
        if(this.form.get('incluirEnSubasta')?.value && this.form.get('financiacion')?.value){
            this.mostarErrorFinanciacion = true;
            puedeEnvar = false;
        }

        if (!puedeEnvar) {
            return;
        }

        if(this.form.valid){
            this.spinnerService.go(async () => {
                try {
                    await this.enviarDatos(true);
                } catch (error) {
                    if (error instanceof HttpErrorResponse) {
                        if(error.status === 422){
                            if(error.error.errors.hasOwnProperty('localidad') || error.error.errors.hasOwnProperty('numero')){
                                this.setErrors({direccionCompleta: 'Ingrese una dirección valida'});
                            }
                        }
                        if (error.status === 0) {
                            this.snackbarService.show('Ocurrió un error inesperado. Intente subir menos archivos, o que no superen los 10 MB', 6000);
                        }
                        if (error.status === 413) {
                            this.snackbarService.show('Fotos y o videos demasiado grandes. Intente subir menos archivos, o que no superen los 10 MB', 6000);
                        }
                    }
                    throw error;
                }
                if (this.id) {
                    this.snackbarService.show('Publicación actualizada');
                } else {
                    this.snackbarService.show('Publicación creada con éxito');
                }
                if(this.userService.getUser()?.rol_id === 3){
                  this.snackbarService.showLonger('Publicación creada con éxito. Recordá que tu publicación solo será visualizada por agencias, ¡que van a hacerte la mejor oferta! ¡Buena Venta!')
                }
                this.authService.getCurrentUser();
                this.router.navigateByUrl('/publicaciones/mis-publicaciones');
            });
        }

    }

    private async getValorMinimo() : Promise<void> {
        this.valorMinimo =  this.publicacionData.precio_minimo;

    }

    public validarPrecio() : void {
        let valorMinimo = this.valorMinimo[this.form.get('moneda')?.value];
        let precio = this.utils.quitarPuntos(this.form.get('precio')?.value);

        if( parseInt(precio) < valorMinimo ) {
            this.form.get('precio')?.setErrors({precio: 'El precio mínimo es ' + this.utils.formatNumero(valorMinimo.toString()) });
        }
    }

    public cambioMoneda() : void {
        if(this.form.get('precio')?.value){
            this.form.get('precio')?.setErrors(null);
            this.validarPrecio();
        }
    }

    public validarKm() : void {
        let valorMaximo = 2147483647;
        let kms = this.utils.quitarPuntos(this.form.get('kilometros')?.value);
        if( parseInt(kms) > valorMaximo ) {
            this.form.get('kilometros')?.setErrors({kilometros: 'El valor máximo permitido es ' + this.utils.formatNumero(valorMaximo.toString())});
        }
    }

    public onArchivosErrorChange() {
        this.enabledSubmit = this.archivos.error === '';
    }

    public async verificarSubastas (){
        const subastaDisponible = await this.apiService.getData('/subastas/*/disponible');

        // NO TOCAR ESTE IF.
        // Cuando no hay subasta disponible, viene un array
        if (!subastaDisponible.id) {

            // Si no hay subasta, se rompe el código de abajo por tanto
            // cortamos acá.
            return;
        }

        this.subastaId = subastaDisponible.id

        this.fechaFinInscripcion = formatDate(subastaDisponible.fecha_fin_inscripcion, 'dd/MM/yyyy', 'en-US');
        this.fechaInicioOfertas  = formatDate(subastaDisponible.fecha_inicio_ofertas,  'dd/MM/yyyy', 'en-US');
        this.fechaFinOfertas     = formatDate(subastaDisponible.fecha_fin_ofertas,     'dd/MM/yyyy', 'en-US');
        if(subastaDisponible.puede_inscribir === true){
            this.mostrarInfoSubasta        = true;
            this.puedeModificarInscripcion = true
        }
    }

    public verificarSimboloPrecio() {
        if(this.publicacion.moneda === 'Pesos'){
            this.simboloMoneda = '$'
        }else{
            this.simboloMoneda = 'U$S'
        }
    }

    public verificarAgencia(){
        if(!this.userService.esAgenciaReady()){
            setTimeout(()=>{
                this.form.get('financiacion')?.setValue(false);
            })
            this.financiacionDialog();
        }
    }

    public financiacionDialog() :Observable<void> {
        return this.dialog.open(FinanciacionDialogComponent, {
            disableClose: false,
            autoFocus: true,
          }).componentInstance.confirm;
    }

    public dominioKeydown(event : any) : any {
        const key = event.key;
        const regxp = /^([a-zA-Z0-9]){1,16}$/;
        if(regxp.test(key) && key !== 'ñ' && key !== 'Ñ'){
        }
        else{
            return false;
        }
    }

    public scrollDownDropBox(){
        if(!this.isMobile){
            if(window.scrollY < 210){
                window.scrollTo(0,320)
            }
        }
    }

    public alElegirDireccionIncompleta() : void {
        this.validarDireccionIncompleta = true;
    }

}
