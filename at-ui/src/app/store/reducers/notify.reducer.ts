
import { Action } from '@ngrx/store';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import {
  showNotify, closeNotify
} from '../actions/notify.action';
import { NotificationState } from '../entities/state.entity';
import StoreConstants from '../utils/store.constant';
import { createReducer, on, StoreUtil } from '../utils/store.util';

const initialState: NotificationState = {
  show: false
};

export const reducer = createReducer(
  initialState,
  on(showNotify, (state, action) => ({
    show: StoreUtil.isNotBlank(action.message),
    notifyType: action.notifyType || 'info',
    message: action.message.includes(HttpStatus.UNAUTHORISED) ? StoreConstants.LOGIN_SESSION : action.message
  })),
  on(closeNotify, () => ({
    show: false
  }))
);

export function notifyReducer(state: NotificationState | undefined, action: Action) {
  return reducer(state, action);
}
