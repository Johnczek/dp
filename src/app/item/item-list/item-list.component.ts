import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemDto} from '../../api/models/item-dto';
import {Subscription} from 'rxjs';
import {ItemService} from '../../service/item.service';
import {StrictHttpResponse} from '../../api/strict-http-response';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {

  items: Array<ItemDto>;

  getAllActiveItemsSubscription: Subscription;

  constructor(
    public itemService: ItemService
  ) { }

  ngOnInit(): void {
    this.getAllActiveItemsSubscription = this.itemService.getAllActiveItems()
      .subscribe((reponse: StrictHttpResponse<Array<ItemDto>>) => {
        this.items = reponse.body;
      });
  }

  ngOnDestroy(): void {
    this.getAllActiveItemsSubscription?.unsubscribe()
  }

}
