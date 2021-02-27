import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ItemDto} from '../../../api/models/item-dto';
import {CartService} from '../../../service/cart.service';
import {StrictHttpResponse} from '../../../api/strict-http-response';
import {CartItemResponse} from '../../../api/models/cart-item-response';
import {FileService} from '../../../service/file.service';
import {OrderService} from '../../../service/order.service';

@Component({
  selector: 'app-cart-item-detail',
  templateUrl: './cart-item-detail.component.html',
  styleUrls: ['./cart-item-detail.component.scss']
})
export class CartItemDetailComponent implements OnInit {

  cartItemId: number;

  cartItem: ItemDto;

  constructor(
    public orderService: OrderService,
    public router: Router,
    public fileService: FileService,
    public cartService: CartService,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(() => {
      this.cartItemId = this.activatedRoute.snapshot.params.id;

      this.cartService.getCartItem(this.cartItemId).subscribe(
        (response: StrictHttpResponse<CartItemResponse>) => {
          this.cartItem = response.body.cartItem;
        }
      );
    });
  }

  getTotalPrice(): number {
    return this.cartItem.itemHighestBid.amount + this.cartItem.delivery.price + this.cartItem.payment.price;
  }

  createOrder(): void {

  }
}
