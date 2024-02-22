import { createAction, props } from "@ngrx/store"
import MedicalServiceIndicateGroup from "../../../../../at-common/model/MedicalServiceIndicateGroup";

export const ServiceIndicateGroupAction = {
    onLoadServiceIndicateGroup: '[ServiceIndicateGroup] on load Medical Service Indicate Group',
    onLoadServiceIndicateGroupSuccess: '[ServiceIndicateGroup] on load Medical Service Indicate Group successfully',
}

export const onLoadServiceIndicateGroup = createAction( ServiceIndicateGroupAction.onLoadServiceIndicateGroup );
export const onLoadServiceIndicateGroupSuccess = createAction( ServiceIndicateGroupAction.onLoadServiceIndicateGroupSuccess,
    props<{serviceIndicateGroups: MedicalServiceIndicateGroup[]}>()
)