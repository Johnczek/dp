import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {FileControllerService} from '../api/services/file-controller.service';
import {UserControllerService} from '../api/services/user-controller.service';
import {StrictHttpResponse} from '../api/strict-http-response';
import {FileUploadResponse} from '../api/models/file-upload-response';
import {catchError, mergeMap, tap} from 'rxjs/operators';
import {LoginRequest} from '../api/models/login-request';
import {JwtResponse} from '../api/models/jwt-response';
import {TokenStorageService} from './token-storage.service';
import {FileService} from './file.service';
import {UserDto} from '../api/models/user-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  private avatarFormChangeRequestSubscription: Subscription;

  public userChangeSubject: Subject<JwtResponse> = new Subject<JwtResponse>();

  constructor(
    public fileService: FileService,
    public tokenStorageService: TokenStorageService,
    public fileControllerService: FileControllerService,
    public userControllerService: UserControllerService) { }

  ngOnDestroy(): void {
        if (this.avatarFormChangeRequestSubscription) {
          this.avatarFormChangeRequestSubscription.unsubscribe();
        }
  }

  login(request: { body: LoginRequest }): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.userControllerService.login$Response(request)
        .pipe(
          catchError((err: any) => of(err))
        )
        .subscribe((response: StrictHttpResponse<JwtResponse>) => {

            const jwtResponse: JwtResponse = response.body;
            if (response.ok && jwtResponse) {

              this.tokenStorageService.saveLoggedUser(jwtResponse);
              this.userChangeSubject.next(response.body);

              observer.next(true);
              observer.complete();
            }

            observer.error('Login failed');
        });
    });
  }

  logOut(): void {
    this.tokenStorageService.logOut();
    this.userChangeSubject.next(null);
  }

  refreshLoggedUserData(): void {
    this.userControllerService.loggedUser$Response().subscribe((response: StrictHttpResponse<JwtResponse>) => {
      this.tokenStorageService.saveLoggedUser(response.body);
      this.userChangeSubject.next(response.body);
    });
  }

  updateUserAvatar(avatar: Blob): Observable<string> {

    const loggedUser: JwtResponse = this.tokenStorageService.getLoggedUser();
    if (loggedUser == null) {
      throw new Error('Uživatel není přihlášený');
    }

    let avatarUUID: string;

    return new Observable<string>((observer) => {
      this.fileControllerService.uploadFile$Response({
        fileType: 'USER_AVATAR',
        body: {
          file: avatar,
        },
      })
        .pipe(
          mergeMap(
            (firstResponse: StrictHttpResponse<FileUploadResponse>) => {
              avatarUUID = firstResponse.body.fileUUID;
              const avatarUpdateParams = {
                id: loggedUser.id,
                body: {
                  avatarUUID
                },
              };

              return this.userControllerService.updateUserAvatar$Response(avatarUpdateParams);
            }
          ),
          tap((secondResponse: StrictHttpResponse<string>) => {
            this.refreshLoggedUserData();
            observer.next(avatarUUID);
          }),
          catchError((err: any) => of(err))
        )
        .subscribe();
    });
  }

  getLoggedUser(): JwtResponse {
    return this.tokenStorageService.getLoggedUser();
  }

  getUserById(id: number): Observable<StrictHttpResponse<UserDto>> {
    return this.userControllerService.findById$Response({id});
  }

  editUser(data): Observable<StrictHttpResponse<string>> {
    return this.userControllerService.patch$Response(data);
  }
}
