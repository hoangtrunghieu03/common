import { Action } from '@ngrx/store';
import { createReducer, on } from '../utils/store.util';

import { 
    loadStaffSuccess,loadStaff, createStaff, onUpdateStaff, deleteStaff, loadStaffItem, loadStaffItemSuccess, clearStateStaff, onLoadStaffFilter, onLoadStaffFilterSuccess, loadStaffLogin, loadStaffLoginSuccess
} from '../actions/staffs.action';
import { StaffsState, ProgressState } from '../entities/state.entity';
import Staffs from '../../../../../at-common/model/Staffs';

const initialState: StaffsState = {
  staffList: [],
  staffItem: new Staffs(),
  staffLogin: new Staffs(),
  staffFilter: null,
  message: '',
};

export const reducer = createReducer(
  initialState,
  on(loadStaff, (state, action) => ({
    ...state,
  })),
  on(loadStaffSuccess, (state, action) => ({
    ...state,
    staffList: action.staffList,
  })),
  on(createStaff, (state, action) => ({
    ...state,
  })),
  on(onUpdateStaff, (state, action) => ({
    ...state,
  })),
  on(deleteStaff, (state, action) => ({
    ...state,
  })),
  on(loadStaffItem, (state, action) => ({
    ...state,
  })),
  on(loadStaffItemSuccess, (state, action) => ({
    ...state,
    staffItem: action,
  })),
  on(loadStaffLogin, (state, action) => ({
    ...state,
  })),
  on(loadStaffLoginSuccess, (state, action) => ({
    ...state,
    staffLogin: action,
  })),
  on(onLoadStaffFilter, (state, action) => ({
    ...state,
  })),
  on(onLoadStaffFilterSuccess, (state, action) => ({
    ...state,
    staffFilter: action.staffs,
  })),
  on(clearStateStaff, (state, action) => ({
    ...state,
    staffItem: null,
    staffLogin: null,
  })),
);

export function staffReducer(state: StaffsState | undefined, action: Action) {
  return reducer(state, action);
}
