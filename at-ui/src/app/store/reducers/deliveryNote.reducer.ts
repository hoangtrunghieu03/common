import { Action } from '@ngrx/store';
import { onCreateDeliveryNote, onLoadDeliveryNote, onLoadDeliveryNoteSuccess } from '../actions/DeliveryNote.action';
import { DeliveryNoteState } from '../entities/state.entity';
import { createReducer, on } from '../utils/store.util';

const initialState: DeliveryNoteState = {
    deliveryNoteList: [],
    message: '',
};

export const reducer = createReducer(
    initialState,
    on(onLoadDeliveryNote, (state, action) => ({
        ...state
    })),
    on(onLoadDeliveryNoteSuccess, (state, action) => ({
        ...state,
        deliveryNoteList: action.deliveryNote
    })),
    on(onCreateDeliveryNote, (state, action) => ({
        ...state
    })),
);

export function deliveryNoteReducer(state: DeliveryNoteState | undefined, action: Action) {
    return reducer(state, action);
}