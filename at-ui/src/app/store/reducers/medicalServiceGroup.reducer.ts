import { Action } from '@ngrx/store';
import { createReducer, on } from '../utils/store.util';
import { MedicalServiceGroupState } from '../entities/state.entity';
import { onLoadMedicalServiceGroup, onLoadMedicalServiceGroupSuccess } from '../actions/medicalServiceGroup.action';

const initialState: MedicalServiceGroupState = {
    medicalServiceGroups: [],
    message: ''
};

export const reducer = createReducer(
    initialState,
    on(onLoadMedicalServiceGroup, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalServiceGroupSuccess, (state, action) => ({
        ...state,
        medicalServiceGroups: action.medicalServiceGroups
    })),
);

export function medicalServiceGroupReducer(state: MedicalServiceGroupState | undefined, action: Action) {
  return reducer(state, action);
}
