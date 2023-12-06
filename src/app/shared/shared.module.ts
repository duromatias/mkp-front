// App libraries
import { ListadoDataSource } from './components/listado.datasource';
import { RouteGuard        } from '../auth/guards/route.guard';

// App Services
import { ApiService             } from './services/api.service';
import { BearerTokenInterceptor } from './interceptors/bearer-token.interceptor';
import { ConfirmService         } from './services/confirm.service';
import { DeviceService          } from './services/device.service';
import { MessagesService        } from './services/messages.service';
import { SnackBarService        } from './services/snack-bar.service';
import { SpinnerService         } from './services/spinner.service';

// Angular
// Core
import { ModuleWithProviders } from '@angular/core';
import { NO_ERRORS_SCHEMA    } from '@angular/core';
import { NgModule            } from '@angular/core';

// Others
import { HTTP_INTERCEPTORS   } from '@angular/common/http';
import { CustomPaginator     } from './components/CustomPaginatorConfiguration';
import { MatPaginatorIntl    } from '@angular/material/paginator';

// Modules
import { ClipboardModule     } from 'ngx-clipboard';
import { CommonModule        } from '@angular/common';
import { FlexLayoutModule    } from '@angular/flex-layout';
import { FormsModule         } from '@angular/forms';
import { MatTabsModule       } from '@angular/material/tabs';
import { NgScrollbarModule   } from 'ngx-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule        } from '@angular/router';


// Material
import { MatAutocompleteModule    } from '@angular/material/autocomplete';
import { MatBadgeModule           } from '@angular/material/badge';
import { MatButtonModule          } from '@angular/material/button';
import { MatCardModule            } from '@angular/material/card';
import { MatCheckboxModule        } from '@angular/material/checkbox';
import { MatChipsModule           } from '@angular/material/chips';
import { MatDialogModule          } from '@angular/material/dialog';
import { MatDividerModule         } from '@angular/material/divider';
import { MatFormFieldModule       } from '@angular/material/form-field';
import { MatIconModule            } from '@angular/material/icon';
import { MatInputModule           } from '@angular/material/input';
import { MatListModule            } from '@angular/material/list';
import { MatMenuModule            } from '@angular/material/menu';
import { MatPaginatorModule       } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule           } from '@angular/material/radio';
import { MatRippleModule          } from '@angular/material/core';
import { MatSelectModule          } from '@angular/material/select';
import { MatSidenavModule         } from '@angular/material/sidenav';
import { MatSnackBarModule        } from '@angular/material/snack-bar';
import { MatSlideToggleModule     } from '@angular/material/slide-toggle';
import { MatTableModule           } from '@angular/material/table';
import { MatToolbarModule         } from '@angular/material/toolbar';

// App Components
import { AutocompleteComponent             } from './components/autocomplete/autocomplete.component';
import { AutocompleteFieldComponent        } from './components/autocomplete/autocomplete-field.component';
import { CarouselComponent                 } from './components/carousel/carousel.component';
import { ConfirmComponent                  } from './components/confirm/confirm.component';
import { ConstruccionComponent             } from './components/construccion/construccion.component';
import { FileUploadButtonComponent         } from './components/file-upload-button/file-upload-button.component';
import { FooterDesktopComponent            } from './components/footer/desktop/footer-desktop.component';
import { FooterMobileComponent             } from './components/footer/mobile/footer-mobile.component';
import { LayoutBaseComponent               } from './components/layout/base/layout-base.component';
import { LayoutGeneralComponent            } from './components/layout/general/layout-general.component';
import { LayoutListadoComponent            } from './components/layout/listado/layout-listado.component';
import { LogoKodearComponent               } from './components/logo-kodear/logo-kodear.component';
import { MenuDesktopComponent              } from './components/menu/desktop/menu-desktop.component';
import { MenuMobileComponent               } from './components/menu/mobile/menu-mobile.component';
import { NumberInputComponent              } from './components/number-input/component';
import { SearchInputComponent              } from './components/search-input/search-input.component';
import { SelectInputComponent              } from './components/select-input/component';
import { ServerAutocompleteComponent       } from './components/autocomplete/server-autocomplete.component';
import { ServerAutocompleteFieldComponent  } from './components/autocomplete/server-autocomplete-field.component';
import { SpinnerComponent                  } from './components/spinner/spinner.component';
import { TextareaInputComponent            } from './components/textarea-input/component';
import { TextInputComponent                } from './components/text-input/component';
import { ToolbarComponent                  } from './components/toolbar/toolbar.component';
import { DataSheetComponent                } from './components/data-sheet/data-sheet.component';

