import {Injectable} from '@angular/core';
import {Actions, Effect, ofType, ROOT_EFFECTS_INIT} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {  mergeMap, catchError, map, tap, takeUntil } from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import { hiddenProgress } from '../actions/progress.action';
import Staffs from '../../../../../at-common/model/Staffs';
import { Router } from '@angular/router';
import { AuthencationService } from '../services/authentication.service';
import { AuthencationActions, loadAuthencation, loginSucess, logout, onClearStateAuthen } from '../actions/authentication.action';
import { showNotify } from '../actions/notify.action';
import { of } from 'rxjs';
import { HandleError, NotificationState, RootState } from '../entities/state.entity';
import { TypedAction } from '@ngrx/store/src/models';
import { onClearStateRole, onloadRoleItem, onloadRoleStaffLogin } from '../actions/roles.action';
import { DestroySubsribeService } from '../../shared/service/destroySubscribe.service';
import Role from '../../../../../at-common/model/Role';
import { Menu, NavService } from 'src/app/shared/service/nav.service';
import StoreConstants from '../utils/store.constant';
import DataAccess from '../../../../../at-common/model/DataAccess';
import { clearStateStaff } from '../actions/staffs.action';
import { WebSocketService } from 'src/app/shared/service/web-socket.service';

@Injectable()
export class AuthencationEffect {

    @Effect()
    login$ = this.actions$
    .pipe(
        ofType(AuthencationActions.login),
        mergeMap((action: Action & Staffs) => fromPromise(this.authenService.login(action))
            .pipe(
                mergeMap(value => {
                    localStorage.setItem('id_token', value.entity?.token);
                    this.onActiveMenu(value.entity?.dataAccess, []);
                    this.handleLoginStatus(value);
                    return [
                        loginSucess(value.entity),
                        hiddenProgress()];
                }),
                catchError(err => of( showNotify({
                    notifyType: 'error',
                    message:  err?.message
                    }), hiddenProgress()))
            )
        )
    );

    @Effect()
    logout$ = this.actions$
        .pipe(
            ofType(AuthencationActions.logout),
            mergeMap(value => {
                this.onClearState();
                this.onClearWebSocket();
                return [
                    hiddenProgress()
                ];
            }),
            catchError((err) => (
                [hiddenProgress()]
            ))
        );


    @Effect()
    loadAuthenInit$ = this.actions$
    .pipe(
        ofType(AuthencationActions.loadAuthencationInit, ROOT_EFFECTS_INIT),
        map(() =>
                loadAuthencation(this.authenService.loadAuthencation())
        )
    );

    @Effect({ dispatch: false })
    loadUnAuthen$ = this.actions$
    .pipe(
        ofType(AuthencationActions.loadUnAuthencation),
        tap((action: Action & HandleError) => {
            this.handleShowMessage(StoreConstants.LOGIN_SESSION);
            this.onClearState();
            return []
        })
    );

    handleLoginStatus = (loginValue):void => {
        switch (typeof loginValue.entity === 'object') {
            case true:
            this.handleShowMessage(`Chào <span class='f-w-700 primary-color'>${loginValue.entity?.fullName}</span>`)

            break

            default:
            this.handleShowMessage(loginValue.entity)
            break
        }
    }

    handleShowMessage = (statusLogin: string):void => {
        this.store.dispatch(showNotify({notifyType: 'success', message: statusLogin}))
    }

    @Effect()
    onForgotPassword$ = this.actions$
        .pipe(
            ofType(AuthencationActions.onForgotPassword),
            mergeMap((action: Action & Staffs) => fromPromise(this.authenService.onForgotPassword(action))
                .pipe(
                    mergeMap(value => {
                        let email: string = action.email;
                        return [
                            showNotify({ notifyType: 'error', message: `Vui lòng check email ${email}` }),
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
    onResetPassword$ = this.actions$
        .pipe(
            ofType(AuthencationActions.onResetPassword),
            mergeMap((action: Action & Staffs) => fromPromise(this.authenService.onResetPassword(action))
                .pipe(
                    mergeMap(value => {
                        return [
                            showNotify({ notifyType: 'error', message: `Mật khẩu của bạn đã được đặt lại` }),
                        ]
                    }), catchError(err =>
                        this.authenService.handleAuthError(err, of(showNotify({
                            notifyType: 'error',
                            message: err.message
                        }), hiddenProgress()))
                    ))
            )
        )

    onActiveMenu = (dataAccessesRole, dataAccess) => {
        let dataAccessList: DataAccess[] = [...dataAccessesRole.concat(dataAccess)];
        dataAccessList.sort((a, b) => {
            return Number(a.groupOrder) - Number(b.groupOrder);
        });

        for (const menu of this.menuItems) {
            if (window.innerWidth < 768) {
                if (!menu.classes) {
                    if (!menu.children) {
                        if (dataAccessList.some(x => x.dataAccessName.toLocaleLowerCase() == menu.title.toLocaleLowerCase())) {
                            this.router.navigate([menu.path]);
                            return this.store.dispatch(hiddenProgress());
                        }
                    }
                    if (menu.children) {
                        for (const submenu of menu.children) {
                            if (dataAccessList.some(x => x.dataAccessName.toLocaleLowerCase() == submenu.title.toLocaleLowerCase())) {
                                this.router.navigate([submenu.path]);
                                return this.store.dispatch(hiddenProgress());
                            }
                        }
                    }
                }
            } else {
                if (!menu.children) {
                    if (dataAccessList[0].dataAccessName.toLocaleLowerCase() == menu.title.toLocaleLowerCase()) {
                        this.router.navigate([menu.path]);
                        return this.store.dispatch(hiddenProgress());
                    }
                }
                if (menu.children) {
                    for (const submenu of menu.children) {
                        if (dataAccessList[0].dataAccessName.toLocaleLowerCase() == submenu.title.toLocaleLowerCase()) {
                            this.router.navigate([submenu.path]);
                            return this.store.dispatch(hiddenProgress());
                        }
                    }
                }
            }
        }
    }

    onClearState = () => {
        this.store.dispatch(onClearStateRole());
        this.store.dispatch(clearStateStaff());
        this.store.dispatch(onClearStateAuthen());
        localStorage.clear();
        this.router.navigate(['/dang-nhap']);
    }
    onClearWebSocket() {
      this.webSocketService.closeWebSocket();
    }

    constructor(
        private actions$: Actions,
        private router: Router,
        private authenService: AuthencationService,
        private store: Store<RootState>,
        private webSocketService : WebSocketService,
        private destroy: DestroySubsribeService,
        private navServices: NavService) {
        this.navServices.items.subscribe(menuItems => {
            this.menuItems = menuItems;
        })
    }

    public menuItems: Menu[] = [];
}
