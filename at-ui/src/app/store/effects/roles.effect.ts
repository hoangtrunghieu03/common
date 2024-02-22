import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

import {
  RolesAction,
  onLoadRolesSuccess,
  onGetDataAccessSuccess,
  onLoadRolesListSuccess,
  onLoadRoles,
  onloadRoleItemSuccess,
  onloadRoleItem,
  onloadRoleStaffLoginSuccess,
 
} from '../actions/roles.action';
import { hiddenProgress } from '../actions/progress.action';
import { showNotify } from '../actions/notify.action';
import { RootState } from '../entities/state.entity';
import { RolesService } from '../services/roles.service';
import Role from '../../../../../at-common/model/Role';
import { Location } from '@angular/common';
import StoreConstants from '../utils/store.constant';
import { AuthencationService } from '../services/authentication.service';

@Injectable()
export class RolesEffect {

    @Effect()
    onLoadRoles$ = this.actions$
    .pipe(
        ofType(RolesAction.onLoadRoles),
        mergeMap(() => fromPromise(this.rolesService.onLoadRoles())
            .pipe(
                mergeMap( result => {
                    return [
                        onLoadRolesSuccess({roles: result.entity}),
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
    onLoadRolesList$ = this.actions$
    .pipe(
        ofType(RolesAction.onLoadRolesList),
        mergeMap(() => fromPromise(this.rolesService.onLoadRolesList())
            .pipe(
                mergeMap( result => {
                    return [
                        onLoadRolesListSuccess({rolesList: result.entity}),
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
    createRole$ = this.actions$.pipe(
        ofType(RolesAction.createRole),
        mergeMap((action: Action & Role) => fromPromise(this.rolesService.createRole(action))
            .pipe(
                mergeMap(value => {
                    this.location.back();
                    return [
                        showNotify({
                            notifyType: 'success', message: StoreConstants.CREATE_ROLE_SUCESSFULLY + ' '
                                + `<span class='f-w-700 primary-color'>${value.entity?.roleName}</span>`
                        }),
                        onLoadRoles(),
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
    public deleteRole$ = this.actions$.pipe(
        ofType(RolesAction.onDeleteRole),
        mergeMap((action: Action & Role) => fromPromise(this.rolesService.onDeleteRole(action))
            .pipe(
                mergeMap(value => {
                    return [
                        showNotify({ notifyType: 'success', message: 'Xóa nhân viên thành công' }),
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
    onGetDataAccess$ = this.actions$
    .pipe(
        ofType(RolesAction.onGetDataAccess),
        mergeMap(() => fromPromise(this.rolesService.onGetDataAccess())
            .pipe(
                mergeMap( result => {
                    return [
                        onGetDataAccessSuccess({dataAccess: result.entity}),
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
    public loadRoleItem$ = this.actions$.pipe(
        ofType(RolesAction.onloadRoleItem),
        mergeMap((action: Action & Role) => fromPromise(this.rolesService.onloadRoleItem(action))
            .pipe(
                mergeMap(value => {
                    return [
                        onloadRoleItemSuccess(value.entity),
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
    public onloadRoleStaffLogin$ = this.actions$.pipe(
        ofType(RolesAction.onloadRoleStaffLogin),
        mergeMap((action: Action & Role) => fromPromise(this.rolesService.onloadRoleItem(action))
            .pipe(
                mergeMap(value => {
                    return [
                        onloadRoleStaffLoginSuccess(value.entity),
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
    public onUpdateRole$ = this.actions$.pipe(
        ofType(RolesAction.onUpdateRole),
        mergeMap((action: Action & Role) => fromPromise(this.rolesService.onUpdateRole(action))
            .pipe(
                mergeMap(value => {
                    return [
                        showNotify({
                            notifyType: 'success', message: StoreConstants.UPDATE_ROLE_SUCESSFULLY + ' '
                                + `<span class='f-w-700 primary-color'>${value.entity?.roleName}</span>`
                        }),
                        onloadRoleItem({ roleId: value.entity?._id }),
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

    constructor(private actions$: Actions,
        private rolesService: RolesService,
        private store: Store<RootState>,
        private location: Location,
        private authenService: AuthencationService) {
    }
}
