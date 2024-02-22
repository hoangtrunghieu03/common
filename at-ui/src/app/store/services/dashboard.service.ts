import { Injectable } from '@angular/core';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import DashBoard from '../../../../../at-common/model/DashBoard';
import DashBoardManager from '../../../../../at-common/model/manager/DashBoardManager';

@Injectable()
export class DashboardService {

    constructor() { }

    async onLoadRevenueDays(): Promise<HttpStatus<DashBoard[]>> {
        const dashboardManager = new DashBoardManager(null);
        dashboardManager.classInfo.endPoint = dashboardManager.classInfo.endPoint.concat('/revenueDays');
        return dashboardManager.search(null);
    }

    async onLoadCustomers(): Promise<HttpStatus<DashBoard[]>> {
        const dashboardManager = new DashBoardManager(null);
        dashboardManager.classInfo.endPoint = dashboardManager.classInfo.endPoint.concat('/customers');
        return dashboardManager.search(null);
    }

    async onLoadMedicalServices(): Promise<HttpStatus<DashBoard[]>> {
        const dashboardManager = new DashBoardManager(null);
        dashboardManager.classInfo.endPoint = dashboardManager.classInfo.endPoint.concat('/medicalServices');
        return dashboardManager.search(null);
    }

    async onLoadChairStatus(): Promise<HttpStatus<DashBoard[]>> {
        const dashboardManager = new DashBoardManager(null);
        dashboardManager.classInfo.endPoint = dashboardManager.classInfo.endPoint.concat('/chairs');
        return dashboardManager.search(null);
    }
}