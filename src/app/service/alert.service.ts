import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Alert, AlertType} from '../model/alert.model';
import {filter} from 'rxjs/operators';
import {DEFAULT_ALERT_OPTIONS} from '../globals';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private subject = new Subject<Alert>();
  private defaultId = 'default-alert';

  onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject.asObservable()
      .pipe(
        filter(x => x && x.id === id)
      );
  }

  success(message: string, options?: any): void {

    if (options == null) {
      options = DEFAULT_ALERT_OPTIONS;
    }

    this.alert(new Alert({...options, type: AlertType.SUCCESS, message}));
  }

  error(message: string, options?: any): void {

    if (options == null) {
      options = DEFAULT_ALERT_OPTIONS;
    }

    this.alert(new Alert({...options, type: AlertType.ERROR, message}));
  }

  info(message: string, options?: any): void {

    if (options == null) {
      options = DEFAULT_ALERT_OPTIONS;
    }

    this.alert(new Alert({...options, type: AlertType.INFO, message}));
  }

  warn(message: string, options?: any): void {

    if (options == null) {
      options = DEFAULT_ALERT_OPTIONS;
    }

    this.alert(new Alert({...options, type: AlertType.WARNING, message}));
  }

  alert(alert: Alert): void {
    alert.id = alert.id || this.defaultId;
    this.subject.next(alert);
  }

  clear(id = this.defaultId): void {
    this.subject.next(new Alert({id}));
  }
}
