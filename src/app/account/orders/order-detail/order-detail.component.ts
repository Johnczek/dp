import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrderService} from '../../../service/order.service';
import {FileService} from '../../../service/file.service';
import {ActivatedRoute} from '@angular/router';
import {OrderDto} from '../../../api/models/order-dto';
import {Subscription} from 'rxjs';
import {StrictHttpResponse} from '../../../api/strict-http-response';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit, OnDestroy {

  orderSubscription: Subscription;

  orderId: number;

  order: OrderDto;

  constructor(
    public activatedRoute: ActivatedRoute,
    public fileService: FileService,
    public orderService: OrderService
  ) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(() => {
      this.orderId = this.activatedRoute.snapshot.params.id;

      this.orderSubscription = this.orderService.getOrderById(this.orderId).subscribe(
        (response: StrictHttpResponse<OrderDto>) => {
          this.order = response.body;
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.orderSubscription?.unsubscribe();
  }

  getTotalPrice(): number {
    return this.order.item.itemHighestBid.amount + this.order.item.delivery.price + this.order.item.payment.price;
  }
}
