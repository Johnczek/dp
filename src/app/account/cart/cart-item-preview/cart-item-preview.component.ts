import {Component, Input, OnInit} from '@angular/core';
import {ItemDto} from '../../../api/models/item-dto';
import {FileService} from '../../../service/file.service';

@Component({
  selector: 'app-cart-item-preview',
  templateUrl: './cart-item-preview.component.html',
  styleUrls: ['./cart-item-preview.component.scss']
})
export class CartItemPreviewComponent implements OnInit {

  @Input()
  cartItem: ItemDto;

  constructor(
    public fileService: FileService
  ) { }

  ngOnInit(): void {
  }

}
