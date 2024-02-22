import {createAction, props} from '@ngrx/store';
import Staffs from '../../../../../at-common/model/Staffs';
import { AuthencationState, HandleError } from '../entities/state.entity';
// import { AuthenState, HandleError } from '../entities/state.entity';

export const AuthencationActions = {
    login: '[Authencation] Login',
    logout: '[Authencation] Logout',
    loadAuthencation: '[Authencation] Login load Authen',
    loadAuthencationInit: '[Authencation] Login load Authen Init',
    loginSucess: '[Authencation] Login Sucess', 
    loadUnAuthencation: '[Authencation] Login load UnAuthen',

    onForgotPassword: '[Authencation] on forgot password',
    onResetPassword: '[Authencation] on reset password',

    onClearStateAuthen: '[Authencation] clear state authen',
};


export const login = createAction(AuthencationActions.login,
    props<Staffs>()
);
export const loginSucess = createAction(AuthencationActions.loginSucess,
    props<Staffs>()
);

export const logout = createAction(AuthencationActions.logout);

export const loadAuthencationInit = createAction(AuthencationActions.loadAuthencationInit);

export const loadAuthencation = createAction(AuthencationActions.loadAuthencation,
    props<AuthencationState>()
);

export const loadUnAuthencation = createAction(AuthencationActions.loadUnAuthencation,
    props<HandleError>()
);
export const onForgotPassword = createAction(AuthencationActions.onForgotPassword,
    props<Staffs>()
);
export const onResetPassword = createAction(AuthencationActions.onResetPassword,
    props<Staffs>()
);
export const onClearStateAuthen = createAction(AuthencationActions.onClearStateAuthen);
