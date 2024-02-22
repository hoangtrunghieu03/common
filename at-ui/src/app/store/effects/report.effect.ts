import { onLoadReportSupplyInventoryByRoomSuccess, onLoadReportSupplyInventoryByRoomDetailSuccess } from './../actions/report.action';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, mergeMap } from 'rxjs/operators';

import ReportRevenue from '../../../../../at-common/model/ReportRevenue';
import { showNotify } from '../actions/notify.action';
import { hiddenProgress } from '../actions/progress.action';
import { onLoadReportRevenueGeneralDetailSuccess, onLoadReportRevenueGeneralSuccess, onLoadReportRoomSuccess, onLoadReportStaffDetailSuccess, onLoadReportStaffsSuccess, onLoadReportSupplyInventorySuccess, onLoadServiceRevenueSuccess, ReportAction } from '../actions/report.action';
import { ReportService } from '../services/report.service';
import ReportSupply from '../../../../../at-common/model/ReportSupply';
import { AuthencationService } from '../services/authentication.service';

@Injectable()
export class ReportEffect {

    @Effect()
    onLoadReportRevenueGeneral$ = this.actions$
        .pipe(
            ofType(ReportAction.onLoadReportRevenueGeneral),
            mergeMap((action: Action & ReportRevenue) => fromPromise(this.reportService.onLoadReportRevenueGeneral(action))
                .pipe(
                    mergeMap(result => {
                        return [
                            onLoadReportRevenueGeneralSuccess({ reportGeneral: result.entity }),
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
    onLoadReportRevenueGeneralDetail$ = this.actions$
        .pipe(
            ofType(ReportAction.onLoadReportRevenueGeneralDetail),
            mergeMap((action: Action & ReportRevenue) => fromPromise(this.reportService.onLoadReportRevenueGeneralDetail(action))
                .pipe(
                    mergeMap(result => {
                        return [
                            onLoadReportRevenueGeneralDetailSuccess({ reportGeneralDetail: result.entity }),
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
    onLoadReportStaffs$ = this.actions$
        .pipe(
            ofType(ReportAction.onLoadReportStaffs),
            mergeMap((action: Action & ReportRevenue) => fromPromise(this.reportService.onLoadReportStaffs(action))
                .pipe(
                    mergeMap(result => {
                        return [
                            onLoadReportStaffsSuccess({ reportStaffs: result.entity }),
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
    onLoadReportStaffDetail$ = this.actions$
        .pipe(
            ofType(ReportAction.onLoadReportStaffDetail),
            mergeMap((action: Action & ReportRevenue) => fromPromise(this.reportService.onLoadReportStaffDetail(action))
                .pipe(
                    mergeMap(result => {
                        return [
                            onLoadReportStaffDetailSuccess({ reportStaffs: result.entity }),
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
    onLoadReportSupplyInventory$ = this.actions$
        .pipe(
            ofType(ReportAction.onLoadReportSupplyInventory),
            mergeMap((action: Action & ReportSupply) => fromPromise(this.reportService.onLoadReportSupplyInventory(action))
                .pipe(
                    mergeMap(result => {
                        return [
                            onLoadReportSupplyInventorySuccess({ reportInventory: result.entity }),
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
        onLoadReportSupplyInventoryByRoomDetail$ = this.actions$
        .pipe(
            ofType(ReportAction.onLoadReportSupplyInventoryByRoomDetail),
            mergeMap((action: Action & ReportRevenue) => fromPromise(this.reportService.onLoadReportSupplyInventoryByRoomDetail(action))
                .pipe(
                    mergeMap(result => {
                        return [
                          onLoadReportSupplyInventoryByRoomDetailSuccess({ reportInventoryDetail: result.entity }),
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
    onLoadReportSupplyInventoryByRoom$ = this.actions$
        .pipe(
            ofType(ReportAction.onLoadReportSupplyInventoryByRoom),
            mergeMap((action: Action & ReportSupply) => fromPromise(this.reportService.onLoadReportSupplyInventoryByRoom(action))
                .pipe(
                    mergeMap(result => {
                        return [
                            onLoadReportSupplyInventoryByRoomSuccess({ reportInventory: result.entity }),
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
    onLoadServiceRevenue$ = this.actions$
        .pipe(
            ofType(ReportAction.onLoadServiceRevenue),
            mergeMap((action: Action & ReportRevenue) => fromPromise(this.reportService.onLoadServiceRevenue(action))
                .pipe(
                    mergeMap(result => {
                        return [
                            onLoadServiceRevenueSuccess({ revenueService: result.entity }),
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
    onLoadReportRoom$ = this.actions$
        .pipe(
            ofType(ReportAction.onLoadReportRoom),
            mergeMap((action: Action & ReportRevenue) => fromPromise(this.reportService.onLoadReportRoom(action))
                .pipe(
                    mergeMap(result => {
                        return [
                            onLoadReportRoomSuccess({ rooms: result.entity }),
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
        private reportService: ReportService,
        private authenService: AuthencationService) {
    }
}
