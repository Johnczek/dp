import { Injectable } from '@angular/core';
import {CartControllerService} from '../api/services/cart-controller.service';
import {Observable} from 'rxjs';
import {StrictHttpResponse} from '../api/strict-http-response';
import {CartResponse} from '../api/models/cart-response';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    public cartControllerService: CartControllerService
  ) { }


  getCartItemsForUser(userId: number): Observable<StrictHttpResponse<CartResponse>> {
    return this.cartControllerService.getCartForUser$Response({userId});
  }
}
