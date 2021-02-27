import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from '../../service/cart.service';
import {UserService} from '../../service/user.service';
import {ItemDto} from '../../api/models/item-dto';
import {StrictHttpResponse} from '../../api/strict-http-response';
import {CartResponse} from '../../api/models/cart-response';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  cartSubscription: Subscription;

  cartItems: Array<ItemDto>;

  constructor(
    public userService: UserService,
    public cartService: CartService
  ) { }

  ngOnInit(): void {

    this.cartSubscription = this.cartService.getCartItemsForUser()
      .subscribe((reponse: StrictHttpResponse<CartResponse>) => {
        this.cartItems = reponse.body.cartItems;
      });
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }
}
