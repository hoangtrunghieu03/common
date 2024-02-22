import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, mergeMap } from 'rxjs/operators';
import Setting from '../../../../../at-common/model/Setting';

import { showNotify } from '../actions/notify.action';
import { hiddenProgress } from '../actions/progress.action';
import { onLoadSettings, onLoadSettingsSuccess, SettingAction } from '../actions/setting.action';
import { RootState } from '../entities/state.entity';
import { AuthencationService } from '../services/authentication.service';
import { SettingService } from '../services/setting.service';

@Injectable()
export class SettingEffect {

    @Effect()
    onLoadSettings$ = this.actions$
        .pipe(
            ofType(SettingAction.onLoadSettings),
            mergeMap(() => fromPromise(this.settingService.onLoadSettings())
                .pipe(
                    mergeMap(result => {
                        return [
                            onLoadSettingsSuccess({ settings: result.entity }),
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
    @Effect()
    onCreateSetting$ = this.actions$
        .pipe(
            ofType(SettingAction.onCreateSetting),
            mergeMap((action: Action & Setting) => fromPromise(this.settingService.onCreateSetting(action))
                .pipe(
                    mergeMap(result => {
                      let message = result.entity.settingType;
                      return [
                          onLoadSettings(),
                          showNotify({ notifyType: 'success',  message: `Cài đặt ${message} thành công` }),
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
    @Effect()
    onUpdateSetting$ = this.actions$
        .pipe(
            ofType(SettingAction.onUpdateSetting),
            mergeMap((action: Action & Setting) => fromPromise(this.settingService.onUpdateSetting(action))
                .pipe(
                    mergeMap(result => {
                      return [
                        onLoadSettings(),
                        showNotify({ notifyType: 'success', message: `Cài đặt ${result.entity.settingType} thành công` }),
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

    constructor(private actions$: Actions,
        private settingService: SettingService,
        private store: Store<RootState>,
        private authenService: AuthencationService) {
    }
}
