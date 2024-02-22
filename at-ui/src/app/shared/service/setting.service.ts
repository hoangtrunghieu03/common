import { Injectable, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class RoleService {

    roles: Role[] = ROLE;
    staffs: any[] = STAFFS;
    equipments = EQUIPMENT;

    constructor() {

    }

    getRoles = ():Observable<Role[]> => {
        const role = of(this.roles);
        return role
    }

    onAddRole = (param):void => {
        this.roles.push(param);
    }

    /**
     * staff
     */
    getStaffs = ():Observable<any[]> => {
        const staff = of(this.staffs)
        return staff;
    }

    onAddStaff = (param):void => {
        this.staffs.push(param);
    }

    onUpdateStaff = (param):void => {
        let index: number = this.staffs.findIndex(val => val._id == param._id);
        this.staffs[index] = param;
    }

    /**
     * Inventory - equipment
     */
    getEquipment = ():Observable<any[]> => {
        const equipment = of(this.equipments);
        return equipment
    }

    onAddEquipment = (param):void => {
        this.equipments.push(param)
    }

    onLoadEquipById = (_id):Observable<any[]> => {
        let data = [...this.equipments];
        data = data.filter( val => val._id == _id);
        return of(data);
    }
}

export interface Role {
    roleName: string,
    staffCount: number,
    dataAccess: string[]
}

const ROLE = [{ roleName: 'Admin', staffCount: 1, dataAccess: []}]

const STAFFS = [
    {_id: 1, staffCode: 'nv1', staffName: 'Tuấn', tel: '012302292', roleName: 'ADMIN', email: 'lnt@gmail.com'}
]

const EQUIPMENT = [
    {
        _id: 1,
        name: 'Chỉ nha khoa',
        unit: 'Cái',
        quantity: 10,
        price: 100000,
        origin: 'France',
        createDate: '2000-04-05T15:51:57.000Z',
    }
];