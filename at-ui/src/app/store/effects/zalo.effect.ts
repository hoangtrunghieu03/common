import { ZaloAction, onAuthZaloSuccess, onLoadZaloCurrent, onLoadZaloCurrentSuccess} from './../actions/zalo.action';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, mergeMap } from 'rxjs/operators';
import ZaloInfo from '../../../../../at-common/model/ZaloInfo';
import { showNotify } from '../actions/notify.action';
import { of } from 'rxjs';
import { AuthencationService } from '../services/authentication.service';
import { hiddenProgress } from '../actions/progress.action';
import { ZaloService } from '../services/zalo.service';
@Injectable()
export class ZaloEffect {



    @Effect()
    onLoadZalo$ = this.actions$
        .pipe(
            ofType(ZaloAction.onLoadZaloCurrent),
            mergeMap((action: Action & ZaloInfo) => fromPromise(this.zaloService.onLoadZaloCurrent())
                .pipe(
                  mergeMap(result => {
                    return [
                        onLoadZaloCurrentSuccess({ zalo: result.entity }),
                        hiddenProgress(),
                    ]
                }), catchError(err =>
                    this.authenService.handleAuthError(err, of(showNotify({
                        notifyType: 'error',
                        message: err.message
                    }), hiddenProgress()))
                ))
            )
        )

        @Effect() onAuthZalo$ = this.actions$
        .pipe(
            ofType(ZaloAction.onAuthZalo),
            mergeMap((zaloAuth) => fromPromise(this.zaloService.onAuthZalo(zaloAuth))
                .pipe(
                    mergeMap(result => {
                        let timeout =  setTimeout(() => {window.close(), clearTimeout(timeout)}, 200);
                        return [
                            localStorage.setItem('myDataKey', JSON.stringify(result)),
                            onAuthZaloSuccess({zaloAuth: result}),
                            hiddenProgress(),
                        ]
                    }), catchError(err =>
                      {
                        let timeout =  setTimeout(() => {window.close(), clearTimeout(timeout)}, 200);
                        return [
                          this.authenService.handleAuthError(err, of(showNotify({
                            notifyType: 'error',
                            message: err.message
                        }),
                        hiddenProgress(),
                        localStorage.setItem('myDataKey', JSON.stringify(null)),
                        ))
                        ]
                      }
                    )))
        );

        @Effect()
        onUpdateZalo$ = this.actions$
            .pipe(
                ofType(ZaloAction.onUpdateZalo),
                mergeMap((action: Action & ZaloInfo) => fromPromise(this.zaloService.onUpdateZalo(action))
                    .pipe(
                        mergeMap(result => {
                            return [
                                onLoadZaloCurrent(),
                                showNotify({ notifyType: 'success', message: `Cập nhật zalo thành công` }),
                                hiddenProgress()
                            ]
                        }), catchError(err =>
                            this.authenService.handleAuthError(err, of(showNotify({
                                notifyType: 'error',
                                message: err.message
                            }), hiddenProgress()))
                        ))
                )
            )

    constructor(private actions$: Actions,private zaloService: ZaloService, private authenService: AuthencationService) {
    }
}
