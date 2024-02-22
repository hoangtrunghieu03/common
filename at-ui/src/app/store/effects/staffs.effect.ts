import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import StoreConstants from '../utils/store.constant';

import {
    loadStaff, loadStaffItem, loadStaffItemSuccess, loadStaffLoginSuccess, loadStaffSuccess, onLoadStaffFilter, onLoadStaffFilterSuccess, StaffAction
} from '../actions/staffs.action';
import { showNotify } from '../actions/notify.action';
import { hiddenProgress } from '../actions/progress.action';
import { StaffsService } from '../services/staffs.service';
import Staff from '../../../../../at-common/model/Staffs';
import { Location } from '@angular/common';
import StaffReport from '../../../../../at-common/model/StaffReport';
import StaffCriterial from '../../../../../at-common/model/StaffCriterial';
import { onloadRoleItem, onloadRoleStaffLogin } from '../actions/roles.action';
import { AuthencationService } from '../services/authentication.service';

@Injectable()
export class StaffEffect {

    @Effect() public loadStaff$ = this.actions$
        .pipe(
            ofType(StaffAction.loadStaff),
            mergeMap(() => fromPromise(this.staffService.loadAllStaff())
                .pipe(
                    mergeMap(value => {
                        return [
                            loadStaffSuccess({ staffList: value.entity }),
                            hiddenProgress()
                        ];
                    }), catchError(err =>
                        this.authenService.handleAuthError(err, of(showNotify({
                            notifyType: 'error',
                            message: err.message
                        }), hiddenProgress()))
                    ))
            ),
        );

    @Effect()
    public createStaff$ = this.actions$.pipe(
        ofType(StaffAction.createStaff),
        mergeMap((action: Action & Staff) => fromPromise(this.staffService.createStaff(action))
            .pipe(
                mergeMap(value => {
                    this.location.back();
                    return [
                        showNotify({
                            notifyType: 'success', message: StoreConstants.CREATE_STAFF_SUCESSFULLY + ' '
                                + `<span class='f-w-700 primary-color'>${value.entity?.fullName}</span>`
                        }),
                        loadStaff(),
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
    public onUpdateStaff$ = this.actions$.pipe(
        ofType(StaffAction.onUpdateStaff),
        mergeMap((action: Action & Staff) => fromPromise(this.staffService.onUpdateStaff(action))
            .pipe(
                mergeMap(value => {
                    let staffFilter = new StaffReport();
                    let filter = new StaffCriterial();
                    staffFilter.filter = filter;
                    return [
                        showNotify({
                            notifyType: 'success', message: StoreConstants.UPDATE_STAFF_SUCESSFULLY + ' '
                                + `<span class='f-w-700 primary-color'>${value.entity?.fullName}</span>`
                        }),
                        loadStaffItem({ staffId: value.entity._id }),
                        onloadRoleItem({ roleId: value.entity.roleId }),
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
    public deleteStaff$ = this.actions$.pipe(
        ofType(StaffAction.deleteStaff),
        mergeMap((action: Action & Staff) => fromPromise(this.staffService.deleteStaff(action))
            .pipe(
                mergeMap(value => {
                    let staffFilter = new StaffReport();
                    let filter = new StaffCriterial();
                    staffFilter.filter = filter;
                    return [
                        showNotify({ notifyType: 'success', message: 'Xóa nhân viên thành công' }),
                        onLoadStaffFilter(staffFilter),
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
    public loadStaffItem$ = this.actions$.pipe(
        ofType(StaffAction.loadStaffItem),
        mergeMap((action: Action & Staff) => fromPromise(this.staffService.loadStaffItem(action))
            .pipe(
                mergeMap(value => {
                    return [
                        loadStaffItemSuccess(value.entity),
                        onloadRoleItem({ roleId: value.entity.roleId }),
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
    public loadStaffLogin$ = this.actions$.pipe(
        ofType(StaffAction.loadStaffLogin),
        mergeMap((action: Action & Staff) => fromPromise(this.staffService.loadStaffItem(action))
            .pipe(
                mergeMap(value => {
                    return [
                        loadStaffLoginSuccess(value.entity),
                        onloadRoleStaffLogin({ roleId: value.entity.roleId }),
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

    @Effect() onLoadStaffFilter$ = this.actions$
        .pipe(
            ofType(StaffAction.onLoadStaffFilter),
            mergeMap((filter) => fromPromise(this.staffService.onLoadStaffFilter(filter))
                .pipe(
                    mergeMap(result => {
                        const data: StaffReport | StaffReport[] = result.entity;
                        return [
                            onLoadStaffFilterSuccess({ staffs: data }),
                            hiddenProgress()
                        ]
                    }), catchError(err =>
                        this.authenService.handleAuthError(err, of(showNotify({
                            notifyType: 'error',
                            message: err.message
                        }), hiddenProgress()))
                    )))
        );

        @Effect()
        public onChangeStaffPassword$ = this.actions$.pipe(
            ofType(StaffAction.onChangeStaffPassword),
            mergeMap((action: Action & Staff) => fromPromise(this.staffService.onChangeStaffPassword(action))
                .pipe(
                    mergeMap(value => {
                        let staffFilter = new StaffReport();
                        let filter = new StaffCriterial();
                        staffFilter.filter = filter;
                        return [
                            showNotify({ notifyType: 'success', message: 'Thay đổi mật khẩu thành công' }),
                            hiddenProgress()
                            // onLoadStaffFilter(staffFilter)
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
        private staffService: StaffsService,
        private location: Location,
        private authenService: AuthencationService) {
    }
}
