import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, mergeMap } from 'rxjs/operators';
import Chair from '../../../../../at-common/model/Chair';

import { ChairAction, onLoadChair, onLoadChairById, onLoadChairByIdSuccess, onLoadChairByStaff, onLoadChairByStaffSuccess, onLoadChairSuccess } from '../actions/chair.action';
import { showNotify } from '../actions/notify.action';
import { hiddenProgress } from '../actions/progress.action';
import { AuthencationService } from '../services/authentication.service';
import { ChairService } from '../services/chair.service';
import { MedicalRecordService } from '../services/medicalRecord.service';
import MedicalRecord from '../../../../../at-common/model/MedicalRecord';

@Injectable()
export class ChairEffect {

    @Effect()
    onLoadChair$ = this.actions$
        .pipe(
            ofType(ChairAction.onLoadChair),
            mergeMap(() => fromPromise(this.chairService.onLoadChair())
                .pipe(
                    mergeMap(value => {
                        return [
                            onLoadChairSuccess({ chair: value.entity }),
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
    onLoadChairById$ = this.actions$
        .pipe(
            ofType(ChairAction.onLoadChairById),
            mergeMap((action: Action & Chair) => fromPromise(this.chairService.onLoadChairById(action))
                .pipe(
                    mergeMap(value => {
                        return [
                            onLoadChairByIdSuccess(value.entity),
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
    onCreateChair$ = this.actions$
        .pipe(
            ofType(ChairAction.onCreateChair),
            mergeMap((action: Action & Chair) => fromPromise(this.chairService.onCreateChair(action))
                .pipe(
                    mergeMap(value => {
                        return [
                            onLoadChair(),
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
    onUpdateChair$ = this.actions$
        .pipe(
            ofType(ChairAction.onUpdateChair),
            mergeMap((action: Action & Chair) => fromPromise(this.chairService.onUpdateChair(action))
                .pipe(
                    mergeMap(value => {
                        return [
                            onLoadChairById(value.entity),
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
    onLoadChairByStaff$ = this.actions$
        .pipe(
            ofType(ChairAction.onLoadChairByStaff),
            mergeMap(() => fromPromise(this.chairService.onLoadChairByStaff())
                .pipe(
                    mergeMap(value => {
                        return [
                            onLoadChairByStaffSuccess({ chair: value.entity }),
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
    onRemoveChair$ = this.actions$
        .pipe(
            ofType(ChairAction.onRemoveChair),
            mergeMap((action: Action & Chair) => fromPromise(this.chairService.onRemoveChair(action))
                .pipe(
                    mergeMap(value => {
                        this.location.back();
                        return [
                            hiddenProgress(),
                            showNotify({
                              notifyType: 'success',
                              message: `Xóa ghế <span class='f-w-700 primary-color'> ${action.name} </span> thành công`
                          })
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
    onResetChair$ = this.actions$
        .pipe(
            ofType(ChairAction.onResetChair),
            mergeMap((action: Action & Chair) => fromPromise(this.chairService.onResetChair(action))
                .pipe(
                    mergeMap(value => {
                        return [
                            onLoadChairByIdSuccess(value.entity),
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
    onUpdateCustomerInChair$ = this.actions$
        .pipe(
            ofType(ChairAction.onUpdateCustomerInChair),
            mergeMap((action: Action & MedicalRecord) => fromPromise(this.medicalRecordService.onMedicalCustomerChair(action))
                .pipe(
                    mergeMap(value => {
                        return [
                            onLoadChairByStaff(),
                            onLoadChairById({ _id: action.chair.chairId }),
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
        private chairService: ChairService,
        private authenService: AuthencationService,
        private location: Location,
        private medicalRecordService: MedicalRecordService) {
    }
}
