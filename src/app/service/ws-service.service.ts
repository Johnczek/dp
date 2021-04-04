import {Injectable} from '@angular/core';
import * as Stomp from 'stompjs';
import {environment} from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class WsServiceService {

  private ws: any;

  constructor() {
  }

  getWebSocket(): void {

    const socket = new WebSocket(environment.API_WS_URL);
    return this.ws = Stomp.over(socket);
  }

  closeWebSocketConnection(): void {
    if (this.ws != null) {
      this.ws.ws.close();
    }
  }

}
