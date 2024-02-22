import { Injectable } from '@angular/core';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import SettingManager from '../../../../../at-common/model/manager/SettingManager';
import Setting from '../../../../../at-common/model/Setting';
import { Store } from '@ngrx/store';
import { RootState } from '../entities/state.entity';
import { showProgress } from '../actions/progress.action';

@Injectable()
export class SettingService {

    constructor(
        private store: Store<RootState>
    ) { }

    async onLoadSettings(): Promise<HttpStatus<Setting[]>> {
        this.store.dispatch(showProgress());
        const settingManager = new SettingManager(null);
        return settingManager.search(null);
    }

    async onCreateSetting(setting: Setting): Promise<HttpStatus<Setting>> {
        this.store.dispatch(showProgress());
        const settingManager = new SettingManager(null);
        return settingManager.insert(setting);
    }

    async onUpdateSetting(setting: Setting): Promise<HttpStatus<Setting>> {
        this.store.dispatch(showProgress());
        const settingManager = new SettingManager(null);
        return settingManager.update({ _id: setting._id }, setting);
    }
}