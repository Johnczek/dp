import {Injectable} from '@angular/core';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class WsServiceService {

  private ws: any;

  constructor() {
  }

  getWebSocket(): void {

    const socket = new WebSocket('ws://localhost:8090/ws');
    return this.ws = Stomp.over(socket);
  }

  closeWebSocketConnection(): void {
    if (this.ws != null) {
      this.ws.ws.close();
    }
  }

}
