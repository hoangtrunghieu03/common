import { Action } from '@ngrx/store';
import { onLoadNotification, onLoadNotificationSuccess, onUpdateNotification } from '../actions/notification.action';
import { NotificationMedicalState } from '../entities/state.entity';
import { createReducer, on } from '../utils/store.util';

const initialState: NotificationMedicalState = {
    notificationList: [],
    message: ''
};

export const reducer = createReducer(
    initialState,
    on(onLoadNotification, (state, action) => ({
        ...state
    })),
    on(onLoadNotificationSuccess, (state, action) => ({
        ...state,
        notificationList: action.notification
    })),
    on(onUpdateNotification, (state, action) => ({
        ...state,
    })),
);

export function notificationReducer(state: NotificationMedicalState | undefined, action: Action) {
    return reducer(state, action);
}