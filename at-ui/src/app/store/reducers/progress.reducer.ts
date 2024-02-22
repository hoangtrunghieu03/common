import { Action } from '@ngrx/store';
import { ProgressState } from '../entities/state.entity';
import { createReducer, on, StoreUtil } from '../utils/store.util';
import { showProgress, hiddenProgress, hiddenProgressSuccess } from '../actions/progress.action';

const initialState: ProgressState = {
  show: false,
  count: null,
};

export const reducer = createReducer(
  initialState,
  on(showProgress, (state, action) => ({
    ...state,
    show: true
  })),
  on(hiddenProgress, (state, action) => {
    return ({
      ...state,
      show: false
    })
  }),
  on(hiddenProgressSuccess, (state, action) => {
    return ({
      ...state,
      count: false + Math.floor(Math.random() * 100000000).toString()
    })
  })
);

export function progressReducer(state: ProgressState | undefined, action: Action) {
  return reducer(state, action);
}
