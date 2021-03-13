import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss']
})
export class CookiesComponent implements OnInit {

  showBox = false;

  constructor(public cookieService: CookieService) { }

  ngOnInit(): void {

    const cookieEnabled = this.cookieService.get('enableCookie');
    if (!cookieEnabled) {
      this.showBox = true;
    }
  }

  acceptCookie(): void {
    this.cookieService.set('enableCookie', 'true', 30);
    this.showBox = false;
  }
}
