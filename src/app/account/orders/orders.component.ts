import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrderDto} from '../../api/models/order-dto';
import {OrderService} from '../../service/order.service';
import {Subscription} from 'rxjs';
import {StrictHttpResponse} from '../../api/strict-http-response';
import {LoggedUserOrdersReponse} from '../../api/models/logged-user-orders-reponse';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

  ordersSubscription: Subscription;

  orders: Array<OrderDto>;

  constructor(
    public orderService: OrderService
  ) {
  }

  ngOnInit(): void {

    this.ordersSubscription = this.orderService.getLoggedPersonOrders()
      .subscribe((response: StrictHttpResponse<LoggedUserOrdersReponse>) => {
        this.orders = response.body.orders;
      });
  }

  ngOnDestroy(): void {
    this.ordersSubscription?.unsubscribe();
  }

}
