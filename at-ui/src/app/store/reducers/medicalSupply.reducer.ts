import { Action } from '@ngrx/store';
import { createReducer, on } from '../utils/store.util';

import { onCreateMedicalSupply, onLoadMedicalSupplyFilterSuccess, onLoadMedicalSupplyFilter, onLoadMedicalSupply, onLoadMedicalSupplySuccess, onImportMedicalSupply, onExportMedicalSupply, onAdjustMedicalInput, onLoadMedicalSupplyById, onLoadMedicalSupplyByIdSuccess, onUpdateMedicalSupply, onRemoveMedicalSupply , onLoadMedicalSupplyUnit , onLoadMedicalSupplyUnitSuccess, onReturnMedicalSupply, adjustMedicalSupplyByRoom } from '../actions/medicalSupply.action';
import { MedicalSupplyState } from '../entities/state.entity';

const initialState: MedicalSupplyState = {
    medicalSupply: [],
    medicalSupplyItem: null,
    medicalSupplyFilter: [],
    medicalSupplyUnit: []
};

export const reducer = createReducer(
    initialState,
    on(onLoadMedicalSupply, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalSupplySuccess, (state, action) => ({
        ...state,
        medicalSupply: action.medicalSupply,
    })),
    on(onCreateMedicalSupply, (state, action) => ({
        ...state
    })),
    on(onUpdateMedicalSupply, (state, action) => ({
        ...state
    })),
    on(onRemoveMedicalSupply, (state, action) => ({
        ...state
    })),
    on(onImportMedicalSupply, (state, action) => ({
        ...state
    })),
    on(onExportMedicalSupply, (state, action) => ({
        ...state
    })),
    on(onAdjustMedicalInput, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalSupplyById, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalSupplyByIdSuccess, (state, action) => ({
        ...state,
        medicalSupplyItem: action,
    })),
    on(onLoadMedicalSupplyFilter, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalSupplyFilterSuccess, (state, action) => ({
        ...state,
        medicalSupplyFilter: action.medicalSupplyFilter,
    })),
    on(onLoadMedicalSupplyUnit , (state , action) =>({
        ...state
    })),
    on(onLoadMedicalSupplyUnitSuccess ,(state , action) =>({
        ...state,
        medicalSupplyUnit : action.medicalSupplyUnit,
    })),
    on(onReturnMedicalSupply ,(state , action) =>({
      ...state,
    })),
    on(adjustMedicalSupplyByRoom ,(state , action) =>({
      ...state,
    })),


);

export function medicalSupplyReducer(state: MedicalSupplyState | undefined, action: Action) {
    return reducer(state, action);
}
