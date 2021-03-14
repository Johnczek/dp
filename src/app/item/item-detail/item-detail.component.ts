import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ItemService} from '../../service/item.service';
import {FileService} from '../../service/file.service';
import {ItemDto} from '../../api/models/item-dto';
import {StrictHttpResponse} from '../../api/strict-http-response';
import {UserService} from '../../service/user.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {WsServiceService} from '../../service/ws-service.service';
import {AlertService} from '../../service/alert.service';

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
    public alertService: AlertService,
    public wsService: WsServiceService,
    public userService: UserService,
    public fileService: FileService,
    public itemService: ItemService,
    public activatedRoute: ActivatedRoute,
    public router: Router) {
  }

  ngOnDestroy(): void {
    this.wsService.closeWebSocketConnection();
    this.ws = null;
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
      }, () => {
        this.router.navigate(['/']);
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
        if (body && body.itemId && body.itemId == this.itemId) {
          this.processItemWsUpdate(body);
        }
      });
    }, (error) => {
      console.error('Lost connection to WS server' + error);
      this.ws = null;
    });
  }

  private processItemWsUpdate(body: any): void {
    if (body.state && body.state === 'SUCCESS') {
      if (body.itemState) {
        this.item.state = body.itemState;
      }

      if (body.itemHighestBid) {
        this.item.itemHighestBid = {
          itemId: body.itemHighestBid?.itemId,
          amount: body.itemHighestBid?.amount,
          time: body.itemHighestBid?.time,
          userId: body.itemHighestBid?.userId,
        };
        this.currentPrice = body.itemHighestBid?.amount;

        this.bidForm.patchValue({amount: this.getLowestPossibleBid()});
      }

      if (body.userRequestId === this.loggedUser.id && body.message) {
        this.alertService.success(body.message);
      }
    }

    if (body.state && body.state === 'ERROR') {
      if (body.userRequestId === this.loggedUser.id && body.message) {
        this.alertService.error(body.message);
      }
    }
  }
}

export interface ItemWsBidRequest {
  userJwtToken: string;
  amount: number;
  itemId: number;
}
