import {Injectable} from '@angular/core';
import {ItemControllerService} from '../api/services/item-controller.service';
import {FileService} from './file.service';
import {Observable, of} from 'rxjs';
import {StrictHttpResponse} from '../api/strict-http-response';
import {ItemDto} from '../api/models/item-dto';
import {ItemEditOptionsResponse} from '../api/models/item-edit-options-response';
import {ItemChangeRequest} from '../api/models/item-change-request';
import {catchError, mergeMap, tap} from 'rxjs/operators';
import {FileUploadResponse} from '../api/models/file-upload-response';
import {ItemCreationOptionsResponse} from '../api/models/item-creation-options-response';

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

  changeItemGeneral(itemId: number, data: ItemChangeRequest): Observable<StrictHttpResponse<ItemDto>> {
    return this.itemControllerService.editById$Response({id: itemId, body: data});
  }

  updateItemPicture(itemId: number, picture: Blob): Observable<string> {

    let pictureUUID: string;

    return new Observable<string>((observer) => {
      this.fileService.uploadFile('ITEM_PICTURE', picture)
        .pipe(
          mergeMap(
            (firstResponse: StrictHttpResponse<FileUploadResponse>) => {
              pictureUUID = firstResponse.body.fileUUID;

              return this.itemControllerService.changeItemPictureMethod$Response({id: itemId, body: {pictureUUID}});
            }
          ),
          tap(() => {
            observer.next(pictureUUID);
          }),
          catchError((err: any) => of(err))
        )
        .subscribe();
    });
  }

  getItemCreationOptions(): Observable<StrictHttpResponse<ItemCreationOptionsResponse>> {
    return this.itemControllerService.getCreationOptions$Response();
  }

  translateItemState(state: string): string {
    return this.itemStateTranslation.find(i => i.key === state)?.translation;
  }
}

export interface ItemStateTranslation {
  key: string;
  translation: string;
}
