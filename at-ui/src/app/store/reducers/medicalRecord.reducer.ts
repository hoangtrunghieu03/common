import Customer from '../../../../../at-common/model/Customer';
import { Action } from '@ngrx/store';
import { createReducer, on } from '../utils/store.util';

import {
    clearStateMedicalRecord,
    onAddMedicalService,
    onAddMedicalServiceIndicates,
    onAddTreatmentProcess,
    onCreateMedicalRecord, onCreateMedicalRecordAndTranferRoom, onCreateMedicalRecordOther, onDeletePayHistoryMedicalRecord, onDeleteTreatmentProcess, onExaminationFinish, onFinishTreatmentProcess, onLoadMedicalRecordById, onLoadMedicalRecordByIdSuccess, onLoadMedicalRecordDetailById, onLoadMedicalRecordDetailByIdSuccess, onLoadMedicalRecordFilter, onLoadMedicalRecordFilterSuccess, onLoadMedicalRecordPaymentHistory, onLoadMedicalRecordPaymentHistorySuccess, onMedicalCustomerChair, onMedicalRecordImages, onMedicalRecordNote, onMedicalRecordPayment, onMedicalServiceCommand, onMedicalSICommand, onReceiveCustomerToRoom, onReExamination, onRemoveExamination, onTransferRoom, onTransferRoomAndResetChair, onUpdateMedicalRecordBrace, onUpdateMedicalRecordGeneral, onUpdateMedicalRecordImplant, onUpdateMedicalRecordName, onUpdateTreatmentProcess,
} from '../actions/medicalRecord.action';
import { MedicalRecordState } from '../entities/state.entity';
import { onLoadMedicalRecordByDate, onLoadMedicalRecordByDateSuccess } from '../actions/medicalRecord.action';

const initialState: MedicalRecordState = {
    medicalRecord: null,
    medicalRecordDetail: null,
    medicalRecordByDate: null,
    medicalRecordFilter: null,
    medicalRecordPaymentHistory: []
};

export const reducer = createReducer(
    initialState,
    on(onCreateMedicalRecord, (state, action) => ({
        ...state
    })),
    on(onCreateMedicalRecordOther, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalRecordById, (state, action) => ({
      ...state,
    })),
    on(onLoadMedicalRecordByIdSuccess, (state, action) => ({
      ...state,
      medicalRecord: action,
    })),
    on(onDeletePayHistoryMedicalRecord, (state, action) => ({
      ...state,
    })),
    on(onLoadMedicalRecordDetailById, (state, action) => ({
      ...state,
    })),
    on(onLoadMedicalRecordDetailByIdSuccess, (state, action) => ({
      ...state,
      medicalRecordDetail: action,
    })),
    on(onLoadMedicalRecordByDate, (state, action) => ({
      ...state,
    })),
    on(onLoadMedicalRecordByDateSuccess, (state, action) => ({
      ...state,
      medicalRecordByDate: action,
    })),
    on(onLoadMedicalRecordPaymentHistory, (state, action) => ({
      ...state,
    })),
    on(onLoadMedicalRecordPaymentHistorySuccess, (state, action) => ({
      ...state,
      medicalRecordPaymentHistory: action.paymentHistory,
    })),
    on(onMedicalRecordPayment, (state, action) => ({
        ...state
    })),
    on(onUpdateMedicalRecordGeneral, (state, action) => ({
        ...state
    })),
    on(onUpdateMedicalRecordBrace, (state, action) => ({
        ...state
    })),
    on(onAddTreatmentProcess, (state, action) => ({
        ...state
    })),
    on(onUpdateTreatmentProcess, (state, action) => ({
        ...state
    })),
    on(onFinishTreatmentProcess, (state, action) => ({
        ...state
    })),
    on(onAddMedicalServiceIndicates, (state, action) => ({
        ...state
    })),
    on(onAddMedicalService, (state, action) => ({
        ...state
    })),
    on(onDeleteTreatmentProcess, (state, action) => ({
      ...state,
    })),
    on(onTransferRoom, (state, action) => ({
      ...state,
    })),
    on(onTransferRoomAndResetChair, (state, action) => ({
      ...state,
    })),
    on(onReceiveCustomerToRoom, (state, action) => ({
      ...state,
    })),
    on(onMedicalCustomerChair, (state, action) => ({
      ...state,
    })),
    on(onMedicalSICommand, (state, action) => ({
        ...state
    })),
    on(onExaminationFinish, (state, action) => ({
        ...state
    })),
    on(onMedicalServiceCommand, (state, action) => ({
        ...state
    })),
    on(onUpdateMedicalRecordImplant, (state, action) => ({
        ...state
    })),
    on(onCreateMedicalRecordAndTranferRoom, (state, action) => ({
        ...state
    })),
    on(onReExamination, (state, action) => ({
        ...state
    })),
    on(onUpdateMedicalRecordName, (state, action) => ({
        ...state
    })),
    on(onRemoveExamination, (state, action) => ({
        ...state
    })),
    on(onMedicalRecordNote, (state, action) => ({
        ...state
    })),
    on(onMedicalRecordImages, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalRecordFilter, (state, action) => ({
      ...state
    })),
    on(onLoadMedicalRecordFilterSuccess, (state, action) => ({
      ...state,
      medicalRecordFilter: action.medicalRecordFilter
    })),
    on(clearStateMedicalRecord, (state, action) => ({
      ...state,
      medicalRecord: null,
      medicalRecordFilter: null,
    })),
);

export function medicalRecordReducer(state: MedicalRecordState | undefined, action: Action) {
    return reducer(state, action);
}
