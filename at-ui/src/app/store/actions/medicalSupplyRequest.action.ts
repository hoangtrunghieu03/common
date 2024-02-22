import { createAction, props } from '@ngrx/store';
import MedicalSupplyExportRequest from '../../../../../at-common/model/MedicalSupplyExportRequest';

export const MedicalSupplyRequestAction = {
    onLoadMedicalSupplyRequest: '[MedicalSupplyRequest] load medical supply export request',
    onLoadMedicalSupplyRequestSuccess: '[MedicalSupplyRequest] load medical supply export request successfully',

    onCreateMedicalSupplyRequest: '[MedicalSupplyRequest] create new medical supply export request',
    onRemoveMedicalSupplyRequest: '[MedicalSupplyRequest] remove medical supply export request',

    onLoadMedicalSupplyRequestById: '[MedicalSupplyRequest] load medical supply export request by id',
    onLoadMedicalSupplyRequestByIdSuccess: '[MedicalSupplyRequest] load medical supply export request by id successfully',
}

/**
 * action load medical supply
 */
export const onLoadMedicalSupplyRequest = createAction(MedicalSupplyRequestAction.onLoadMedicalSupplyRequest)
export const onLoadMedicalSupplyRequestSuccess = createAction(MedicalSupplyRequestAction.onLoadMedicalSupplyRequestSuccess,
    props<{ medicalSupplyRequest: MedicalSupplyExportRequest[] }>()
)
/**
 * action create new medical supply
 */
export const onCreateMedicalSupplyRequest = createAction(MedicalSupplyRequestAction.onCreateMedicalSupplyRequest,
    props<MedicalSupplyExportRequest>()
)
export const onRemoveMedicalSupplyRequest = createAction(MedicalSupplyRequestAction.onRemoveMedicalSupplyRequest,
    props<MedicalSupplyExportRequest>()
)

export const onLoadMedicalSupplyRequestById = createAction(MedicalSupplyRequestAction.onLoadMedicalSupplyRequestById,
    props<{ _id: string }>()
)
export const onLoadMedicalSupplyRequestByIdSuccess = createAction(MedicalSupplyRequestAction.onLoadMedicalSupplyRequestByIdSuccess,
    props<MedicalSupplyExportRequest>()
)