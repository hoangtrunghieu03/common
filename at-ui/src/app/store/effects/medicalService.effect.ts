import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, mergeMap } from 'rxjs/operators';
import MedicalService from '../../../../../at-common/model/MedicalService';
import MedicalServiceReport from '../../../../../at-common/model/MedicalServiceReport';
import {
    MedicalServiceAction, onLoadMedicalServiceByIdSuccess, onLoadMedicalServiceFilter, onLoadMedicalServiceFilterSuccess, onLoadMedicalServiceSuccess, onLoadMedicalServiceTag, onLoadMedicalServiceTagSuccess
} from '../actions/medicalService.action';
import { showNotify } from '../actions/notify.action';
import { hiddenProgress } from '../actions/progress.action';
import { RootState } from '../entities/state.entity';
import { AuthencationService } from '../services/authentication.service';
import { MedicalServiceService } from '../services/medicalService.service';
import StoreConstants from '../utils/store.constant';

@Injectable()
export class MedicalServiceEffect {

    @Effect()
    onLoadMedicalService$ = this.actions$.pipe(
        ofType(MedicalServiceAction.onLoadMedicalService),
        mergeMap(() =>
            fromPromise(this.medicalServiceService.onLoadMedicalService())
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalServiceSuccess({ medicalServices: val.entity }),
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
    onLoadMedicalServiceFilter$ = this.actions$.pipe(
        ofType(MedicalServiceAction.onLoadMedicalServiceFilter),
        mergeMap((action: Action & MedicalServiceReport) =>
            fromPromise(this.medicalServiceService.onLoadMedicalServiceFilter(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalServiceFilterSuccess({ medicalServiceFilter: val.entity }),
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
    onCreateMedicalService$ = this.actions$.pipe(
        ofType(MedicalServiceAction.onCreateMedicalService),
        mergeMap((action: Action & { medicalService: MedicalService, medicalServiceFilter: MedicalServiceReport }) =>
            fromPromise(this.medicalServiceService.onCreateMedicalService(action.medicalService))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalServiceFilter(action.medicalServiceFilter),
                            onLoadMedicalServiceTag(),
                            showNotify({
                                notifyType: 'success',
                                message: StoreConstants.CREATE_SERVICE_SUCESSFULLY + ' '
                                    + `<span class='f-w-700 primary-color'>${val.entity?.name}</span>`
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
    onUpdateMedicalService$ = this.actions$.pipe(
        ofType(MedicalServiceAction.onUpdateMedicalService),
        mergeMap((action: Action & MedicalService) =>
            fromPromise(this.medicalServiceService.onUpdateMedicalService(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            showNotify({
                                notifyType: 'success',
                                message: StoreConstants.UPDATE_SERVICE_SUCESSFULLY + ' '
                                    + `<span class='f-w-700 primary-color'>${val.entity?.name}</span>`
                            }),
                            onLoadMedicalServiceByIdSuccess(val.entity),
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
    onRemoveMedicalService$ = this.actions$.pipe(
        ofType(MedicalServiceAction.onRemoveMedicalService),
        mergeMap((action: Action & MedicalService) =>
            fromPromise(this.medicalServiceService.onRemoveMedicalService(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            showNotify({
                                notifyType: 'success',
                                message: StoreConstants.DELETE_SERVICE_SUCESSFULLY + ' '
                                    + `<span class='f-w-700 primary-color'>${action?.name}</span>`
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
    onLoadMedicalServiceById$ = this.actions$.pipe(
        ofType(MedicalServiceAction.onLoadMedicalServiceById),
        mergeMap((action: Action & MedicalService) =>
            fromPromise(this.medicalServiceService.onLoadMedicalServiceById(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalServiceByIdSuccess(val.entity),
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
    onLoadMedicalServiceTag$ = this.actions$.pipe(
        ofType(MedicalServiceAction.onLoadMedicalServiceTag),
        mergeMap(() =>
            fromPromise(this.medicalServiceService.onLoadMedicalServiceTag())
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalServiceTagSuccess({ medicalServiceTag: val.entity }),
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
        private medicalServiceService: MedicalServiceService,
        private store: Store<RootState>,
        private authenService: AuthencationService
    ) { }
}
