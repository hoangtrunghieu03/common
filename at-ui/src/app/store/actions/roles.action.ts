import { createAction, props } from '@ngrx/store';
import DataAccess from '../../../../../at-common/model/DataAccess';
import Role from '../../../../../at-common/model/Role';

export const RolesAction = {
    onLoadRoles: '[ROLE] load all role',
    onLoadRolesSuccess: '[ROLE] load all role successfully',
    onGetDataAccess: '[ROLE] load all data access',
    onGetDataAccessSuccess: '[ROLE] load all data accesssuccessfully',
    onLoadRolesList: '[ROLE] load all roleList',
    onLoadRolesListSuccess: '[ROLE] load all roleList successfully',
    createRole: '[ROLE] create new Role',
    onloadRoleItem: '[ROLE] load Role by Id',
    onloadRoleItemSuccess:'[ROLE] load Role by Id Successfully',
    onloadRoleStaffLogin: '[ROLE] load Role Staff Login',
    onloadRoleStaffLoginSuccess:'[ROLE] load Role Staff Login Successfully',
    onUpdateRole: '[ROLE] update Role',
    onDeleteRole: '[ROLE] delete Role',
    onClearStateRole: '[ROLE] clear State Role',
};

export const onLoadRoles = createAction(RolesAction.onLoadRoles);
export const onLoadRolesSuccess = createAction(RolesAction.onLoadRolesSuccess,
  props<{roles: Role[]}>()
);
export const createRole = createAction(RolesAction.createRole,
  props<Role>()
);

export const onLoadRolesList = createAction(RolesAction.onLoadRolesList);
export const onLoadRolesListSuccess = createAction(RolesAction.onLoadRolesListSuccess,
  props<{rolesList: Role[]}>()
);

export const onloadRoleItem = createAction(RolesAction.onloadRoleItem,
  props<{roleId: string}>()
);

export const onloadRoleItemSuccess = createAction(RolesAction.onloadRoleItemSuccess,
  props<Role>()
);

export const onloadRoleStaffLogin = createAction(RolesAction.onloadRoleStaffLogin,
  props<{roleId: string}>()
);

export const onloadRoleStaffLoginSuccess = createAction(RolesAction.onloadRoleStaffLoginSuccess,
  props<Role>()
);

export const onUpdateRole = createAction(RolesAction.onUpdateRole,
  props<Role>()
);

export const onDeleteRole = createAction(RolesAction.onDeleteRole,
  props<Role>()
);

export const onGetDataAccess = createAction(RolesAction.onGetDataAccess);
export const onGetDataAccessSuccess = createAction(RolesAction.onGetDataAccessSuccess,
  props<{dataAccess: DataAccess[]}>()
);
export const onClearStateRole = createAction(RolesAction.onClearStateRole);

