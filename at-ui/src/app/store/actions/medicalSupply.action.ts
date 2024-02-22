import { createAction, props } from '@ngrx/store';
import MedicalSupply from '../../../../../at-common/model/MedicalSupply';
import MedicalSupplyHistory from '../../../../../at-common/model/MedicalSupplyHistory';
import MedicalSupplyReport from '../../../../../at-common/model/MedicalSupplyReport';
import MedicalSupplyRoom from '../../../../../at-common/model/MedicalSupplyRoom';

export const MedicalSupplyAction = {
    onLoadMedicalSupply: '[MedicalSupply] load medical supply',
    onLoadMedicalSupplySuccess: '[MedicalSupply] load medical supply successfully',

    onCreateMedicalSupply: '[MedicalSupply] create new medical supply',
    onUpdateMedicalSupply: '[MedicalSupply] update new medical supply',
    onRemoveMedicalSupply: '[MedicalSupply] remove new medical supply',
    onExportMedicalSupply: '[MedicalSupply] export medical supply',
    onExportMedicalSupplyRequest: '[MedicalSupply] export medical supply request',
    onImportMedicalSupply: '[MedicalSupply] import medical supply',
    onAdjustMedicalInput: '[MedicalSupply] adjust medical input',

    onLoadMedicalSupplyById: '[MedicalSupply] load medical supply by id',
    onLoadMedicalSupplyByIdSuccess: '[MedicalSupply] load medical supply by id successfully',

    onLoadMedicalSupplyFilter: '[MedicalSupply] load medical supply filter',
    onLoadMedicalSupplyFilterSuccess: '[MedicalSupply] load medical supply filter successfully',

    onLoadMedicalSupplyUnit: '[MedicalSupply] load medical supply unit',
    onLoadMedicalSupplyUnitSuccess: '[MedicalSupply] load medical supply unit successfully' ,

    onReturnMedicalSupply: '[MedicalSupply] return medical input',

    adjustMedicalSupplyByRoom: '[MedicalSupply] Medical Supply adjust By Room',
}

/**
 * action load medical supply
 */
export const onLoadMedicalSupply = createAction(MedicalSupplyAction.onLoadMedicalSupply)
export const onLoadMedicalSupplySuccess = createAction(MedicalSupplyAction.onLoadMedicalSupplySuccess,
    props<{ medicalSupply: MedicalSupply[] }>()
)
/**
 * action create new medical supply
 */
export const onCreateMedicalSupply = createAction(MedicalSupplyAction.onCreateMedicalSupply,
    props<{ medicalSupply: MedicalSupply, medicalSupplyFilter: MedicalSupplyReport }>()
)
/**
 * action update new medical supply
 */
export const onUpdateMedicalSupply = createAction(MedicalSupplyAction.onUpdateMedicalSupply,
    props<MedicalSupply>()
)
/**
 * action update new medical supply
 */
export const onRemoveMedicalSupply = createAction(MedicalSupplyAction.onRemoveMedicalSupply,
    props<MedicalSupply>()
)
/**
 * action export medical supply
 */
export const onExportMedicalSupply = createAction(MedicalSupplyAction.onExportMedicalSupply,
    props<{ medicalSupply: MedicalSupplyRoom, medicalSupplyFilter: MedicalSupplyReport }>()
)

export const onExportMedicalSupplyRequest = createAction(MedicalSupplyAction.onExportMedicalSupplyRequest,
    props<MedicalSupplyRoom>()
)
/**
 * action import medical supply
 */
export const onImportMedicalSupply = createAction(MedicalSupplyAction.onImportMedicalSupply,
    props<MedicalSupplyRoom>()
)
/**
 * action adjust medical input
 */
export const onAdjustMedicalInput = createAction(MedicalSupplyAction.onAdjustMedicalInput,
    props<{ medicalSupply: MedicalSupplyRoom, medicalSupplyFilter: MedicalSupplyReport }>()
)

export const onLoadMedicalSupplyById = createAction(MedicalSupplyAction.onLoadMedicalSupplyById,
    props<{ _id: string }>()
)
export const onLoadMedicalSupplyByIdSuccess = createAction(MedicalSupplyAction.onLoadMedicalSupplyByIdSuccess,
    props<MedicalSupply>()
)

export const onLoadMedicalSupplyFilter = createAction(MedicalSupplyAction.onLoadMedicalSupplyFilter,
    props<MedicalSupplyReport>()
)
export const onLoadMedicalSupplyFilterSuccess = createAction(MedicalSupplyAction.onLoadMedicalSupplyFilterSuccess,
    props<{ medicalSupplyFilter: MedicalSupply | MedicalSupply[] }>()
)

export const onLoadMedicalSupplyUnit = createAction(MedicalSupplyAction.onLoadMedicalSupplyUnit)

export const onLoadMedicalSupplyUnitSuccess = createAction(MedicalSupplyAction.onLoadMedicalSupplyUnitSuccess ,
    props<{medicalSupplyUnit : MedicalSupplyHistory[]}>())

export const onReturnMedicalSupply = createAction(MedicalSupplyAction.onReturnMedicalSupply ,
  props<MedicalSupplyRoom>())

  export const adjustMedicalSupplyByRoom = createAction(MedicalSupplyAction.adjustMedicalSupplyByRoom ,
    props<MedicalSupplyHistory>())
