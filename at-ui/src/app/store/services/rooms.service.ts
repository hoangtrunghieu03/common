import { Injectable } from '@angular/core';
import Room from '../../../../../at-common/model/Room';
import RoomManager from '../../../../../at-common/model/manager/RoomManager';
import HttpStatus from '../../../../../at-common/base/HttpStatus';

@Injectable()
export class RoomsService {

    constructor(){}

    async onLoadRooms(): Promise<HttpStatus<Room[]>> {
        const roomManager = new RoomManager(null)
        return roomManager.search(null)
    }
}