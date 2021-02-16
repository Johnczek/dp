import {Injectable} from '@angular/core';
import {ItemControllerService} from '../api/services/item-controller.service';
import {FileService} from './file.service';
import {Observable} from 'rxjs';
import {StrictHttpResponse} from '../api/strict-http-response';
import {ItemDto} from '../api/models/item-dto';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

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
}
