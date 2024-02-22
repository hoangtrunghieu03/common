import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, mergeMap } from 'rxjs/operators';
import { MedicalComboServiceAction, onLoadMedicalComboServiceSuccess, onLoadMedicalComboServiceByIdSuccess } from '../actions/medicalComboService.action';

import { AuthencationService } from '../services/authentication.service';
import { MedicalComboServiceService } from '../services/medicalComboService.service';
import { fromPromise } from 'rxjs/internal-compatibility';
import { showNotify } from '../actions/notify.action';
import { of } from 'rxjs';
import { hiddenProgress } from '../actions/progress.action';
import MedicalComboService from '../../../../../at-common/model/MedicalComboService';
import { Action } from '@ngrx/store';
import { Location } from '@angular/common';
import StoreConstants from '../utils/store.constant';

@Injectable()
export class MedicalComboServiceEffect {

    @Effect()
    onLoadMedicalComboService$ = this.actions$
        .pipe(
            ofType(MedicalComboServiceAction.onLoadMedicalComboService),
            mergeMap(() => fromPromise(this.medicalComboServiceService.onLoadMedicalComboService())
                .pipe(
                    mergeMap(val => {
                        return [
                            onLoadMedicalComboServiceSuccess({ medicalComboServices: val.entity }),
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
    onLoadMedicalComboServiceById$ = this.actions$
        .pipe(
            ofType(MedicalComboServiceAction.onLoadMedicalComboServiceById),
            mergeMap((action: Action & MedicalComboService) => fromPromise(this.medicalComboServiceService.onLoadMedicalComboServiceById(action))
                .pipe(
                    mergeMap(val => {
                        return [
                            onLoadMedicalComboServiceByIdSuccess(val.entity),
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
    onCreateMedicalComboService$ = this.actions$
        .pipe(
            ofType(MedicalComboServiceAction.onCreateMedicalComboService),
            mergeMap((action: Action & MedicalComboService) => fromPromise(this.medicalComboServiceService.onCreateMedicalComboService(action))
                .pipe(
                    mergeMap(val => {
                        this.location.back();
                        return [
                            showNotify({
                                notifyType: 'success',
                                message: 'Đã tạo mới Combo chỉ định '
                                    + `<span class='f-w-700 primary-color'>${val.entity?.name}</span>`
                            }),
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
    onUpdateMedicalComboService$ = this.actions$
        .pipe(
            ofType(MedicalComboServiceAction.onUpdateMedicalComboService),
            mergeMap((action: Action & MedicalComboService) => fromPromise(this.medicalComboServiceService.onUpdateMedicalComboService(action))
                .pipe(
                    mergeMap(val => {
                        return [
                            onLoadMedicalComboServiceByIdSuccess(val.entity),
                            showNotify({
                                notifyType: 'success',
                                message: 'Đã cập nhật Combo chỉ định '
                                    + `<span class='f-w-700 primary-color'>${val.entity?.name}</span>`
                            }),
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
    onRemoveMedicalComboService$ = this.actions$
        .pipe(
            ofType(MedicalComboServiceAction.onRemoveMedicalComboService),
            mergeMap((action: Action & MedicalComboService) => fromPromise(this.medicalComboServiceService.onRemoveMedicalComboService(action))
                .pipe(
                    mergeMap(val => {
                        this.location.back();
                        return [
                            showNotify({
                                notifyType: 'success',
                                message: 'Đã xóa Combo chỉ định '
                                    + `<span class='f-w-700 primary-color'>${action?.name}</span>`
                            }),
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


    constructor(
        private actions$: Actions,
        private medicalComboServiceService: MedicalComboServiceService,
        private authenService: AuthencationService,
        private location: Location) {
    }
}