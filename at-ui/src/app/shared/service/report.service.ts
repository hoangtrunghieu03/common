import { Injectable, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ReportService {

    staffReports: any[] = STAFF_REPORT;
    revenueReports: any[] = REVENUE_REPORT;
    serviceReport: any[] = SERVICE_REPORT;
    inventoryReport: any[] = INVENTORY_REPORT;
    staffHistory: any[] = STAFF_HISTORY;

    constructor() {

    }

    getStaffReport = ():Observable<any[]> => {
        return of(this.staffReports)
    }

    getStaffById = (_id:string):Observable<any[]> => {
        console.log(this.staffReports.find(val => {return val._id === _id}));
        
        return of(this.staffReports.find(val => {return String(val._id) === String(_id)}))
    }

    getStaffHistory = ():Observable<any[]> => {
        return of(this.staffHistory)
    }

    getRevenueReport = ():Observable<any[]> => {
        return of(this.revenueReports)
    }

    getServiceReport = ():Observable<any[]> => {
        return of(this.serviceReport)
    }

    getInventoryReport = ():Observable<any[]> => {
        return of(this.inventoryReport)
    }
}

const STAFF_REPORT = [
    {_id: 1, name: 'Lê Ngọc Tuấn', value: 1000000},
    {_id: 2, name: 'Nguyễn Văn Linh', value: 500000},
    {_id: 3, name: 'Nguyễn Văn Linh', value: 500000},
    {_id: 4, name: 'Nguyễn Văn Linh', value: 500000},
    {_id: 5, name: 'Nguyễn Văn Linh', value: 500000},
]

const REVENUE_REPORT = [
    {date: '2000-04-05T15:51:57.000Z', quantity: 10, revenue: 10000000, collected: 10000000, debt: 0},
    {date: '2000-04-06T15:51:57.000Z', quantity: 10, revenue: 5000000, collected: 4000000, debt: 1000000},
    {date: '2000-04-07T15:51:57.000Z', quantity: 10, revenue: 15000000, collected: 10000000, debt: 5000000},
]

const SERVICE_REPORT = [
    {name: 'Niềng răng 1', value: 1000000},
    {name: 'Niềng răng 2', value: 500000},
    {name: 'Niềng răng 3', value: 500000},
]

const INVENTORY_REPORT = [
    {name: 'Chỉ nha khoa', firstQuantity: 100, unit: 'Cái', quantityConsume: 50, lastQuantity: 50},
    {name: 'Kiêm tiêm', firstQuantity: 100, unit: 'Cái', quantityConsume: 50, lastQuantity: 50}
]

const STAFF_HISTORY = [
    { code: 1, createDate: '2000-04-07T15:51:57.000Z', patientName: 'Tún', service: 'Niềng răng', revenue: 1000000 }
]