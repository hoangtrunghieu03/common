import { Action } from '@ngrx/store';
import { createReducer, on } from '../utils/store.util';

import { loadMedicalEquipment, loadMedicalEquipmentSuccess, onLoadMedicalSupplyHistory, 
    onLoadMedicalSupplyHistorySuccess,loadMedicalEquipmentById
    , loadMedicalEquipmentByIdSuccess,onUpdateMedicalEquipment, onRemoveMedicalEquipment, onCreatMedicalEquipment, onLoadUnitSupplyHistory, onLoadUnitSupplyHistorySuccess } from '../actions/medicalEquipment.action';
import { MedicalEquipmentState } from '../entities/state.entity';


const initialState: MedicalEquipmentState = {
    medicalEquipmentList: [],
    medicalEquipmentDetails:null,
    medicalSupplyHistory: null,
    medicalUnitSupplyHistory: []
};

export const reducer = createReducer(
    initialState,
    on(loadMedicalEquipment, (state, action) => ({
        ...state,
    })),
    on(loadMedicalEquipmentSuccess, (state, action) => ({
        ...state,
        medicalEquipmentList: action.medicalEquipmentList,
    })),
    on(loadMedicalEquipmentById, (state, action) => ({
        ...state,
    })),
    on(loadMedicalEquipmentByIdSuccess, (state, action) => ({
        ...state,
        medicalEquipmentDetails:action
    })),
    on(onCreatMedicalEquipment, (state, action) => ({
        ...state
    })),
    on(onUpdateMedicalEquipment, (state, action) => ({
        ...state
    })),
    on(onRemoveMedicalEquipment, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalSupplyHistory, (state, action) => ({
        ...state,
    })),
    on(onLoadMedicalSupplyHistorySuccess, (state, action) => ({
        ...state,
        medicalSupplyHistory: action.medicalSupplyHistoryReport,
    })),
    on(onLoadUnitSupplyHistory, (state, action) => ({
        ...state,
    })),
    on(onLoadUnitSupplyHistorySuccess, (state, action) => ({
        ...state,
        medicalUnitSupplyHistory: action.medicalSupplyHistory,
    })),
);

export function medicalEquipmentReducer(state: MedicalEquipmentState | undefined, action: Action) {
    return reducer(state, action);
}

