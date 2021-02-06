import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserControllerService} from '../../api/services/user-controller.service';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {StrictHttpResponse} from '../../api/strict-http-response';
import {RegisterRequest} from '../../api/models/register-request';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  public passwordMinLength = 5;

  registerFormSubmitting = false;

  registerForm: FormGroup;

  registerRequestSubscription: Subscription;

  constructor(public userControllerService: UserControllerService) {
  }

  ngOnDestroy(): void {
    if (this.registerRequestSubscription) {
      this.registerRequestSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.initRegisterForm();
  }

  private initRegisterForm(): void {

    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(this.passwordMinLength)]),
      passwordRepeat: new FormControl('', [Validators.required]),
      description: new FormControl('')
    }, {validators: [this.passwordsMatching]});

    this.registerForm.valueChanges.subscribe(() => {
      console.log(this.registerForm);
    });
  }

  onRegisterFormSubmit(): void {
    this.registerFormSubmitting = true;
    const registerRequest: RegisterRequest = {
      firstName: this.registerForm.get('firstName').value,
      lastName: this.registerForm.get('lastName').value,
      email: this.registerForm.get('email').value,
      password: this.registerForm.get('password').value,
      description: this.registerForm.get('description').value,
    };

    this.registerRequestSubscription = this.userControllerService.register$Response({body: registerRequest})
      .pipe(
        finalize(() => this.registerFormSubmitting = false),
      )
      .subscribe((response: StrictHttpResponse<string>) => {
        // TODO complete register
      });
  }

  private passwordsMatching(c: AbstractControl): { passwordMismatch: boolean } {
    if (c.get('password').value !== c.get('passwordRepeat').value) {
      return {passwordMismatch: true};
    }
  }
}
