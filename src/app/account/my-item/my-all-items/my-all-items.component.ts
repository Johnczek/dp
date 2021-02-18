import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemDto} from '../../../api/models/item-dto';
import {Subscription} from 'rxjs';
import {UserService} from '../../../service/user.service';
import {ItemService} from '../../../service/item.service';
import {Router} from '@angular/router';
import {StrictHttpResponse} from '../../../api/strict-http-response';

@Component({
  selector: 'app-my-all-items',
  templateUrl: './my-all-items.component.html',
  styleUrls: ['./my-all-items.component.scss']
})
export class MyAllItemsComponent implements OnInit, OnDestroy {

  items: Array<ItemDto>;

  getAllItemsSubscription: Subscription;

  constructor(
    public router: Router,
    public userService: UserService,
    public itemService: ItemService
  ) { }

  ngOnInit(): void {

    const loggedUser = this.userService.getLoggedUser();
    if (loggedUser == null) {
      this.router.navigate(['login']);
    }

    this.getAllItemsSubscription = this.itemService.getItemsBySellerId(loggedUser.id)
      .subscribe((response: StrictHttpResponse<Array<ItemDto>>) => {
        this.items = response.body;
      });
  }

  ngOnDestroy(): void {
    this.getAllItemsSubscription?.unsubscribe();
  }

}
