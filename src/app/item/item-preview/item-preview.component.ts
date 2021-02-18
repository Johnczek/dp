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

  @Input()
  displayState: 'VIEW' | 'EDIT' = 'VIEW';

  constructor(public fileService: FileService) {
  }

  ngOnInit(): void {
  }

  getActualPriceState(): string {

    const highestPrice =
      this.item.itemHighestBid?.amount !== undefined ? this.item.itemHighestBid?.amount : this.item.startingPrice;

    if (this.isActive()) {
      return 'Aktuální cena je <strong>' + highestPrice + ' kč</strong>';
    }

    return 'Ukončeno s cenou <strong>' + highestPrice + ' kč</strong>';
  }

  isActive(): boolean {
    return this.item.state === 'ACTIVE';
  }
}
