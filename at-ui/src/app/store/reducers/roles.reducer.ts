import { Action } from '@ngrx/store';
import { createReducer, on } from '../utils/store.util';
import {
    onGetDataAccess,
    onGetDataAccessSuccess,
    onLoadRoles,
    onLoadRolesSuccess,
    createRole,
    onLoadRolesList,
    onLoadRolesListSuccess,
    onloadRoleItem,
    onloadRoleItemSuccess,
    onUpdateRole,
    onDeleteRole,
    onloadRoleStaffLogin,
    onloadRoleStaffLoginSuccess,
    onClearStateRole
} from '../actions/roles.action';
import { RoleState } from '../entities/state.entity';
import Role from '../../../../../at-common/model/Role';

const initialState: RoleState = {
    roles: [],
    dataAccess: [],
    message: '',
    rolesList: [],
    roleItem: null,
    roleStaffLogin: null,
};

export const reducer = createReducer(
    initialState,
    on(onLoadRoles, (state, action) => ({
        ...state
    })),
    on(onLoadRolesSuccess, (state, action) => ({
        ...state,
        roles: action.roles
    })),
    on(onGetDataAccess, (state, action) => ({
        ...state
    })),
    on(onGetDataAccessSuccess, (state, action) => ({
        ...state,
        dataAccess: action.dataAccess
    })),
    on(createRole, (state, action) => ({
        ...state,
    })),
    on(onLoadRolesList, (state, action) => ({
        ...state
    })),
    on(onLoadRolesListSuccess, (state, action) => ({
        ...state,
        rolesList: action.rolesList
    })),
    on(onloadRoleItem, (state, action) => ({
        ...state,
    })),
    on(onloadRoleItemSuccess, (state, action) => ({
        ...state,
        roleItem: action,
    })),
    on(onloadRoleStaffLogin, (state, action) => ({
        ...state,
    })),
    on(onloadRoleStaffLoginSuccess, (state, action) => ({
        ...state,
        roleStaffLogin: action,
    })),
    on(onUpdateRole, (state, action) => ({
        ...state,
    })),
    on(onDeleteRole, (state, action) => ({
        ...state,
      })),
    on(onClearStateRole, (state, action) => ({
        ...state,
        roles: [],
        dataAccess: [],
        rolesList: [],
        roleItem: null,
        roleStaffLogin: null,
    })),
);

export function rolesReducer(state: RoleState | undefined, action: Action) {
  return reducer(state, action);
}
