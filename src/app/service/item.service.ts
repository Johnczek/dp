import {Injectable} from '@angular/core';
import {ItemControllerService} from '../api/services/item-controller.service';
import {FileService} from './file.service';
import {Observable} from 'rxjs';
import {StrictHttpResponse} from '../api/strict-http-response';
import {ItemDto} from '../api/models/item-dto';
import {ItemEditOptionsResponse} from '../api/models/item-edit-options-response';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  itemStateTranslation: Array<ItemStateTranslation> = [
    {
      key: 'ACTIVE',
      translation: 'Aktivní'
    },
    {
      key: 'CANCELLED',
      translation: 'Zrušeno'
    },
    {
      key: 'AUCTIONED',
      translation: 'Vydraženo'
    },
    {
      key: 'AUCTIONED_WITHOUT_BIDS',
      translation: 'Ukončeno bez příhozů'
    },
    {
      key: 'SOLD',
      translation: 'Prodáno'
    },
    {
      key: 'UNKNOWN',
      translation: 'Neznámý stav'
    }
  ];

  constructor(
    public fileService: FileService,
    public itemControllerService: ItemControllerService) {
  }

  getAllActiveItems(): Observable<StrictHttpResponse<Array<ItemDto>>> {
    return this.itemControllerService.getAllActive$Response();
  }

  getItemById(id: number): Observable<StrictHttpResponse<ItemDto>> {
    return this.itemControllerService.getById$Response({id});
  }

  getItemByIdForEdit(id: number): Observable<StrictHttpResponse<ItemEditOptionsResponse>> {
    return this.itemControllerService.findByItemIdForEdit$Response({id});
  }

  getItemsBySellerId(sellerId: number): Observable<StrictHttpResponse<Array<ItemDto>>> {
    return this.itemControllerService.getAllBySellerId$Response({sellerId});
  }

  cancelItem(id: number): Observable<StrictHttpResponse<string>> {
    return this.itemControllerService.cancelItemMethod$Response({id});
  }

  changeItemDelivery(itemId: number, deliveryId: number): Observable<StrictHttpResponse<string>> {
    return this.itemControllerService.changeItemDeliveryMethod$Response({id: itemId, body: {deliveryId}});
  }

  changeItemPayment(itemId: number, paymentId: number): Observable<StrictHttpResponse<string>> {
    return this.itemControllerService.changeItemPaymentMethod$Response({id: itemId, body: {paymentId}});
  }

  translateItemState(state: string): string {
    return this.itemStateTranslation.find(i => i.key === state)?.translation;
  }
}

export interface ItemStateTranslation {
  key: string;
  translation: string;
}
