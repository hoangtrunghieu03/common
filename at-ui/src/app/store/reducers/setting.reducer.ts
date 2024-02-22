import { Action } from '@ngrx/store';
import { onCreateSetting, onLoadSettings, onLoadSettingsSuccess, onUpdateSetting } from '../actions/setting.action';
import { SettingState } from '../entities/state.entity';
import { createReducer, on } from '../utils/store.util';

const initialState: SettingState = {
    settings: [],
    message: ''
};

export const reducer = createReducer(
    initialState,
    on(onLoadSettings, (state, action) => ({
        ...state
    })),
    on(onLoadSettingsSuccess, (state, action) => ({
        ...state,
        settings: action.settings
    })),
    on(onCreateSetting, (state, action) => ({
        ...state
    })),
    on(onUpdateSetting, (state, action) => ({
        ...state
    })),
);

export function settingReducer(state: SettingState | undefined, action: Action) {
  return reducer(state, action);
}