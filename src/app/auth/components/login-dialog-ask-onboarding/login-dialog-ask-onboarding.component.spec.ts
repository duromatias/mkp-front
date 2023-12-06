import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDialogAskOnboardingComponent } from './login-dialog-ask-onboarding.component';

describe('LoginDialogAskOnboardingComponent', () => {
  let component: LoginDialogAskOnboardingComponent;
  let fixture: ComponentFixture<LoginDialogAskOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginDialogAskOnboardingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDialogAskOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
