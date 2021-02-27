import {Component, Input, OnInit} from '@angular/core';
import {OrderDto} from '../../../api/models/order-dto';
import {FileService} from '../../../service/file.service';

@Component({
  selector: 'app-order-preview',
  templateUrl: './order-preview.component.html',
  styleUrls: ['./order-preview.component.scss']
})
export class OrderPreviewComponent implements OnInit {

  @Input()
  order: OrderDto;

  constructor(
    public fileService: FileService
  ) { }

  ngOnInit(): void {
  }

  getTotalPrice(): number {
    return this.order.item.itemHighestBid.amount + this.order.item.delivery.price + this.order.item.payment.price;
  }
}
