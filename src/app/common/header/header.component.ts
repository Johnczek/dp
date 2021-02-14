import {Component, OnDestroy, OnInit} from '@angular/core';
import {TokenStorageService} from '../../service/token-storage.service';
import {UserService} from '../../service/user.service';
import {JwtResponse} from '../../api/models/jwt-response';
import {FileService} from '../../service/file.service';
import {Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  avatarPath: string;

  isLoggedIn = false;

  loggedUser: JwtResponse;

  userChangeSubscription: Subscription;

  constructor(
    private fileService: FileService,
    private userService: UserService
  ) {
  }

  ngOnDestroy(): void {
    this.userChangeSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    const loggedPerson: JwtResponse = this.userService.getLoggedUser();
    this.setUpData(loggedPerson);

    this.detectChanges();
  }

  detectChanges(): void {
    this.userChangeSubscription = this.userService.userChangeSubject
      .subscribe((data: JwtResponse) => {
        console.log('header dostal data');
        this.setUpData(data);
      });
  }

  setUpData(data: JwtResponse): void {
    if (data == null) {
      this.isLoggedIn = false;
      this.avatarPath = null;
      this.loggedUser = null;

      return;
    }

    this.isLoggedIn = true;
    this.loggedUser = data;
    this.avatarPath = this.fileService.getFileUrlByUUID(data.avatarUUID);
  }

  logOut(): void {
    this.userService.logOut();
  }
}
