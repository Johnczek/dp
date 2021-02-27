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
import {AlertComponent} from './alert/alert.component';
import {ItemListComponent} from './item/item-list/item-list.component';
import {ItemDetailComponent} from './item/item-detail/item-detail.component';
import {ItemPreviewComponent} from './item/item-preview/item-preview.component';
import { MyItemComponent } from './account/my-item/my-item.component';
import { MyAllItemsComponent } from './account/my-item/my-all-items/my-all-items.component';
import { MyItemEditComponent } from './account/my-item/my-item-edit/my-item-edit.component';
import { NewItemComponent } from './account/my-item/new-item/new-item.component';
import { CartComponent } from './account/cart/cart.component';
import { OrdersComponent } from './account/orders/orders.component';
import { OrderCreateComponent } from './account/order-create/order-create.component';
import { OrderDetailComponent } from './account/order-detail/order-detail.component';
import { CartItemPreviewComponent } from './account/cart/cart-item-preview/cart-item-preview.component';
import { CartItemDetailComponent } from './account/cart/cart-item-detail/cart-item-detail.component';

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
    AccountGeneralComponent,
    AlertComponent,
    ItemListComponent,
    ItemDetailComponent,
    ItemPreviewComponent,
    MyItemComponent,
    MyAllItemsComponent,
    MyItemEditComponent,
    NewItemComponent,
    CartComponent,
    OrdersComponent,
    OrderCreateComponent,
    OrderDetailComponent,
    CartItemPreviewComponent,
    CartItemDetailComponent,
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
