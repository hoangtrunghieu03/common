import { createAction, props } from '@ngrx/store';
import MedicalEquipment from '../../../../../at-common/model/MedicalEquipment';
import { MedicalEquipmentList } from '../../../../../at-ui/src/app/store/entities/medicalEquipment.entity';
import MedicalSupplyHistoryReport from '../../../../../at-common/model/MedicalSupplyHistoryReport';
import MedicalSupplyHistory from '../../../../../at-common/model/MedicalSupplyHistory';


export const MedicalEquipmentAction = {
    loadMedicalEquipment: '[Equipment] Load Equipment',
    loadMedicalEquipmentSuccess: '[Equipment] Load Equipment Successfully',
    loadMedicalEquipmentById: '[Equipment] Load Equipment By Id',
    loadMedicalEquipmentByIdSuccess:'[Equipment] Load Equipment By Id Success',

    onCreatMedicalEquipment:'[Equipment] Create Equipment',
    onUpdateMedicalEquipment:'[Equipment] Update Equipment',
    onRemoveMedicalEquipment:'[Equipment] Remove Equipment',

    onLoadMedicalSupplyHistory: '[Equipment] Load Medical Supply History',
    onLoadMedicalSupplyHistorySuccess: '[Equipment] Load Medical Supply History Successfully',

    onLoadUnitSupplyHistory: '[Equipment] Load Unit Supply History',
    onLoadUnitSupplyHistorySuccess: '[Equipment] Load Unit Supply History Successfully',
};

export const loadMedicalEquipment = createAction(MedicalEquipmentAction.loadMedicalEquipment);
export const loadMedicalEquipmentSuccess = createAction(MedicalEquipmentAction.loadMedicalEquipmentSuccess,
    props<MedicalEquipmentList>()
);

export const loadMedicalEquipmentById = createAction(MedicalEquipmentAction.loadMedicalEquipmentById,
    props<{ _id: string }>());
export const loadMedicalEquipmentByIdSuccess = createAction(MedicalEquipmentAction.loadMedicalEquipmentByIdSuccess,
    props<MedicalEquipment>()
)

export const onCreatMedicalEquipment = createAction(MedicalEquipmentAction.onCreatMedicalEquipment,
    props<MedicalEquipment>()
)

export const onUpdateMedicalEquipment = createAction(MedicalEquipmentAction.onUpdateMedicalEquipment,
    props<MedicalEquipment>()
)

export const onRemoveMedicalEquipment = createAction(MedicalEquipmentAction.onRemoveMedicalEquipment,
    props<MedicalEquipment>()
)

export const onLoadMedicalSupplyHistory = createAction(MedicalEquipmentAction.onLoadMedicalSupplyHistory,
    props<MedicalSupplyHistoryReport>());
export const onLoadMedicalSupplyHistorySuccess = createAction(MedicalEquipmentAction.onLoadMedicalSupplyHistorySuccess,
    props<{ medicalSupplyHistoryReport: MedicalSupplyHistoryReport[] }>()
);

export const onLoadUnitSupplyHistory = createAction(MedicalEquipmentAction.onLoadUnitSupplyHistory);
export const onLoadUnitSupplyHistorySuccess = createAction(MedicalEquipmentAction.onLoadUnitSupplyHistorySuccess,
    props<{ medicalSupplyHistory: MedicalSupplyHistory[] }>()
);