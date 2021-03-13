import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ItemService} from '../../service/item.service';
import {FileService} from '../../service/file.service';
import {ItemDto} from '../../api/models/item-dto';
import {StrictHttpResponse} from '../../api/strict-http-response';
import {UserService} from '../../service/user.service';
import {Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {WsServiceService} from '../../service/ws-service.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit, OnDestroy {

  loggedUser;

  itemId: number;

  item: ItemDto;

  bidForm: FormGroup;

  currentPrice;

  ws: any;

  constructor(
    public wsService: WsServiceService,
    public userService: UserService,
    public fileService: FileService,
    public itemService: ItemService,
    public activatedRoute: ActivatedRoute,
    public router: Router) {
  }

  ngOnDestroy(): void {
    this.wsService.closeWebSocketConnection();
  }

  ngOnInit(): void {

    this.loggedUser = this.userService.getLoggedUser();

    this.activatedRoute.paramMap.subscribe(() => {
      this.itemId = this.activatedRoute.snapshot.params.id;

      this.itemService.getItemById(this.itemId).subscribe((response: StrictHttpResponse<ItemDto>) => {
        this.item = response.body;
        this.currentPrice = this.getActualPrice();

        this.initBidForm();

        this.connectToWsBroadcast();
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

  private initBidForm(): void {

    this.bidForm = new FormGroup({
      amount: new FormControl(this.currentPrice + 1, [Validators.required])
    });
  }

  makeBid(): void {
    const request: ItemWsBidRequest = {
      userJwtToken: this.userService.getLoggedUser()?.token,
      amount: this.bidForm.get('amount').value,
      itemId: this.itemId
    };

    this.ws.send('/ws-item/bid', {}, JSON.stringify(request));
  }

  public connectToWsBroadcast(): void {
    this.ws = this.wsService.getWebSocket();
    this.ws.connect({}, () => {

      this.ws.subscribe('/ws-item/highest-bid', (message) => {

        const body = JSON.parse(message.body).body;

        if (body && body.itemHighestBidDto && body.state) {
          this.currentPrice = body?.itemHighestBidDto?.amount;
          this.item.itemHighestBid = {
            itemId: body?.itemHighestBidDto?.itemId,
            amount: body?.itemHighestBidDto?.amount,
            time: body?.itemHighestBidDto?.time,
            userId: body?.itemHighestBidDto?.userId,
          };

          this.bidForm.patchValue({amount: this.getLowestPossibleBid()});
          this.item.state =  body?.itemState;
        }
      });
    }, (error) => {
      console.error('Lost connection to WS server' + error);
      this.ws = null;
    });
  }
}


export interface ItemWsBidRequest {
  userJwtToken: string;
  amount: number;
  itemId: number;
}
