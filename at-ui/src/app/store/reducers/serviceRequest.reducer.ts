import { Action } from '@ngrx/store';
import { onCreateServiceRequest, onLoadServiceRequest, onLoadServiceRequestSuccess, onLoadServiceRequestFilter, onLoadServiceRequestFilterSuccess } from '../actions/serviceRequest.action';
import { ServiceRequestState } from '../entities/state.entity';
import { createReducer, on } from '../utils/store.util';

const initialState: ServiceRequestState = {
    serviceRequestList: [],
    serviceRequestFilter: [],
    message: '',
};

export const reducer = createReducer(
    initialState,
    on(onLoadServiceRequest, (state, action) => ({
        ...state
    })),
    on(onLoadServiceRequestSuccess, (state, action) => ({
        ...state,
        serviceRequestList: action.serviceRequest
    })),
    on(onLoadServiceRequestFilter, (state, action) => ({
        ...state
    })),
    on(onLoadServiceRequestFilterSuccess, (state, action) => ({
        ...state,
        serviceRequestFilter: action.serviceRequest
    })),
    on(onCreateServiceRequest, (state, action) => ({
        ...state
    })),
);

export function serviceRequestReducer(state: ServiceRequestState | undefined, action: Action) {
    return reducer(state, action);
}