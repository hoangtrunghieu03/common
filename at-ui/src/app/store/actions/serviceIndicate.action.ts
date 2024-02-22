import { createAction, props } from "@ngrx/store"
import MedicalServiceIndicate from "../../../../../at-common/model/MedicalServiceIndicate";
import MedicalServiceIndicateReport from '../../../../../at-common/model/MedicalServiceIndicateReport';

export const ServiceIndicateAction = {
    onLoadServiceIndicate: '[ServiceIndicate] on load Medical Service Indicate',
    onLoadServiceIndicateSuccess: '[ServiceIndicate] on load Medical Service Indicate successfully',
    onLoadServiceIndicateById: '[ServiceIndicate] Load Service Indicate By Id',
    onLoadServiceIndicateByIdSuccess: '[ServiceIndicate] Load Service Indicate By Id Success',
    onUpdateServiceIndicate: '[ServiceIndicate] on update Medical Service Indicate',
    onRemoveServiceIndicate: '[ServiceIndicate] on remove Medical Service Indicate',

    onCreateServiceIndicate: '[ServiceIndicate] Create Service Indicate',
    onLoadServiceIndicateFilter: '[ServiceIndicate] Load Service Indicate Filter',
    onLoadServiceIndicateFilterSuccess: '[ServiceIndicate] Load Service Indicate Filter success',

    onLoadTagServiceIndicate: '[ServiceIndicate] on Load Medical Service Indicate Tag',
    onLoadTagServiceIndicateSuccess: '[ServiceIndicate]on Load Service Indicate Tag success',

}

export const onLoadServiceIndicate = createAction(ServiceIndicateAction.onLoadServiceIndicate);
export const onLoadServiceIndicateSuccess = createAction(ServiceIndicateAction.onLoadServiceIndicateSuccess,
    props<{ serviceIndicates: MedicalServiceIndicate[] }>()
)
export const onUpdateServiceIndicate = createAction(ServiceIndicateAction.onUpdateServiceIndicate,
    props<MedicalServiceIndicate>()
)
export const onRemoveServiceIndicate = createAction(ServiceIndicateAction.onRemoveServiceIndicate,
    props<MedicalServiceIndicate>()
)

/**
 * load medical service indicate by id
 */
export const onLoadServiceIndicateById = createAction(ServiceIndicateAction.onLoadServiceIndicateById,
    props<{ id: string }>()
)
export const onLoadServiceIndicateByIdSuccess = createAction(ServiceIndicateAction.onLoadServiceIndicateByIdSuccess,
    props<MedicalServiceIndicate>()
)

export const onCreateServiceIndicate = createAction(ServiceIndicateAction.onCreateServiceIndicate,
    props<MedicalServiceIndicate>()
)

export const onLoadServiceIndicateFilter = createAction(ServiceIndicateAction.onLoadServiceIndicateFilter,
    props<MedicalServiceIndicateReport>());

export const onLoadServiceIndicateFilterSuccess = createAction(ServiceIndicateAction.onLoadServiceIndicateFilterSuccess,
    props<{ serviceIndicateFilter: MedicalServiceIndicate[] }>()
)

export const onLoadTagServiceIndicate = createAction(ServiceIndicateAction.onLoadTagServiceIndicate);

export const onLoadTagServiceIndicateSuccess = createAction(ServiceIndicateAction.onLoadTagServiceIndicateSuccess,
     props<{tagServiceIndeicate : Array<{ _id: string, tagService: string }> }>()
)