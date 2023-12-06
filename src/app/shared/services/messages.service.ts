import { Observable       } from "rxjs";
import { Injectable, NgModule       } from "@angular/core";
import { MatDialog,       } from '@angular/material/dialog';
import { MessageComponent } from "../message/message.component";

@Injectable()
@NgModule()
export class MessagesService {

    public constructor(
        private dialog: MatDialog,
    ) { }

    public show(message: string): Observable<void> {
        return this.dialog.open(MessageComponent,  {
            disableClose : false,
            autoFocus    : true,
            data         : { 
                message: message,
            }
        }).afterClosed();
    }
}