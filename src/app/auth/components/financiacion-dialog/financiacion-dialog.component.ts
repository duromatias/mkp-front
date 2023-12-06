import { Component, OnInit } from '@angular/core';
import { environment        } from 'src/environments/environment';
import { EventEmitter       } from '@angular/core';
import { MatDialogRef       } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-financiacion-dialog',
  templateUrl: './financiacion-dialog.component.html',
  styleUrls: ['./financiacion-dialog.component.scss']
})
export class FinanciacionDialogComponent implements OnInit {

  public confirm : EventEmitter<void> = new EventEmitter<void>();
  public reject  : EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public  dialogRef : MatDialogRef<FinanciacionDialogComponent>,
    private router : Router,
    private userService : UserService,
  ) { }

  ngOnInit(): void {
  }

    public clickConfirm() : void {
        location.href = `${environment.onboardingUrl}/registro?token=${this.userService.getOnBoardingAccessToken()}`;
        this.dialogRef.close();
        this.confirm.emit();
    }

    public clickReject() : void {
        this.dialogRef.close();
        this.reject.emit();
    }
}
