import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import Staffs from '../../../at-common/model/Staffs';
import WebSocketClientHelper from './core/WebSocketClientHelper';
import { CanDeactivateState } from './shared/routes/can-deactivate.guard';
import { PrintService } from './shared/service/print.service';
import { closeNotify } from './store/actions/notify.action';
import { loadStaffLogin } from './store/actions/staffs.action';
import { RootState } from './store/entities/state.entity';
import { WebSocketService } from './shared/service/web-socket.service';

export interface Notifycation {
  show?: boolean;
  notifyType?: string;
  message?: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DestroySubsribeService]
})
export class AppComponent implements OnInit {

  title = 'at-ui';
  notify: Notifycation;

  constructor(
    private store: Store<RootState>,
    public printService: PrintService,
    readonly router: Router,
    private webSocketService: WebSocketService,
    private destroy: DestroySubsribeService
    ){
      // if the user clicks the back button, ask the CanDeactivateGuard to defend against this.
      window.onpopstate = () => CanDeactivateState.defendAgainstBrowserBackButton = true;

      // Upon successful navigation, ensure that the CanDeactivateGuard no longer defends against back button clicks
      router.events.pipe(
        filter(e => e instanceof NavigationEnd),
        tap(() => CanDeactivateState.defendAgainstBrowserBackButton = false)
      ).subscribe();
    }

  ngOnInit(): void {

    this.store.select( state => state.notify)
    .subscribe( notify => {
      this.notify = notify;
      if ( notify.show ) {
        let showNotiTimeout = setTimeout(() => {
          let notiEl = document.getElementsByClassName('notifycation')[0] as HTMLElement;
          let messageEl = document.getElementsByClassName('message')[0] as HTMLElement;
          notiEl.style.right = String(window.innerWidth / 2 - messageEl.offsetWidth / 2) + 'px';
          clearTimeout(showNotiTimeout)
        }, 0);

        let timeout = setTimeout(() => {
          this.store.dispatch(closeNotify());
          clearTimeout(timeout)
        }, 5000);
      }
    });

    this.store.select(state => state.authencation._id)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(_id => {
        if (!_id) return;
        this.onLoadRoomStaffLogin(_id);
      })
  }

  onLoadRoomStaffLogin = (_id: string) => {
    this.store.dispatch(loadStaffLogin({ staffId: _id }))
    this.store.select(state => state.staff.staffLogin)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((staff: Staffs) => {
        if (!staff) return;
        this.webSocketService.initializeWebSocket(staff.roomIds, this);
        // let socketClient = new WebSocketClientHelper(staff.roomIds, this.store);
        // socketClient.Initialise();
        // socketClient.AddMessageHandler(this);

      })
  }
}
