import { Action } from '@ngrx/store';
import { createReducer, on } from '../utils/store.util';
import { MedicalComboServiceState } from '../entities/state.entity';
import { onLoadMedicalComboService, onLoadMedicalComboServiceSuccess, onLoadMedicalComboServiceByIdSuccess, onLoadMedicalComboServiceById, onCreateMedicalComboService, onUpdateMedicalComboService, onRemoveMedicalComboService } from '../actions/medicalComboService.action';

const initialState: MedicalComboServiceState = {
    medicalComboServiceItem: null,
    medicalComboServices: [],
    medicalComboServiceFilter: [],
    message: ''
};

export const reducer = createReducer(
    initialState,
    on(onLoadMedicalComboService, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalComboServiceSuccess, (state, action) => ({
        ...state,
        medicalComboServices: action.medicalComboServices
    })),
    on(onCreateMedicalComboService, (state, action) => ({
        ...state
    })),
    on(onUpdateMedicalComboService, (state, action) => ({
        ...state
    })),
    on(onRemoveMedicalComboService, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalComboServiceById, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalComboServiceByIdSuccess, (state, action) => ({
        ...state,
        medicalComboServiceItem: action
    })),
    // on(onLoadMedicalComboServiceFilter, (state, action) => ({
    //     ...state
    // })),
    // on(onLoadMedicalComboServiceFilterSuccess, (state, action) => ({
    //     ...state,
    //     medicalComboServiceFilter: action.medicalComboServiceFilter
    // })),
);

export function medicalComboServiceReducer(state: MedicalComboServiceState | undefined, action: Action) {
    return reducer(state, action);
}