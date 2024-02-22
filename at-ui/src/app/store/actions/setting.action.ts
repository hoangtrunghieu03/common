import { createAction, props } from "@ngrx/store"
import Setting from '../../../../../at-common/model/Setting';


export const SettingAction = {
    onLoadSettings: '[Setting] load all setting',
    onLoadSettingsSuccess: '[Setting] load all setting successfully',

    onCreateSetting: '[Setting] create setting',
    onUpdateSetting: '[Setting] update setting',
}

export const onLoadSettings = createAction(SettingAction.onLoadSettings);
export const onLoadSettingsSuccess = createAction(SettingAction.onLoadSettingsSuccess,
    props<{ settings: Setting[] }>()
)

export const onCreateSetting = createAction(SettingAction.onCreateSetting,
    props<Setting>()
)
export const onUpdateSetting = createAction(SettingAction.onUpdateSetting,
    props<Setting>()
)