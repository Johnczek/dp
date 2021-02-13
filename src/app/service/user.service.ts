import {Injectable, OnDestroy} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import {FileControllerService} from '../api/services/file-controller.service';
import {UserControllerService} from '../api/services/user-controller.service';
import {StrictHttpResponse} from '../api/strict-http-response';
import {FileUploadResponse} from '../api/models/file-upload-response';
import {catchError, mergeMap, tap, timestamp} from 'rxjs/operators';
import {LoginRequest} from '../api/models/login-request';
import {JwtResponse} from '../api/models/jwt-response';
import {TokenStorageService} from './token-storage.service';
import {environment} from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy{

  private avatarFormChangeRequestSubscription: Subscription;

  constructor(
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

              observer.next(true);
              observer.complete();
            }

            observer.error('Login failed');
        });
    });
  }

  updateUserAvatar(avatar: Blob): Observable<boolean> {

    const loggedUser: JwtResponse = this.tokenStorageService.getLoggedUser();
    if (loggedUser == null) {
      throw new Error('User not logged in');
    }

    return new Observable<boolean>((observer) => {
      this.fileControllerService.uploadFile$Response({
        fileType: 'USER_AVATAR',
        body: {
          file: avatar,
        },
      })
        .pipe(
          tap((responseOfFirstApiCall: StrictHttpResponse<FileUploadResponse>) => {
            // Do whatever you want here, but you might not need that since you get the response below as well (in the flatMap)
            // Handle returned UUID and somehow pass it into an observable belog
            console.log('Body: ');
            console.log(responseOfFirstApiCall.body);
          }),
          mergeMap(
            (firstResponse: StrictHttpResponse<FileUploadResponse>) => {
              console.log('Bla: ');
              console.log(firstResponse);
              // Creating object for EP-B calling
              const avatarUpdateParams = {
                id: loggedUser.id,
                body: {
                  avatarUUID: firstResponse.body.fileUUID
                },
              };

              return this.userControllerService.updateUserAvatar$Response(avatarUpdateParams);
            }
          ),
          tap((SecondResponse: StrictHttpResponse<string>) => {
            console.log(SecondResponse);
            observer.next(true);
          }),
          catchError((err: any) => of(err))
        )
        .subscribe();
    });
  }

  getLooedPersonAvatarUrl(): string {
    const loggedUser = this.tokenStorageService.getLoggedUser();

    if (loggedUser != null && loggedUser.avatarUUID != null) {
      return environment.API_IMAGE_URL + loggedUser.avatarUUID + '?' + new Date().getTime();
    }

    return 'https://dummyimage.com/200x200/19a846/fff&text=' + loggedUser?.username.charAt(0).toUpperCase();
  }
}
