import { Injectable, NgModule } from "@angular/core";
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from "@angular/material/snack-bar";

@Injectable()
@NgModule()
export class SnackBarService {

    public constructor(
        private _snackBar: MatSnackBar
    ) { }

    public show(message: string, duration: number = 2000): MatSnackBarRef<SimpleSnackBar> {
        return this._snackBar.open(message, 'Ok', {
            duration: duration,
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
        });
    }

    public showLonger(message: string, duration: number = 4000): MatSnackBarRef<SimpleSnackBar> {
      return this._snackBar.open(message, 'Ok', {
          duration: duration,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
      });
  }
}
