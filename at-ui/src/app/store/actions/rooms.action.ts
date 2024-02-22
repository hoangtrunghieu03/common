import { createAction, props } from "@ngrx/store"
import Room from "../../../../../at-common/model/Room";


export const RoomsAction = {
    onLoadRooms: '[Room] load all room',
    onLoadRoomsSuccess: '[Room] load all room successfully'
}

export const onLoadRooms = createAction(RoomsAction.onLoadRooms);
export const onLoadRoomsSuccess = createAction(RoomsAction.onLoadRoomsSuccess,
    props<{rooms: Room[]}>()
)