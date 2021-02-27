import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {RegisterComponent} from './user/register/register.component';
import {UserProfileComponent} from './user/user-profile/user-profile.component';
import {AccountComponent} from './account/account.component';
import {ChangePasswordComponent} from './account/change-password/change-password.component';
import {BankAccountComponent} from './account/bank-account/bank-account.component';
import {AddressComponent} from './account/address/address.component';
import {AccountGeneralComponent} from './account/account-general/account-general.component';
import {ItemListComponent} from './item/item-list/item-list.component';
import {ItemDetailComponent} from './item/item-detail/item-detail.component';
import {MyItemComponent} from './account/my-item/my-item.component';
import {MyAllItemsComponent} from './account/my-item/my-all-items/my-all-items.component';
import {NewItemComponent} from './account/my-item/new-item/new-item.component';
import {MyItemEditComponent} from './account/my-item/my-item-edit/my-item-edit.component';
import {CartComponent} from './account/cart/cart.component';
import {CartItemDetailComponent} from './account/cart/cart-item-detail/cart-item-detail.component';
import {OrdersComponent} from './account/orders/orders.component';
import {OrderDetailComponent} from './account/orders/order-detail/order-detail.component';
import {LoginComponent} from './user/login/login.component';
import {HomepageComponent} from './homepage/homepage.component';

const appRoutes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user-profile/:id', component: UserProfileComponent},
  {
    path: 'account', component: AccountComponent, children: [
      {path: '', component: AccountGeneralComponent},
      {path: 'order/:id', component: OrderDetailComponent},
      {path: 'order', component: OrdersComponent},
      {path: 'password', component: ChangePasswordComponent},
      {path: 'bank-account', component: BankAccountComponent},
      {path: 'address', component: AddressComponent},
      {path: 'cart/:id', component: CartItemDetailComponent},
      {path: 'cart', component: CartComponent},
      {
        path: 'auction', component: MyItemComponent, children: [
          {path: '', component: MyAllItemsComponent},
          {path: 'create', component: NewItemComponent},
          {path: ':id/edit', component: MyItemEditComponent}
        ]
      },
    ]
  },
  {path: 'item/:id', component: ItemDetailComponent},
  {path: 'item', component: ItemListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
