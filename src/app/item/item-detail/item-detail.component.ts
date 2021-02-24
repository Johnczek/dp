import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ItemService} from '../../service/item.service';
import {FileService} from '../../service/file.service';
import {ItemDto} from '../../api/models/item-dto';
import {StrictHttpResponse} from '../../api/strict-http-response';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {

  loggedUser;

  itemId: number;

  item: ItemDto;

  constructor(
    public userService: UserService,
    public fileService: FileService,
    public itemService: ItemService,
    public activatedRoute: ActivatedRoute,
    public router: Router) {
  }

  ngOnInit(): void {

    this.loggedUser = this.userService.getLoggedUser();

    this.activatedRoute.paramMap.subscribe(() => {
      this.itemId = this.activatedRoute.snapshot.params.id;

      this.itemService.getItemById(this.itemId).subscribe((response: StrictHttpResponse<ItemDto>) => {
        this.item = response.body;
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
