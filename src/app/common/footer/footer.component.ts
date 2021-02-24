import { Component, OnInit } from '@angular/core';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public date: number;

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.date = new Date().getFullYear();
  }

}
