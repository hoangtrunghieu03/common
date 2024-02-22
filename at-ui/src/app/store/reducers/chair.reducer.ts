import { Action } from '@ngrx/store';
import { onCreateChair, onLoadChair, onLoadChairById, onLoadChairByIdSuccess, onLoadChairByStaff, onLoadChairByStaffSuccess, onLoadChairSuccess, onRemoveChair, onResetChair, onUpdateChair, onUpdateCustomerInChair } from '../actions/chair.action';
import { ChairState } from '../entities/state.entity';
import { createReducer, on } from '../utils/store.util';

const initialState: ChairState = {
    chairList: [],
    chairItem: null,
    chairStaff: null,
    message: ''
};

export const reducer = createReducer(
    initialState,
    on(onLoadChair, (state, action) => ({
        ...state
    })),
    on(onLoadChairSuccess, (state, action) => ({
        ...state,
        chairList: action.chair
    })),
    on(onLoadChairById, (state, action) => ({
        ...state
    })),
    on(onLoadChairByIdSuccess, (state, action) => ({
        ...state,
        chairItem: action
    })),
    on(onLoadChairByStaff, (state, action) => ({
        ...state
    })),
    on(onLoadChairByStaffSuccess, (state, action) => ({
        ...state,
        chairStaff: action.chair
    })),
    on(onCreateChair, (state, action) => ({
        ...state
    })),
    on(onUpdateChair, (state, action) => ({
        ...state
    })),
    on(onRemoveChair, (state, action) => ({
        ...state
    })),
    on(onResetChair, (state, action) => ({
        ...state
    })),
    on(onUpdateCustomerInChair, (state, action) => ({
        ...state
    })),
);

export function chairReducer(state: ChairState | undefined, action: Action) {
    return reducer(state, action);
}