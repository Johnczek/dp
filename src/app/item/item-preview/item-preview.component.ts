import {Component, Input, OnInit} from '@angular/core';
import {FileService} from '../../service/file.service';
import {ItemDto} from '../../api/models/item-dto';

@Component({
  selector: 'app-item-preview',
  templateUrl: './item-preview.component.html',
  styleUrls: ['./item-preview.component.scss']
})
export class ItemPreviewComponent implements OnInit {

  @Input()
  item: ItemDto;

  constructor(public fileService: FileService) {
  }

  ngOnInit(): void {
  }

  getActualPriceState(): string {
    if (this.item.itemHighestBid?.amount !== undefined) {
      return 'Aktuální cena je <strong>' + this.item.itemHighestBid?.amount + ' kč</strong>';
    }

    return 'Vyvolávací cena je <strong>' + this.item.startingPrice + ' kč</strong>';
  }
}
