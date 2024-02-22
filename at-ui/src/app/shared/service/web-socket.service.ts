import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import WebSocketClientHelper from 'src/app/core/WebSocketClientHelper';
import { RootState } from 'src/app/store/entities/state.entity';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socketClient: WebSocketClientHelper;
  constructor( private store: Store<RootState>) { }
  initializeWebSocket(roomIds: any[],handler:any) {
    // Khởi tạo đối tượng WebSocketClientHelper và thực hiện các hoạt động khởi tạo và xử lý tin nhắn
    this.socketClient = new WebSocketClientHelper(roomIds, this.store);
    this.socketClient.Initialise();
    this.socketClient.AddMessageHandler(handler);
  }
  closeWebSocket() {
    // Gọi phương thức close trên đối tượng WebSocketClientHelper
    this.socketClient.enabled = false;
  }

}
