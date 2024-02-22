import { createAction, props } from "@ngrx/store"
import MedicalService from "../../../../../at-common/model/MedicalService";
import MedicalServiceReport from '../../../../../at-common/model/MedicalServiceReport';

export const MedicalServiceAction = {
    onLoadMedicalService: '[MedicalService] on load Medical Service',
    onLoadMedicalServiceSuccess: '[MedicalService] on load Medical Service successfully',

    onCreateMedicalService: '[MedicalService] on create Medical Service',
    onUpdateMedicalService: '[MedicalService] on update Medical Service',
    onRemoveMedicalService: '[MedicalService] on remove Medical Service',

    onLoadMedicalServiceById: '[MedicalService] on load Medical Service By Id',
    onLoadMedicalServiceByIdSuccess: '[MedicalService] on load Medical Service By Id successfully',

    onLoadMedicalServiceFilter: '[MedicalService] on load Medical Service Filter',
    onLoadMedicalServiceFilterSuccess: '[MedicalService] on load Medical Service Filter successfully',

    onLoadMedicalServiceTag: '[MedicalService] on load Medical Service Tag',
    onLoadMedicalServiceTagSuccess: '[MedicalService] on load Medical Service Tag successfully',
}

export const onLoadMedicalService = createAction(MedicalServiceAction.onLoadMedicalService);
export const onLoadMedicalServiceSuccess = createAction(MedicalServiceAction.onLoadMedicalServiceSuccess,
    props<{ medicalServices: MedicalService[] }>()
)

export const onCreateMedicalService = createAction(MedicalServiceAction.onCreateMedicalService,
    props<{ medicalService: MedicalService, medicalServiceFilter: MedicalServiceReport }>()
)
export const onUpdateMedicalService = createAction(MedicalServiceAction.onUpdateMedicalService,
    props<MedicalService>()
)
export const onRemoveMedicalService = createAction(MedicalServiceAction.onRemoveMedicalService,
    props<MedicalService>()
)

export const onLoadMedicalServiceById = createAction(MedicalServiceAction.onLoadMedicalServiceById,
    props<{ _id: string }>()
);
export const onLoadMedicalServiceByIdSuccess = createAction(MedicalServiceAction.onLoadMedicalServiceByIdSuccess,
    props<MedicalService>()
)

export const onLoadMedicalServiceFilter = createAction(MedicalServiceAction.onLoadMedicalServiceFilter,
    props<MedicalServiceReport>());
export const onLoadMedicalServiceFilterSuccess = createAction(MedicalServiceAction.onLoadMedicalServiceFilterSuccess,
    props<{ medicalServiceFilter: MedicalService[] }>()
)
export const onLoadMedicalServiceTag = createAction(MedicalServiceAction.onLoadMedicalServiceTag);
export const onLoadMedicalServiceTagSuccess = createAction(MedicalServiceAction.onLoadMedicalServiceTagSuccess,
    props<{ medicalServiceTag: Array<{ _id: string, tagService: string }> }>()
)