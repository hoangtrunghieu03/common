import { createAction, props } from "@ngrx/store"
import MedicalServiceGroup from "../../../../../at-common/model/MedicalServiceGroup";

export const MedicalServiceGroupAction = {
    onLoadMedicalServiceGroup: '[MedicalServiceGroup] on load Medical Service Group',
    onLoadMedicalServiceGroupSuccess: '[MedicalServiceGroup] on load Medical Service Group successfully',
}

export const onLoadMedicalServiceGroup = createAction( MedicalServiceGroupAction.onLoadMedicalServiceGroup );
export const onLoadMedicalServiceGroupSuccess = createAction( MedicalServiceGroupAction.onLoadMedicalServiceGroupSuccess, 
    props<{medicalServiceGroups: MedicalServiceGroup[]}>()
)