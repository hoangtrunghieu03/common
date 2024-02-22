import { createAction, props } from "@ngrx/store"
import MedicalComboService from "../../../../../at-common/model/MedicalComboService";

export const MedicalComboServiceAction = {
    onLoadMedicalComboService: '[MedicalComboService] on load Medical Combo Service',
    onLoadMedicalComboServiceSuccess: '[MedicalComboService] on load Medical Combo Service successfully',

    onLoadMedicalComboServiceById: '[MedicalComboService] on load Medical Combo Service By Id',
    onLoadMedicalComboServiceByIdSuccess: '[MedicalComboService] on load Medical Combo Service By Id successfully',

    onCreateMedicalComboService: '[MedicalComboService] on create Medical Combo Service',
    onUpdateMedicalComboService: '[MedicalComboService] on update Medical Combo Service',
    onRemoveMedicalComboService: '[MedicalComboService] on remove Medical Combo Service',
}

export const onLoadMedicalComboService = createAction(MedicalComboServiceAction.onLoadMedicalComboService);
export const onLoadMedicalComboServiceSuccess = createAction(MedicalComboServiceAction.onLoadMedicalComboServiceSuccess,
    props<{ medicalComboServices: MedicalComboService[] }>()
)

export const onLoadMedicalComboServiceById = createAction(MedicalComboServiceAction.onLoadMedicalComboServiceById,
    props<{ _id: string }>());
export const onLoadMedicalComboServiceByIdSuccess = createAction(MedicalComboServiceAction.onLoadMedicalComboServiceByIdSuccess,
    props<MedicalComboService>()
)

export const onCreateMedicalComboService = createAction(MedicalComboServiceAction.onCreateMedicalComboService,
    props<MedicalComboService>()
)
export const onUpdateMedicalComboService = createAction(MedicalComboServiceAction.onUpdateMedicalComboService,
    props<MedicalComboService>()
)
export const onRemoveMedicalComboService = createAction(MedicalComboServiceAction.onRemoveMedicalComboService,
    props<MedicalComboService>()
)
