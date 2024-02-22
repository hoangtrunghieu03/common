import { Action } from '@ngrx/store';
import { onLoadChairStatus, onLoadChairStatusSuccess, onLoadCustomers, onLoadCustomersSuccess, onLoadMedicalServices, onLoadMedicalServicesSuccess, onLoadRevenueDays, onLoadRevenueDaysSuccess } from '../actions/dashboard.action';
import { DashboardState } from '../entities/state.entity';
import { createReducer, on } from '../utils/store.util';

const initialState: DashboardState = {
    revenueDays: [],
    customers: [],
    medicalService: [],
    chairStatus: [],
    message: ''
};

export const reducer = createReducer(
    initialState,
    on(onLoadRevenueDays, (state, action) => ({
        ...state
    })),
    on(onLoadRevenueDaysSuccess, (state, action) => ({
        ...state,
        revenueDays: action.revenueDay
    })),
    on(onLoadCustomers, (state, action) => ({
        ...state
    })),
    on(onLoadCustomersSuccess, (state, action) => ({
        ...state,
        customers: action.customer
    })),
    on(onLoadMedicalServices, (state, action) => ({
        ...state
    })),
    on(onLoadMedicalServicesSuccess, (state, action) => ({
        ...state,
        medicalService: action.medicalService
    })),
    on(onLoadChairStatus, (state, action) => ({
        ...state
    })),
    on(onLoadChairStatusSuccess, (state, action) => ({
        ...state,
        chairStatus: action.chairStatus
    })),
);

export function dashboardReducer(state: DashboardState | undefined, action: Action) {
    return reducer(state, action);
}