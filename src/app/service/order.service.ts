import { Injectable } from '@angular/core';
import {OrderControllerService} from '../api/services/order-controller.service';
import {Observable} from 'rxjs';
import {StrictHttpResponse} from '../api/strict-http-response';
import {OrderCreationResponse} from '../api/models/order-creation-response';
import {LoggedUserOrdersReponse} from '../api/models/logged-user-orders-reponse';
import {OrderDto} from '../api/models/order-dto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    public orderControllerService: OrderControllerService
  ) { }

  createOrder(itemId: number): Observable<StrictHttpResponse<OrderCreationResponse>> {
    return this.orderControllerService.createOrder$Response({itemId});
  }

  getLoggedPersonOrders(): Observable<StrictHttpResponse<LoggedUserOrdersReponse>> {
    return this.orderControllerService.getLoggedUserOrders$Response();
  }

  getOrderById(orderId: number): Observable<StrictHttpResponse<OrderDto>> {
    return this.orderControllerService.getOrderById$Response({orderId});
  }
}
