import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, mergeMap } from 'rxjs/operators';

import { NotificationAction, onLoadNotification, onLoadNotificationSuccess } from '../actions/notification.action';
import { showNotify } from '../actions/notify.action';
import { hiddenProgress } from '../actions/progress.action';
import { NotificationService } from '../services/notification.service';
import { Action } from '@ngrx/store';
import Notification from '../../../../../at-common/model/Notification';

@Injectable()
export class NotificationEffect {

    @Effect()
    onLoadNotification$ = this.actions$
        .pipe(
            ofType(NotificationAction.onLoadNotification),
            mergeMap(() => fromPromise(this.notificationService.onLoadNotification())
                .pipe(
                    mergeMap(value => {
                        return [
                            onLoadNotificationSuccess({ notification: value.entity })
                        ]
                    }), catchError(err => of(showNotify({
                        notifyType: 'error',
                        message: err.message
                    }), hiddenProgress())
                    ))
            )
        )

    @Effect()
    onUpdateNotification$ = this.actions$
        .pipe(
            ofType(NotificationAction.onUpdateNotification),
            mergeMap((action: Action & Notification) => fromPromise(this.notificationService.onUpdateNotification(action))
                .pipe(
                    mergeMap(value => {
                        return [
                            onLoadNotification()
                        ]
                    }), catchError(err => of(showNotify({
                        notifyType: 'error',
                        message: err.message
                    }), hiddenProgress())
                    ))
            )
        )

    constructor(private actions$: Actions, private notificationService: NotificationService) {
    }
}