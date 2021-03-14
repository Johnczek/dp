import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserControllerService} from '../../api/services/user-controller.service';
import {JwtResponse, LoginRequest} from '../../api/models';
import {finalize, takeUntil} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import {StrictHttpResponse} from '../../api/strict-http-response';
import {UserService} from '../../service/user.service';
import {AlertService} from '../../service/alert.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginFormSubmitting = false;

  loginForm: FormGroup;

  ngUnsubscribe = new Subject();


  constructor(
    public router: Router,
    public alertService: AlertService,
    public userService: UserService) {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe?.unsubscribe();
  }

  ngOnInit(): void {
    this.initLoginForm();
  }

  private initLoginForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('admin@admin.com', [Validators.required, Validators.email]),
      password: new FormControl('admin', Validators.required)
    });
  }

  onLoginFormSubmit(): void {
    this.loginFormSubmitting = true;
    const loginRequest: LoginRequest = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    };

    this.userService.login({body: loginRequest})
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.loginFormSubmitting = false),
      )
      .subscribe(() => {
          this.alertService.success('Přihlášení proběhlo úspěšně');
          this.router.navigate(['/']);
        });
  }
}
