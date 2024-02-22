import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, mergeMap } from 'rxjs/operators';

import { DashboardAction, onLoadCustomersSuccess, onLoadRevenueDaysSuccess, onLoadMedicalServicesSuccess, onLoadChairStatusSuccess } from '../actions/dashboard.action';
import { showNotify } from '../actions/notify.action';
import { hiddenProgress } from '../actions/progress.action';
import { AuthencationService } from '../services/authentication.service';
import { DashboardService } from '../services/dashboard.service';

@Injectable()
export class DashboardEffect {

    @Effect()
    onLoadRevenueDays$ = this.actions$
        .pipe(
            ofType(DashboardAction.onLoadRevenueDays),
            mergeMap(() => fromPromise(this.dashboardService.onLoadRevenueDays())
                .pipe(
                    mergeMap(result => {
                        return [
                            onLoadRevenueDaysSuccess({ revenueDay: result.entity }),
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
    onLoadCustomers$ = this.actions$
        .pipe(
            ofType(DashboardAction.onLoadCustomers),
            mergeMap(() => fromPromise(this.dashboardService.onLoadCustomers())
                .pipe(
                    mergeMap(result => {
                        return [
                            onLoadCustomersSuccess({ customer: result.entity }),
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
    onLoadMedicalServices$ = this.actions$
        .pipe(
            ofType(DashboardAction.onLoadMedicalServices),
            mergeMap(() => fromPromise(this.dashboardService.onLoadMedicalServices())
                .pipe(
                    mergeMap(result => {
                        return [
                            onLoadMedicalServicesSuccess({ medicalService: result.entity }),
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
    onLoadChairStatus$ = this.actions$
        .pipe(
            ofType(DashboardAction.onLoadChairStatus),
            mergeMap(() => fromPromise(this.dashboardService.onLoadChairStatus())
                .pipe(
                    mergeMap(result => {
                        return [
                            onLoadChairStatusSuccess({ chairStatus: result.entity }),
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
        private dashboardService: DashboardService,
        private authenService: AuthencationService) {
    }
}