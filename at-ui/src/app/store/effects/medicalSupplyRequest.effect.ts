import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, mergeMap } from 'rxjs/operators';

import MedicalSupplyExportRequest from '../../../../../at-common/model/MedicalSupplyExportRequest';
import { MedicalSupplyRequestAction, onLoadMedicalSupplyRequest, onLoadMedicalSupplyRequestByIdSuccess, onLoadMedicalSupplyRequestSuccess } from '../actions/medicalSupplyRequest.action';
import { showNotify } from '../actions/notify.action';
import { hiddenProgress } from '../actions/progress.action';
import { RootState } from '../entities/state.entity';
import { AuthencationService } from '../services/authentication.service';
import { MedicalSupplyRequestService } from '../services/medicalSupplyRequest.service';

@Injectable()
export class MedicalSupplyRequestEffect {

    @Effect()
    onLoadMedicalSupplyRequest$ = this.actions$.pipe(
        ofType(MedicalSupplyRequestAction.onLoadMedicalSupplyRequest),
        mergeMap(() =>
            fromPromise(this.medicalSupplyRequestService.onLoadMedicalSupplyRequest())
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalSupplyRequestSuccess({ medicalSupplyRequest: val.entity }),
                            hiddenProgress()
                        ];
                    }), catchError(err =>
                        this.authenService.handleAuthError(err, of(showNotify({
                            notifyType: 'error',
                            message: err.message
                        }), hiddenProgress()))
                    ))
        )
    );

    @Effect()
    onCreateMedicalSupply$ = this.actions$.pipe(
        ofType(MedicalSupplyRequestAction.onCreateMedicalSupplyRequest),
        mergeMap((action: Action & MedicalSupplyExportRequest) =>
            fromPromise(this.medicalSupplyRequestService.onCreateMedicalSupplyRequest(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            showNotify({
                                notifyType: 'success',
                                message: 'Đã tạo danh sách đề xuất'
                            }),
                            hiddenProgress()
                        ];
                    }), catchError(err =>
                        this.authenService.handleAuthError(err, of(showNotify({
                            notifyType: 'error',
                            message: err.message
                        }), hiddenProgress()))
                    ))
        )
    );

    @Effect()
    onRemoveMedicalSupplyRequest$ = this.actions$.pipe(
        ofType(MedicalSupplyRequestAction.onRemoveMedicalSupplyRequest),
        mergeMap((action: Action & MedicalSupplyExportRequest) =>
            fromPromise(this.medicalSupplyRequestService.onRemoveMedicalSupplyRequest(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalSupplyRequest(),
                            showNotify({
                                notifyType: 'success',
                                message: 'Đã xóa danh sách đề xuất'
                            }),
                            hiddenProgress()
                        ];
                    }), catchError(err =>
                        this.authenService.handleAuthError(err, of(showNotify({
                            notifyType: 'error',
                            message: err.message
                        }), hiddenProgress()))
                    ))
        )
    );

    @Effect()
    onLoadMedicalSupplyById$ = this.actions$.pipe(
        ofType(MedicalSupplyRequestAction.onLoadMedicalSupplyRequestById),
        mergeMap((action: Action & MedicalSupplyExportRequest) =>
            fromPromise(this.medicalSupplyRequestService.onLoadMedicalSupplyRequestById(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalSupplyRequestByIdSuccess(val.entity),
                            hiddenProgress()
                        ];
                    }), catchError(err =>
                        this.authenService.handleAuthError(err, of(showNotify({
                            notifyType: 'error',
                            message: err.message
                        }), hiddenProgress()))
                    ))
        )
    );

    constructor(
        private actions$: Actions,
        private medicalSupplyRequestService: MedicalSupplyRequestService,
        private store: Store<RootState>,
        private authenService: AuthencationService
    ) { }
}
