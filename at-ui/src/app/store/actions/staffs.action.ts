import { createAction, props } from '@ngrx/store';
import Staffs from '../../../../../at-common/model/Staffs';
import { StaffsList } from '../entities/staffs.entity';
import StaffReport from '../../../../../at-common/model/StaffReport';

export const StaffAction = {
    loadStaff: '[Staff] Load Staff'  ,
    loadStaffSuccess: '[Staff] Load Staff Successfully' ,
    createStaff: '[Staff] create new Staff' ,
    onUpdateStaff: '[Staff] update Staff',
    deleteStaff: '[Staff] delete Staff',
    loadStaffItem:'[Staff] load Staff by Id',
    loadStaffItemSuccess: '[Staff] load Staff by Id Successfully',
    loadStaffLogin:'[Staff] load Staff Login',
    loadStaffLoginSuccess: '[Staff] load Staff Login Successfully',
    clearStateStaff:'[Staff] clear Staff',
    onLoadStaffFilter: '[Staff] load all Staff with filter condition',
    onLoadStaffFilterSuccess: '[Staff] load all Staff with filter condition Success fully',
    onChangeStaffPassword: '[Staff] change Staff password'
};
export const loadStaff = createAction(StaffAction.loadStaff);
export const loadStaffSuccess = createAction(StaffAction.loadStaffSuccess,
    props<StaffsList>()
);

export const loadStaffItem = createAction(StaffAction.loadStaffItem,
    props<{staffId: string}>()
);

export const loadStaffItemSuccess = createAction(StaffAction.loadStaffItemSuccess,
    props<Staffs>()
);

export const loadStaffLogin = createAction(StaffAction.loadStaffLogin,
    props<{staffId: string}>()
);

export const loadStaffLoginSuccess = createAction(StaffAction.loadStaffLoginSuccess,
    props<Staffs>()
);

export const createStaff = createAction(StaffAction.createStaff,
    props<Staffs>()
);

export const onUpdateStaff = createAction(StaffAction.onUpdateStaff,
    props<Staffs>()
);

export const deleteStaff = createAction(StaffAction.deleteStaff,
    props<Staffs>()
);

export const onLoadStaffFilter = createAction(StaffAction.onLoadStaffFilter,
    props<StaffReport>()
);
export const onLoadStaffFilterSuccess = createAction(StaffAction.onLoadStaffFilterSuccess, 
    props<{staffs: StaffReport | StaffReport[]}>()
);

export const onChangeStaffPassword = createAction(StaffAction.onChangeStaffPassword,
    props<Staffs>()
);

export const clearStateStaff = createAction(StaffAction.clearStateStaff);