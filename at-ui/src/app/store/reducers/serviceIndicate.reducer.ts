import { Action } from '@ngrx/store';
import { createReducer, on } from '../utils/store.util';
import { ServiceIndicateState } from '../entities/state.entity';
import { onCreateServiceIndicate, onLoadServiceIndicate, onLoadServiceIndicateById, onLoadServiceIndicateByIdSuccess, onLoadServiceIndicateFilter, onLoadServiceIndicateFilterSuccess, onLoadServiceIndicateSuccess, onUpdateServiceIndicate, onRemoveServiceIndicate , onLoadTagServiceIndicate , onLoadTagServiceIndicateSuccess } from '../actions/serviceIndicate.action';

const initialState: ServiceIndicateState = {
    serviceIndicates: [],
    serviceIndicateItem: null,
    serviceIndicateFilter: [],
    tagServiceIndeicate : [],
    message: ''
};

export const reducer = createReducer(
    initialState,
    on(onLoadServiceIndicate, (state, action) => ({
        ...state
    })),
    on(onLoadServiceIndicateSuccess, (state, action) => ({
        ...state,
        serviceIndicates: action.serviceIndicates
    })),
    on(onLoadServiceIndicateById, (state, action) => ({
        ...state,
    })),
    on(onLoadServiceIndicateByIdSuccess, (state, action) => ({
        ...state,
        serviceIndicateItem: action,
    })),
    on(onUpdateServiceIndicate, (state, action) => ({
        ...state
    })),
    on(onRemoveServiceIndicate, (state, action) => ({
        ...state
    })),
    on(onCreateServiceIndicate, (state, action) => ({
        ...state
    })),
    on(onLoadServiceIndicateFilter, (state, action) => ({
        ...state
    })),
    on(onLoadServiceIndicateFilterSuccess, (state, action) => ({
        ...state,
        serviceIndicateFilter: action.serviceIndicateFilter
    })),
    on(onLoadTagServiceIndicate, (state , action) =>({
        ...state
    })),
    on(onLoadTagServiceIndicateSuccess ,(state , action) =>({
        ...state,
        tagServiceIndeicate: action.tagServiceIndeicate
    }))
  
);

export function serviceIndicateReducer(state: ServiceIndicateState | undefined, action: Action) {
  return reducer(state, action);
}
