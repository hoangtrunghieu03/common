import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import DataAccess from '../../../../../at-common/model/DataAccess';
import Role from '../../../../../at-common/model/Role';
import DataAccessManager from '../../../../../at-common/model/manager/DataAccessManager';
import RoleManager from '../../../../../at-common/model/manager/RoleManager';
import { showProgress } from '../actions/progress.action';
import { RootState } from '../entities/state.entity';

@Injectable()
export class RolesService {

    constructor(
        private store: Store<RootState>) {
    }

    async onLoadRoles(): Promise<HttpStatus<Role[]>> {
        this.store.dispatch(showProgress());
        const roleManager = new RoleManager(null);
        roleManager.classInfo.endPoint = roleManager.classInfo.endPoint.concat('');
        return roleManager.search(null);
    }

    async onLoadRolesList(): Promise<HttpStatus<Role[]>> {
        this.store.dispatch(showProgress());
        const roleListManager = new RoleManager(null);
        roleListManager.classInfo.endPoint = roleListManager.classInfo.endPoint.concat('/roleList');
        return roleListManager.search(null);
    }

    async onloadRoleItem(action): Promise<HttpStatus<Role>> {
        this.store.dispatch(showProgress());
        const roleListManager = new RoleManager(null);
        let id = action.roleId;
        return roleListManager.get(id);
    }

    async onGetDataAccess(): Promise<HttpStatus<DataAccess[]>> {
        this.store.dispatch(showProgress());
        const dataAccessManager = new DataAccessManager(null);
        return dataAccessManager.search(null)
    }

    async createRole(roles: Role): Promise<HttpStatus<Role>> {
        this.store.dispatch(showProgress());
        const roleManager = new RoleManager(null);
        return roleManager.insert(roles);
    }

    async onUpdateRole(roles): Promise<HttpStatus<Role>> {
        this.store.dispatch(showProgress());
        const roleManager = new RoleManager(null);
        return roleManager.update({ _id: roles._id }, roles);
    }

    async onDeleteRole(roles): Promise<HttpStatus<boolean>> {
        this.store.dispatch(showProgress());
        const roleManager = new RoleManager(null);
        return roleManager.delete(roles);
    }
}
