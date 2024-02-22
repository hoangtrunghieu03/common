import { Action } from '@ngrx/store';
import { createReducer, on } from '../utils/store.util';

import { MedicalSupplyRequestState } from '../entities/state.entity';
import MedicalSupplyExportRequest from '../../../../../at-common/model/MedicalSupplyExportRequest';
import { onCreateMedicalSupplyRequest, onLoadMedicalSupplyRequest, onLoadMedicalSupplyRequestById, onLoadMedicalSupplyRequestByIdSuccess, onLoadMedicalSupplyRequestSuccess, onRemoveMedicalSupplyRequest } from '../actions/medicalSupplyRequest.action';

const initialState: MedicalSupplyRequestState = {
    medicalSupplyRequest: [],
    medicalSupplyRequestItem: new MedicalSupplyExportRequest(),
};

export const reducer = createReducer(
    initialState,
    on(onLoadMedicalSupplyRequest, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalSupplyRequestSuccess, (state, action) => ({
        ...state,
        medicalSupplyRequest: action.medicalSupplyRequest,
    })),
    on(onCreateMedicalSupplyRequest, (state, action) => ({
        ...state
    })),
    on(onRemoveMedicalSupplyRequest, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalSupplyRequestById, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalSupplyRequestByIdSuccess, (state, action) => ({
        ...state,
        medicalSupplyRequestItem: action,
    })),
);

export function medicalSupplyRequestReducer(state: MedicalSupplyRequestState | undefined, action: Action) {
    return reducer(state, action);
}
