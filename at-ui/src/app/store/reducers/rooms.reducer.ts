import { Action } from '@ngrx/store';
import { createReducer, on } from '../utils/store.util';
import {
    onLoadRoles,
    onLoadRolesSuccess
} from '../actions/roles.action';
import { RoleState, RoomsState } from '../entities/state.entity';
import { onLoadRooms, onLoadRoomsSuccess } from '../actions/rooms.action';

const initialState: RoomsState = {
    rooms: [],
    message: ''
};

export const reducer = createReducer(
    initialState,
    on(onLoadRooms, (state, action) => ({
        ...state
    })),
    on(onLoadRoomsSuccess, (state, action) => ({
        ...state,
        rooms: action.rooms
    })),
);

export function roomReducer(state: RoomsState | undefined, action: Action) {
  return reducer(state, action);
}
