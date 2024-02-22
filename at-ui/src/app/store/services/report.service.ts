import { Injectable } from '@angular/core';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import ReportRevenueManager from '../../../../../at-common/model/manager/ReportRevenueManager';
import ReportRevenue from '../../../../../at-common/model/ReportRevenue';
import ReportSupplyManager from '../../../../../at-common/model/manager/ReportSupplyManager';
import ReportSupply from '../../../../../at-common/model/ReportSupply';
import { RootState } from '../entities/state.entity';
import { Store } from '@ngrx/store';
import { showProgress } from '../actions/progress.action';

@Injectable()
export class ReportService {

    constructor(
        private store: Store<RootState>) { }

    async onLoadReportRevenueGeneral(filter: ReportRevenue): Promise<HttpStatus<ReportRevenue[]>> {
        this.store.dispatch(showProgress());
        const reportRevenueManager = new ReportRevenueManager(null)
        reportRevenueManager.classInfo.endPoint = reportRevenueManager.classInfo.endPoint.concat('/generals');
        return reportRevenueManager.search(filter)
    }

    async onLoadReportRevenueGeneralDetail(filter: ReportRevenue): Promise<HttpStatus<ReportRevenue[]>> {
        this.store.dispatch(showProgress());
        const reportRevenueManager = new ReportRevenueManager(null)
        reportRevenueManager.classInfo.endPoint = reportRevenueManager.classInfo.endPoint.concat('/generalDetail');
        return reportRevenueManager.search(filter)
    }

    async onLoadReportStaffs(filter: ReportRevenue): Promise<HttpStatus<ReportRevenue[]>> {
        this.store.dispatch(showProgress());
        const reportRevenueManager = new ReportRevenueManager(null)
        reportRevenueManager.classInfo.endPoint = reportRevenueManager.classInfo.endPoint.concat('/staffs');
        return reportRevenueManager.search(filter);
    }

    async onLoadReportStaffDetail(filter: ReportRevenue): Promise<HttpStatus<ReportRevenue[]>> {
        this.store.dispatch(showProgress());
        const reportRevenueManager = new ReportRevenueManager(null)
        reportRevenueManager.classInfo.endPoint = reportRevenueManager.classInfo.endPoint.concat('/staffDetail');
        return reportRevenueManager.search(filter);
    }

    async onLoadReportSupplyInventoryByRoomDetail(filter: ReportRevenue): Promise<HttpStatus<ReportSupply[]>> {
      this.store.dispatch(showProgress());
      const reportSupplyManager = new ReportSupplyManager(null)
      reportSupplyManager.classInfo.endPoint = reportSupplyManager.classInfo.endPoint.concat('/supplyRoomDetail');
      return reportSupplyManager.search(filter);
  }
    async onLoadReportSupplyInventory(filter: ReportSupply): Promise<HttpStatus<ReportSupply[]>> {
        this.store.dispatch(showProgress());
        const reportSupplyManager = new ReportSupplyManager(null)
        reportSupplyManager.classInfo.endPoint = reportSupplyManager.classInfo.endPoint.concat('/supplies');
        return reportSupplyManager.search(filter)
    }
    async onLoadReportSupplyInventoryByRoom(filter: ReportSupply): Promise<HttpStatus<ReportSupply[]>> {
      this.store.dispatch(showProgress());
      const reportSupplyManager = new ReportSupplyManager(null)
      reportSupplyManager.classInfo.endPoint = reportSupplyManager.classInfo.endPoint.concat('/supplyRoom');
      return reportSupplyManager.search(filter)
  }

    async onLoadServiceRevenue(filter: ReportRevenue): Promise<HttpStatus<ReportRevenue[]>> {
        this.store.dispatch(showProgress());
        const serviceRevenueManager = new ReportRevenueManager(null)
        serviceRevenueManager.classInfo.endPoint = serviceRevenueManager.classInfo.endPoint.concat('/services');
        return serviceRevenueManager.search(filter)
    }

    async onLoadReportRoom(filter: ReportRevenue): Promise<HttpStatus<ReportRevenue[]>> {
        this.store.dispatch(showProgress());
        const serviceRevenueManager = new ReportRevenueManager(null)
        serviceRevenueManager.classInfo.endPoint = serviceRevenueManager.classInfo.endPoint.concat('/rooms');
        return serviceRevenueManager.search(filter)
    }
}
