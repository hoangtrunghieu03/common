import ZaloInfo from '../../../../../at-common/model/ZaloInfo';
import { onAuthZalo, onAuthZaloSuccess, onLoadZaloCurrent, onLoadZaloCurrentSuccess, onUpdateZalo } from '../actions/zalo.action';
import { ZaloState } from './../entities/state.entity';
import { Action, createReducer, on } from "@ngrx/store";



const initialState :ZaloState = {
  zaloInfoList: [],
  zaloInfoItem: new ZaloInfo(),
  zaloAuth: null
};

export const reducer = createReducer(
  initialState,
  on(onLoadZaloCurrent, (state, action) => ({
    ...state
  })),
  on(onLoadZaloCurrentSuccess, (state, action) => ({
      ...state,
      zaloInfoItem: action.zalo
  })),
  on(onAuthZalo, (state, action) => ({
    ...state
  })),
  on(onAuthZaloSuccess, (state, action) => ({
      ...state,
      zaloAuth: action.zaloAuth
  })),
  on(onUpdateZalo, (state, action) => ({
    ...state
  })),

);

export function zaloReducer(state: ZaloState | undefined, action: Action) {
  return reducer(state, action);
}
