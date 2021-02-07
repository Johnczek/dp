import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UserControllerService} from '../../api/services/user-controller.service';
import {StrictHttpResponse} from '../../api/strict-http-response';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  passwordMinLength = 5;

  changePasswordFormSubmitting = false;

  changePasswordForm: FormGroup;

  changePasswordFormSubscription: Subscription;

  constructor(public userControllerService: UserControllerService) {
  }

  ngOnDestroy(): void {
    if (this.changePasswordFormSubscription) {
      this.changePasswordFormSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.initChangePasswordForm();
  }

  private initChangePasswordForm(): void {

    this.changePasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(this.passwordMinLength)]),
      passwordRepeat: new FormControl('', [Validators.required]),
    }, {validators: [this.passwordsMatching]});

    this.changePasswordForm.valueChanges.subscribe(() => {
      console.log(this.changePasswordForm);
    });
  }

  // TODO complete password change
  onchangePasswordFormSubmit(): void {
    this.changePasswordFormSubmitting = true;

    this.changePasswordFormSubscription = this.userControllerService.updateUserPassword$Response({
      id: 1,
      body: {
        password: this.changePasswordForm.get('password').value
      }
    })
      .pipe(finalize(() => this.changePasswordFormSubmitting = false))
      .subscribe((response: StrictHttpResponse<string>) => {
        console.log(response);
      });
  }

  // TODO move into custom validator class
  private passwordsMatching(c: AbstractControl): { passwordMismatch: boolean } {
    if (c.get('password').value !== c.get('passwordRepeat').value) {
      return {passwordMismatch: true};
    }
  }

}
