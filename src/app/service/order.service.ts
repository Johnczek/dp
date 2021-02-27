import { Injectable } from '@angular/core';
import {OrderControllerService} from '../api/services/order-controller.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    public orderControllerService: OrderControllerService
  ) { }
}
