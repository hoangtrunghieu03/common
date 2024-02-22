import { createAction, props } from '@ngrx/store';
import DashBoard from '../../../../../at-common/model/DashBoard';

export const DashboardAction = {
    onLoadRevenueDays: '[Dashboard] Load revenueDays',
    onLoadRevenueDaysSuccess: '[Dashboard] Load revenueDays Successfully',

    onLoadCustomers: '[Dashboard] Load customers',
    onLoadCustomersSuccess: '[Dashboard] Load customers Successfully',

    onLoadMedicalServices: '[Dashboard] Load Medical Service',
    onLoadMedicalServicesSuccess: '[Dashboard] Load Medical Service Successfully',

    onLoadChairStatus: '[Dashboard] Load Chair Status',
    onLoadChairStatusSuccess: '[Dashboard] Load Chair Status Successfully',
};

export const onLoadRevenueDays = createAction(DashboardAction.onLoadRevenueDays);
export const onLoadRevenueDaysSuccess = createAction(DashboardAction.onLoadRevenueDaysSuccess,
    props<{ revenueDay: DashBoard[] }>()
);

export const onLoadCustomers = createAction(DashboardAction.onLoadCustomers);
export const onLoadCustomersSuccess = createAction(DashboardAction.onLoadCustomersSuccess,
    props<{ customer: DashBoard[] }>()
);

export const onLoadMedicalServices = createAction(DashboardAction.onLoadMedicalServices);
export const onLoadMedicalServicesSuccess = createAction(DashboardAction.onLoadMedicalServicesSuccess,
    props<{ medicalService: DashBoard[] }>()
);

export const onLoadChairStatus = createAction(DashboardAction.onLoadChairStatus);
export const onLoadChairStatusSuccess = createAction(DashboardAction.onLoadChairStatusSuccess,
    props<{ chairStatus: DashBoard[] }>()
);