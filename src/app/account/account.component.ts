import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  hideMobileMenu = true;

  constructor(private router: Router) { }

  ngOnInit(): void {

    this.router.events.subscribe(() => {
      this.hideMobileMenu = true;
    });
  }

}
