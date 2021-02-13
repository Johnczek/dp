import {Injectable, OnDestroy} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import {FileControllerService} from '../api/services/file-controller.service';
import {UserControllerService} from '../api/services/user-controller.service';
import {StrictHttpResponse} from '../api/strict-http-response';
import {FileUploadResponse} from '../api/models/file-upload-response';
import {catchError, flatMap, mergeMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy{

  private avatarFormChangeRequestSubscription: Subscription;

  constructor(
    public fileControllerService: FileControllerService,
    public userControllerService: UserControllerService) { }

  ngOnDestroy(): void {
        if (this.avatarFormChangeRequestSubscription) {
          this.avatarFormChangeRequestSubscription.unsubscribe();
        }
    }

  updateUserAvatar(avatar: Blob): Observable<boolean> {

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
                id: 1,
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
}
