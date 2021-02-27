import { Component, OnInit } from '@angular/core';
import {CartService} from '../../service/cart.service';
import {UserService} from '../../service/user.service';
import {ItemDto} from '../../api/models/item-dto';
import {StrictHttpResponse} from '../../api/strict-http-response';
import {CartResponse} from '../../api/models/cart-response';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartItems: Array<ItemDto>;

  constructor(
    public userService: UserService,
    public cartService: CartService
  ) { }

  ngOnInit(): void {

    this.cartService.getCartItemsForUser()
      .subscribe((reponse: StrictHttpResponse<CartResponse>) => {
        this.cartItems = reponse.body.cartItems;
      });
  }
}
