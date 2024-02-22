import { Action } from '@ngrx/store';
import { createReducer, on } from '../utils/store.util';
import { MedicalServiceGroupState, MedicalServiceState } from '../entities/state.entity';
import { onCreateMedicalService, onLoadMedicalService, onLoadMedicalServiceFilter, onLoadMedicalServiceFilterSuccess, onLoadMedicalServiceSuccess, onLoadMedicalServiceById, onLoadMedicalServiceByIdSuccess, onUpdateMedicalService, onRemoveMedicalService, onLoadMedicalServiceTag, onLoadMedicalServiceTagSuccess } from '../actions/medicalService.action';

const initialState: MedicalServiceState = {
    medicalServiceItem: null,
    medicalServices: [],
    medicalServiceFilter: [],
    medicalServiceTag: [],
    message: ''
};

export const reducer = createReducer(
    initialState,
    on(onLoadMedicalService, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalServiceSuccess, (state, action) => ({
        ...state,
        medicalServices: action.medicalServices
    })),
    on(onCreateMedicalService, (state, action) => ({
        ...state
    })),
    on(onUpdateMedicalService, (state, action) => ({
        ...state
    })),
    on(onRemoveMedicalService, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalServiceById, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalServiceByIdSuccess, (state, action) => ({
        ...state,
        medicalServiceItem: action
    })),
    on(onLoadMedicalServiceFilter, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalServiceFilterSuccess, (state, action) => ({
        ...state,
        medicalServiceFilter: action.medicalServiceFilter
    })),
    on(onLoadMedicalServiceTag, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalServiceTagSuccess, (state, action) => ({
        ...state,
        medicalServiceTag: action.medicalServiceTag
    })),
);

export function medicalServiceReducer(state: MedicalServiceState | undefined, action: Action) {
  return reducer(state, action);
}
