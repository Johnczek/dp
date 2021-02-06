import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserControllerService} from '../../api/services/user-controller.service';
import {JwtResponse, LoginRequest} from '../../api/models';
import {finalize} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {StrictHttpResponse} from '../../api/strict-http-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginFormSubmitting = false;

  loginForm: FormGroup;

  loginRequestSubscription: Subscription;

  constructor(public userControllerService: UserControllerService) {
  }

  ngOnDestroy(): void {
    if (this.loginRequestSubscription) {
      this.loginRequestSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.initLoginForm();
  }

  private initLoginForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('admin@admin.com', [Validators.required, Validators.email]),
      password: new FormControl('admin', Validators.required)
    });

    // TODO remember me handling
  }

  onLoginFormSubmit(): void {
    this.loginFormSubmitting = true;
    const loginRequest: LoginRequest = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    };

    this.loginRequestSubscription = this.userControllerService.login$Response({body: loginRequest})
      .pipe(
        finalize(() => this.loginFormSubmitting = false),
      )
      .subscribe((response: StrictHttpResponse<JwtResponse>) => {
        const content: JwtResponse = response.body;

        // TODO complete login
      });
  }
}
