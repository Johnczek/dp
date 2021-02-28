import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {delay, map, retryWhen, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  connections: Array<ConnectionForHighestBid>;
  RETRY_SECONDS = 10;

  constructor() {
  }

  connect(itemId: number): Observable<any> {
    return of('http://localhost:8090').pipe(
      map(apiUrl => apiUrl.replace(/^http/, 'ws') + '/ws-item/' + itemId + '/highest-bid'),
      switchMap(wsUrl => {
        const connection = this.connections.filter(c => c.itemId === itemId);

        // In case we already connected for given item id
        if (connection && connection.length === 1) {
          return connection[0].connection$;
        } else {
          const newConnection: ConnectionForHighestBid = {
            itemId,
            connection$: webSocket(wsUrl)
          };
          this.connections.push(newConnection);

          return newConnection.connection$;
        }
      }),
      retryWhen((errors) => errors.pipe(delay(this.RETRY_SECONDS)))
    );
  }
}

export interface ConnectionForHighestBid {
  itemId: number;
  connection$: WebSocketSubject<any>;
}
