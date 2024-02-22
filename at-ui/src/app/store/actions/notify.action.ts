
import { createAction, props } from '@ngrx/store';
import { NotificationState } from '../entities/state.entity';

export const NotifyActions = {
  showNotify: '[App] Show Notification',
  closeNotify: '[App] Close Notification'
};

export const showNotify = createAction(NotifyActions.showNotify,
  props<NotificationState>()
);

export const closeNotify = createAction(NotifyActions.closeNotify);
