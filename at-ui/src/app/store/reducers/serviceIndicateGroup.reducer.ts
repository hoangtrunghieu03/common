import { Action } from '@ngrx/store';
import { createReducer, on } from '../utils/store.util';
import { ServiceIndicateGroupState } from '../entities/state.entity';
import { onLoadServiceIndicateGroup, onLoadServiceIndicateGroupSuccess } from '../actions/serviceIndicateGroup.action';

const initialState: ServiceIndicateGroupState = {
    serviceIndicateGroups: [],
    message: ''
};

export const reducer = createReducer(
    initialState,
    on(onLoadServiceIndicateGroup, (state, action) => ({
        ...state
    })),
    on(onLoadServiceIndicateGroupSuccess, (state, action) => ({
        ...state,
        serviceIndicateGroups: action.serviceIndicateGroups
    })),
);

export function serviceIndicateGroupReducer(state: ServiceIndicateGroupState | undefined, action: Action) {
  return reducer(state, action);
}
