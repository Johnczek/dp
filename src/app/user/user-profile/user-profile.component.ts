import { Component, OnInit } from '@angular/core';
import {UserService} from '../../service/user.service';
import {ItemService} from '../../service/item.service';
import {FileService} from '../../service/file.service';
import {UserDto} from '../../api/models/user-dto';
import {ItemDto} from '../../api/models/item-dto';
import {ActivatedRoute} from '@angular/router';
import {StrictHttpResponse} from '../../api/strict-http-response';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userId: number;

  user: UserDto;

  userItems: Array<ItemDto>;

  constructor(
    public activatedRoute: ActivatedRoute,
    public userService: UserService,
    public itemService: ItemService,
    public fileService: FileService
  ) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(() => {
      this.userId = this.activatedRoute.snapshot.params.id;

      this.userService.getUserById(this.userId).subscribe(
        (response: StrictHttpResponse<UserDto>) => {
          this.user = response.body;
        }
      );

      this.itemService.getItemsBySellerId(this.userId)
        .subscribe((reponse: StrictHttpResponse<Array<ItemDto>>) => {
          this.userItems = reponse.body;
        });
    });
  }

}
