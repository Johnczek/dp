import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HeaderComponent} from './common/header/header.component';
import {FooterComponent} from './common/footer/footer.component';
import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './user/login/login.component';
import {HomepageComponent} from './homepage/homepage.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RegisterComponent} from './user/register/register.component';
import {UserProfileComponent} from './user/user-profile/user-profile.component';
import {AccountComponent} from './account/account.component';
import {ChangePasswordComponent} from './account/change-password/change-password.component';
import {BankAccountComponent} from './account/bank-account/bank-account.component';
import {AddressComponent} from './account/address/address.component';
import {AccountGeneralComponent} from './account/account-general/account-general.component';
import {authInterceptorProviders} from './interceptor/http-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    HomepageComponent,
    RegisterComponent,
    UserProfileComponent,
    AccountComponent,
    ChangePasswordComponent,
    BankAccountComponent,
    AddressComponent,
    AccountGeneralComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
