import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, mergeMap } from 'rxjs/operators';

import { Router } from '@angular/router';
import MedicalSchedule from '../../../../../at-common/model/MedicalSchedule';
import MedicalScheduleReport from '../../../../../at-common/model/MedicalScheduleReport';
import { SCHEDULE_STATUS } from '../../../../../at-common/model/enum';
import {
    MedicalScheduleAction, onLoadArcMakingFilter, onLoadArcMakingFilterSuccess, onLoadMedicalScheduleById, onLoadMedicalScheduleByIdSuccess, onLoadMedicalScheduleCustomerQRSuccess, onLoadMedicalScheduleFilter, onLoadMedicalScheduleFilterSuccess, onLoadMedicalScheduleStatusWait, onLoadMedicalScheduleStatusWaitSuccess
} from '../actions/medicalSchedule.action';
import { showNotify } from '../actions/notify.action';
import { hiddenProgress } from '../actions/progress.action';
import { RootState } from '../entities/state.entity';
import { AuthencationService } from '../services/authentication.service';
import { MedicalScheduleService } from '../services/medicalSchedule.service';
import StoreConstants from '../utils/store.constant';

@Injectable()
export class MedicalScheduleEffect {

    @Effect()
    onLoadMedicalScheduleById$ = this.actions$.pipe(
        ofType(MedicalScheduleAction.onLoadMedicalScheduleById),
        mergeMap((action: Action & MedicalSchedule) =>
            fromPromise(this.medicalScheduleService.onLoadMedicalScheduleById(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalScheduleByIdSuccess(val.entity),
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
    onLoadMedicalScheduleCustomerQR$ = this.actions$.pipe(
        ofType(MedicalScheduleAction.onLoadMedicalScheduleCustomerQR),
        mergeMap((action: Action & MedicalSchedule) =>
            fromPromise(this.medicalScheduleService.onLoadMedicalScheduleCustomerQR(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalScheduleCustomerQRSuccess(val.entity),
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
    onCreateMedicalSchedule$ = this.actions$.pipe(
        ofType(MedicalScheduleAction.onCreateMedicalSchedule),
        mergeMap((action: Action & { medicalSchedule: MedicalSchedule, scheduleReport: MedicalScheduleReport }) =>
            fromPromise(this.medicalScheduleService.onCreateMedicalSchedule(action.medicalSchedule))
                .pipe(
                    mergeMap((val) => {
                        action.scheduleReport && this.store.dispatch(onLoadMedicalScheduleFilter(action.scheduleReport));
                        return [
                            showNotify({ notifyType: 'success', message: StoreConstants.CREATE_SCHEDULE_SUCESSFULLY }),
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
    onUpdateMedicalSchedule$ = this.actions$.pipe(
        ofType(MedicalScheduleAction.onUpdateMedicalSchedule),
        mergeMap((action: Action & MedicalSchedule) =>
            fromPromise(this.medicalScheduleService.onUpdateMedicalSchedule(action))
                .pipe(
                    mergeMap((val) => {
                        let _id = action._id;
                        return [
                            onLoadMedicalScheduleById({ _id: _id }),
                            showNotify({ notifyType: 'success', message: StoreConstants.UPDATE_SCHEDULE_SUCESSFULLY }),
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
    onRemoveMedicalSchedule$ = this.actions$.pipe(
        ofType(MedicalScheduleAction.onRemoveMedicalSchedule),
        mergeMap((action: Action & MedicalSchedule) =>
            fromPromise(this.medicalScheduleService.onRemoveMedicalSchedule(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            showNotify({ notifyType: 'success', message: StoreConstants.DELETE_SCHEDULE_SUCESSFULLY }),
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
    onUpdateMedicalScheduleStatus$ = this.actions$.pipe(
        ofType(MedicalScheduleAction.onUpdateMedicalScheduleStatus),
        mergeMap((action: Action & MedicalSchedule) =>
            fromPromise(this.medicalScheduleService.onUpdateMedicalScheduleStatus(action))
                .pipe(
                    mergeMap((val) => {
                        this.onLoadFiterSchedule();
                        return [
                          showNotify({
                              notifyType: 'success', message: val.entity?.status !== SCHEDULE_STATUS.ARRIVED ?
                                  StoreConstants.UPDATE_SCHEDULE_STATUS_SUCESSFULLY : StoreConstants.RECEIVE_SCHEDULE_SUCESSFULLY
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
    onLoadFiterSchedule(): void {
      let filtersWait =  new MedicalScheduleReport();
      let filterWait = { ...filtersWait.filter }
      filterWait.status =  SCHEDULE_STATUS.WAIT_ACCEPT;
      filtersWait.filter = filterWait;
      this.store.dispatch(onLoadMedicalScheduleStatusWait(filtersWait));
      let filters =  new MedicalScheduleReport();
      let filter = { ...filters.filter }
      filters.filter = filter;
      this.store.dispatch(onLoadMedicalScheduleFilter(filters));
    }
    @Effect()
    onMedicalScheduleReminder$ = this.actions$.pipe(
        ofType(MedicalScheduleAction.onMedicalScheduleReminder),
        mergeMap((action: Action & MedicalSchedule) =>
            fromPromise(this.medicalScheduleService.onMedicalScheduleReminder(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            showNotify({ notifyType: 'success', message: StoreConstants.REMIND_SCHEDULE_SUCESSFULLY }),
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
    onConfirmSchedule$ = this.actions$.pipe(
        ofType(MedicalScheduleAction.onConfirmSchedule),
        mergeMap((action: Action & MedicalSchedule) =>
            fromPromise(this.medicalScheduleService.onConfirmSchedule(action))
                .pipe(
                    mergeMap((val) => {
                      this.router.navigate(['lich-hen']);
                        return [

                            showNotify({ notifyType: 'success', message: StoreConstants.CONFIRM_SCHEDULE_SUCESSFULLY }),
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
    onLoadMedicalScheduleFilter$ = this.actions$.pipe(
        ofType(MedicalScheduleAction.onLoadMedicalScheduleFilter),
        mergeMap((action: Action & MedicalScheduleReport) =>
            fromPromise(this.medicalScheduleService.onLoadMedicalScheduleFilter(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalScheduleFilterSuccess({ medicalSchedule: val.entity }),
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
    onLoadMedicalScheduleStatusWait$ = this.actions$.pipe(
        ofType(MedicalScheduleAction.onLoadMedicalScheduleStatusWait),
        mergeMap((action: Action & MedicalScheduleReport) =>
            fromPromise(this.medicalScheduleService.onLoadMedicalScheduleFilter(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                          onLoadMedicalScheduleStatusWaitSuccess({ medicalSchedule: val.entity }),
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
    onLoadArcMakingFilter$ = this.actions$.pipe(
        ofType(MedicalScheduleAction.onLoadArcMakingFilter),
        mergeMap((action: Action & MedicalScheduleReport) =>
            fromPromise(this.medicalScheduleService.onLoadArcMakingFilter(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadArcMakingFilterSuccess({ arcMaking: val.entity }),
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
    onUpdateStatusArcMaking$ = this.actions$.pipe(
        ofType(MedicalScheduleAction.onUpdateStatusArcMaking),
        mergeMap((action: any) =>
            fromPromise(this.medicalScheduleService.onUpdateStatusArcMaking(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadArcMakingFilter(action.scheduleReport),
                            showNotify({ notifyType: 'success', message: StoreConstants.UPDATE_SUCESSFULLY }),
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
    onConfirmArcMaking$ = this.actions$.pipe(
        ofType(MedicalScheduleAction.onConfirmArcMaking),
        mergeMap((action: any) =>
            fromPromise(this.medicalScheduleService.onConfirmArcMaking(action.medicalSchedule))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadArcMakingFilter(action.scheduleReport),
                            showNotify({ notifyType: 'success', message: StoreConstants.UPDATE_SUCESSFULLY }),
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
        private medicalScheduleService: MedicalScheduleService,
        private store: Store<RootState>,
        private authenService: AuthencationService,
        private router: Router
    ) { }
}
