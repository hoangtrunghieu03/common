import { Action } from '@ngrx/store';
import { createReducer, on } from '../utils/store.util';

import { onConfirmArcMaking, onConfirmSchedule, onCreateMedicalSchedule, onLoadArcMakingFilter, onLoadArcMakingFilterSuccess, onLoadMedicalScheduleById, onLoadMedicalScheduleByIdSuccess, onLoadMedicalScheduleCustomerQR, onLoadMedicalScheduleCustomerQRSuccess, onLoadMedicalScheduleFilter, onLoadMedicalScheduleFilterSuccess, onLoadMedicalScheduleStatusWait, onLoadMedicalScheduleStatusWaitSuccess, onMedicalScheduleReminder, onRemoveMedicalSchedule, onUpdateMedicalSchedule, onUpdateMedicalScheduleStatus, onUpdateStatusArcMaking } from '../actions/medicalSchedule.action';
import { MedicalScheduleState } from '../entities/state.entity';

const initialState: MedicalScheduleState = {
    medicalSchedule: null,
    medicalScheduleFilter: [],
    arcMakingFilter: [],
    medicalScheduleFilterStatusWait: []
};

export const reducer = createReducer(
    initialState,
    on(onLoadMedicalScheduleById, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalScheduleByIdSuccess, (state, action) => ({
        ...state,
        medicalSchedule: action
    })),
    on(onLoadMedicalScheduleCustomerQR, (state, action) => ({
      ...state
    })),
    on(onLoadMedicalScheduleCustomerQRSuccess, (state, action) => ({
        ...state,
        medicalSchedule: action
    })),
    on(onCreateMedicalSchedule, (state, action) => ({
        ...state
    })),
    on(onUpdateMedicalSchedule, (state, action) => ({
        ...state
    })),
    on(onRemoveMedicalSchedule, (state, action) => ({
        ...state
    })),
    on(onUpdateMedicalScheduleStatus, (state, action) => ({
        ...state
    })),
    on(onMedicalScheduleReminder, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalScheduleFilter, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalScheduleFilterSuccess, (state, action) => ({
        ...state,
        medicalScheduleFilter: action.medicalSchedule
    })),
    on(onLoadMedicalScheduleStatusWait, (state, action) => ({
      ...state
    })),
    on(onLoadMedicalScheduleStatusWaitSuccess, (state, action) => ({
        ...state,
        medicalScheduleFilterStatusWait: action.medicalSchedule
    })),
    on(onLoadArcMakingFilter, (state, action) => ({
        ...state
    })),
    on(onLoadArcMakingFilterSuccess, (state, action) => ({
        ...state,
        arcMakingFilter: action.arcMaking
    })),
    on(onUpdateStatusArcMaking, (state, action) => ({
        ...state,
    })),
    on(onConfirmArcMaking, (state, action) => ({
        ...state,
    })),
    on(onConfirmSchedule, (state, action) => ({
      ...state,
  })),
);

export function medicalScheduleReducer(state: MedicalScheduleState | undefined, action: Action) {
    return reducer(state, action);
}
