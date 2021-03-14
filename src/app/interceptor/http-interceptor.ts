import {Injectable} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {EMPTY, Observable} from 'rxjs';
import {TokenStorageService} from '../service/token-storage.service';
import {AUTH_HEADER_NAME} from '../globals';
import {tap} from 'rxjs/operators';
import {AlertService} from '../service/alert.service';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {

  constructor(
    private alertService: AlertService,
    private tokenStorageService: TokenStorageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const loggedUser = this.tokenStorageService.getLoggedUser();

    if (loggedUser != null) {
      authReq = req.clone({headers: req.headers.set(AUTH_HEADER_NAME, loggedUser.type + ' ' + loggedUser.token)});
    }

    return next.handle(authReq).pipe(
      tap(x => x, e => {
        console.error(e);

        if (e.error && e.error.messages && e.error.messages.length > 0) {
          const messages: ErrorMessage[] = e.error.messages;

          messages.forEach(item => {
            if (item.value && item.messageType) {
              switch (item.messageType) {
                case 'SUCCESS':
                  this.alertService.success(item.value);
                  break;
                case 'INFO':
                  this.alertService.info(item.value);
                  break;
                case 'WARNING':
                  this.alertService.warn(item.value);
                  break;
                case 'ERROR':
                default:
                  this.alertService.error(item.value);
              }
            }
          });
        }

        return EMPTY;
      })
    );
  }
}

export const authInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true}
];

export interface ErrorMessage {
  messageType?: 'ERROR' | 'WARNING' | 'SUCCESS' | 'INFO';
  value?: string;
}
