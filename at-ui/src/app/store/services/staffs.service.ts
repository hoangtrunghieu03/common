import { Injectable } from '@angular/core';
import Staffs from '../../../../../at-common/model/Staffs';
import StaffsManager from '../../../../../at-common/model/manager/StaffsManager';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import StaffReport from '../../../../../at-common/model/StaffReport';
import StaffReportManager from '../../../../../at-common/model/manager/StaffReportManager';
import { Store } from '@ngrx/store';
import { RootState } from '../entities/state.entity';
import { showProgress } from '../actions/progress.action';

@Injectable()
export class StaffsService {
  constructor(
    private store: Store<RootState>
  ) { }

  async loadAllStaff(): Promise<HttpStatus<Staffs[]>> {
    this.store.dispatch(showProgress());
    const staffsManager = new StaffsManager(null);
    staffsManager.classInfo.endPoint = staffsManager.classInfo.endPoint.concat('');
    return staffsManager.search(null);
  }

  async createStaff(staffs: Staffs): Promise<HttpStatus<Staffs>> {
    this.store.dispatch(showProgress());
    const staffsManager = new StaffsManager(null);
    return staffsManager.insert(staffs);
  }

  async loadStaffItem(actionId): Promise<HttpStatus<Staffs>> {
    this.store.dispatch(showProgress());
    const staffsManager = new StaffsManager(null);
    let id = actionId.staffId;
    return staffsManager.get(id);
  }

  async onUpdateStaff(staffs): Promise<HttpStatus<Staffs>> {
    this.store.dispatch(showProgress());
    const staffsManager = new StaffsManager(null);
    return staffsManager.update({ _id: staffs._id }, staffs);
  }

  async deleteStaff(staffs): Promise<HttpStatus<boolean>> {
    this.store.dispatch(showProgress());
    const staffsManager = new StaffsManager(null);
    return staffsManager.delete(staffs);
  }

  async onLoadStaffFilter(filter): Promise<HttpStatus<StaffReport[]>> {
    this.store.dispatch(showProgress());
    const staffReportManager = new StaffReportManager(null);
    staffReportManager.classInfo.endPoint = staffReportManager.classInfo.endPoint.concat('/allStaffByFilter');
    return staffReportManager.search(filter);
  }

  async onChangeStaffPassword(staffs): Promise<HttpStatus<Staffs>> {
    this.store.dispatch(showProgress());
    const staffsManager = new StaffsManager(null);
    staffsManager.classInfo.endPoint = staffsManager.classInfo.endPoint.concat('/changePassword');
    return staffsManager.update({ _id: staffs._id }, staffs);
  }
}