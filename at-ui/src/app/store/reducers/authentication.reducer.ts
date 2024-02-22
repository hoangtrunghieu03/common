import {Action, State} from '@ngrx/store';
import { loadAuthencation, login, loginSucess, onClearStateAuthen, onForgotPassword, onResetPassword } from '../actions/authentication.action';
import {AuthencationState} from '../entities/state.entity';
import { AuthencationActions } from './../actions/authentication.action'
import {createReducer, on} from '../utils/store.util';

const initialState: AuthencationState = {
    logged:false,
    userName:null,
    token:null,
    role:null,    
    _id: null,
    roomIds: []
};

export const reducer = createReducer(
    initialState,
    on(login, (state, action) => ({
        ...state
    })),    
    on(loginSucess, (state, action) => ({
        ...state,
        userName : action.userName,
        role : action.role,
        token : action.token,        
        storeId: action.storeId,
        _id: action._id,
        roomIds: action.roomIds
    })),
    on(loadAuthencation, (state, action) => ({
        ...state,
        userName : action.userName,
        role : action.role,
        token : action.token,
        logged : action.logged,
        storeId: action.storeId,
        _id: action._id
    })),
    on(onForgotPassword, (state, action) => ({
        ...state
    })),
    on(onResetPassword, (state, action) => ({
        ...state
    })),
    on(onClearStateAuthen, (state, action) => ({
        ...state,
        userName: null,
        role: null,
        token: null,
        _id: null,
        roomIds: null
    })),
);
export function authencationReducer(state: AuthencationState | undefined, action: Action) {
    if (action.type === AuthencationActions.logout) {
        state = initialState
    }
    return reducer(state, action)
}