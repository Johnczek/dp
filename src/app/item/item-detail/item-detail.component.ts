import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ItemService} from '../../service/item.service';
import {FileService} from '../../service/file.service';
import {ItemDto} from '../../api/models/item-dto';
import {StrictHttpResponse} from '../../api/strict-http-response';
import {UserService} from '../../service/user.service';
import {WebSocketService} from '../../service/web-socket.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit, OnDestroy {

  loggedUser;

  itemId: number;

  item: ItemDto;

  destroyed$ = new Subject();

  constructor(
    public webSockedService: WebSocketService,
    public userService: UserService,
    public fileService: FileService,
    public itemService: ItemService,
    public activatedRoute: ActivatedRoute,
    public router: Router) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  ngOnInit(): void {

    this.loggedUser = this.userService.getLoggedUser();

    this.activatedRoute.paramMap.subscribe(() => {
      this.itemId = this.activatedRoute.snapshot.params.id;

      this.itemService.getItemById(this.itemId).subscribe((response: StrictHttpResponse<ItemDto>) => {
        this.item = response.body;

        this.webSockedService.connect(this.itemId).pipe(
          takeUntil(this.destroyed$)
        ).subscribe(data => {
          console.log(data);
        });
      });
    });
  }

  getLowestPossibleBid(): number {
    return this.getActualPrice() + 1;
  }

  getActualPrice(): number {
    if (this.item.itemHighestBid == null || this.item.itemHighestBid.amount == null) {
      return this.item.startingPrice;
    }

    return this.item.itemHighestBid.amount;
  }

}