// Directivas
import { InputNumericDirective             } from './input-numeric.directive';
import { AnweTabRedirectDirective          } from './a-new-tab-redirect.directive';
import { VideoPlayerComponent              } from './components/video-player/video-player.component';
import { TableComponent                    } from './components/table/table.component';
import { BotonCompartirComponent           } from './components/boton-compartir/boton-compartir.component';
import { NetworksComponent                 } from './components/networks/networks.component';
import { ModalComponent                    } from './components/modal/modal.component';
import { BalloonsMotionService             } from './services/balloons-motion-service';
import { DireccionAutocompleteComponent    } from './components/direccion-autocomplete/direccion-autocomplete.component';
import { MessageDialogComponent } from './components/message-dialog/message-dialog.component';
import { DireccionComponent } from './components/direccion/direccion.component';



@NgModule({
    providers: [
        SpinnerService,
    ],
    declarations: [
        AutocompleteComponent,
        AutocompleteFieldComponent,
        CarouselComponent,
        ConfirmComponent,
        ConstruccionComponent,
        DataSheetComponent,
        DireccionComponent,
        FooterDesktopComponent,
        FooterMobileComponent,
        InputNumericDirective,
        AnweTabRedirectDirective,
        LayoutBaseComponent,
        LayoutGeneralComponent,
        LayoutListadoComponent,
        LogoKodearComponent,
        MenuDesktopComponent,
        MenuMobileComponent,
        ModalComponent,
        NumberInputComponent,
        SearchInputComponent,
        SelectInputComponent,
        ServerAutocompleteComponent,
        SpinnerComponent,
        TextareaInputComponent,
        TextInputComponent,
        ToolbarComponent,
        ServerAutocompleteFieldComponent,
        VideoPlayerComponent,
        TableComponent,
        BotonCompartirComponent,
        NetworksComponent,
        FileUploadButtonComponent,
        DireccionAutocompleteComponent,
        MessageDialogComponent,
    ],
    imports: [
        ApiService,
        BalloonsMotionService,
        ClipboardModule,
        CommonModule,
        ConfirmService,
        FlexLayoutModule,
        FormsModule,
        MatAutocompleteModule,
        MatDialogModule,
        MatBadgeModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatTabsModule,
        MatTableModule,
        MatToolbarModule,
        MatSelectModule,
        MatSlideToggleModule,
        NgScrollbarModule,
        ReactiveFormsModule,
        RouterModule,
        SnackBarService,
    ],
    exports: [
        ApiService,
        BalloonsMotionService,
        ConfirmService,
        CommonModule,
        DataSheetComponent,
        DeviceService,
        FormsModule,
        FlexLayoutModule,
        MatBadgeModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDialogModule,
        MatDividerModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        MatTabsModule,
        MatTableModule,
        MessagesService,
        NgScrollbarModule,
        ReactiveFormsModule,
        SnackBarService,
        SpinnerService,
        VideoPlayerComponent,
        FileUploadButtonComponent,

        //Components
        AutocompleteComponent,
        AutocompleteFieldComponent,
        BotonCompartirComponent,
        CarouselComponent,
        DireccionAutocompleteComponent,
        DireccionComponent,
        LayoutBaseComponent,
        LayoutGeneralComponent,
        LayoutListadoComponent,
        ModalComponent,
        NumberInputComponent,
        NetworksComponent,
        SearchInputComponent,
        SelectInputComponent,
        ServerAutocompleteComponent,
        ServerAutocompleteFieldComponent,
        SpinnerComponent,
        TableComponent,
        TextareaInputComponent,
        TextInputComponent,
        ToolbarComponent,


        //Directivas
        InputNumericDirective,
        AnweTabRedirectDirective,
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
    ]

})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                [
                    {
                        provide: HTTP_INTERCEPTORS,
                        useClass: BearerTokenInterceptor,
                        multi: true
                    }
                ],
                ListadoDataSource,
                RouteGuard,
                { provide: MatPaginatorIntl, useValue: CustomPaginator() },
            ]
        }
    }
}
