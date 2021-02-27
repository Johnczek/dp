import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {StrictHttpResponse} from '../api/strict-http-response';
import {CartResponse} from '../api/models/cart-response';
import {CartItemResponse} from '../api/models/cart-item-response';
import {CartControllerService} from '../api/services/cart-controller.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    public cartControllerService: CartControllerService
  ) { }


  getCartItemsForUser(): Observable<StrictHttpResponse<CartResponse>> {
    return this.cartControllerService.getCartForLoggedUser$Response();
  }

  getCartItem(itemId: number): Observable<StrictHttpResponse<CartItemResponse>> {
    return this.cartControllerService.getCartItem$Response({itemId});
  }
}
