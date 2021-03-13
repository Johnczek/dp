import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UserControllerService} from '../../api/services/user-controller.service';
import {StrictHttpResponse} from '../../api/strict-http-response';
import {finalize} from 'rxjs/operators';
import {UserService} from '../../service/user.service';
import {JwtResponse} from '../../api/models/jwt-response';
import {AlertService} from '../../service/alert.service';
import {Router} from '@angular/router';

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

  constructor(
    public router: Router,
    public alertService: AlertService,
    public userService: UserService,
    public userControllerService: UserControllerService) {
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

    const loggedUser: JwtResponse = this.userService.getLoggedUser();
    if (loggedUser == null) {
      this.alertService.error('Uživatel nepřihlášen');
      this.router.navigate(['/login']);
    }

    this.changePasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(this.passwordMinLength)]),
      passwordRepeat: new FormControl('', [Validators.required]),
    }, {validators: [this.passwordsMatching]});
  }

  // TODO complete password change
  onchangePasswordFormSubmit(): void {
    this.changePasswordFormSubmitting = true;

    this.changePasswordFormSubscription = this.userService.changePassword(this.changePasswordForm.get('password').value)
      .pipe(finalize(() => this.changePasswordFormSubmitting = false))
      .subscribe(() => {
        this.alertService.success('Heslo bylo úspěšně změněno');
      }, () => {
        this.alertService.error('Nebylo možné změnit heslo');
      });
  }

  // TODO move into custom validator class
  private passwordsMatching(c: AbstractControl): { passwordMismatch: boolean } {
    if (c.get('password').value !== c.get('passwordRepeat').value) {
      return {passwordMismatch: true};
    }
  }

}
