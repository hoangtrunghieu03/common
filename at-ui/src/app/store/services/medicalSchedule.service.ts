import { Injectable } from '@angular/core';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import MedicalScheduleManager from '../../../../../at-common/model/manager/MedicalScheduleManager';
import MedicalSchedule from '../../../../../at-common/model/MedicalSchedule';
import MedicalScheduleReport from '../../../../../at-common/model/MedicalScheduleReport';
import { Store } from '@ngrx/store';
import { RootState } from '../entities/state.entity';
import { showProgress } from '../actions/progress.action';

@Injectable()
export class MedicalScheduleService {

    constructor(
        private store: Store<RootState>
    ) {
    }

    async onLoadMedicalScheduleById(medicalSchedule: MedicalSchedule): Promise<HttpStatus<MedicalSchedule>> {
        this.store.dispatch(showProgress());
        const medicalScheduleManager = new MedicalScheduleManager(null);
        let id = medicalSchedule._id;
        return medicalScheduleManager.get(id);
    }
    async onLoadMedicalScheduleCustomerQR(medicalSchedule: MedicalSchedule): Promise<HttpStatus<MedicalSchedule>> {
      this.store.dispatch(showProgress());
      const medicalScheduleManager = new MedicalScheduleManager(null);
      medicalScheduleManager.classInfo.endPoint = 'customerQR';
      let customerCode = medicalSchedule.customerCode;
      return medicalScheduleManager.get(customerCode);
  }
    async onCreateMedicalSchedule(medicalSchedule: MedicalSchedule): Promise<HttpStatus<MedicalSchedule>> {
        this.store.dispatch(showProgress());
        const medicalScheduleManager = new MedicalScheduleManager(null);
        return medicalScheduleManager.insert(medicalSchedule);
    }

    async onUpdateMedicalSchedule(medicalSchedule: MedicalSchedule): Promise<HttpStatus<MedicalSchedule>> {
        this.store.dispatch(showProgress());
        const medicalScheduleManager = new MedicalScheduleManager(null);
        return medicalScheduleManager.update({ _id: medicalSchedule._id }, medicalSchedule);
    }

    async onRemoveMedicalSchedule(medicalSchedule: MedicalSchedule): Promise<HttpStatus<boolean>> {
        this.store.dispatch(showProgress());
        const medicalScheduleManager = new MedicalScheduleManager(null);
        return medicalScheduleManager.delete(medicalSchedule);
    }

    async onMedicalScheduleReminder(medicalSchedule): Promise<HttpStatus<MedicalSchedule>> {
        this.store.dispatch(showProgress());
        const medicalScheduleManager = new MedicalScheduleManager(null);
        medicalScheduleManager.classInfo.endPoint = medicalScheduleManager.classInfo.endPoint.concat('/medicalScheduleReminder');
        return medicalScheduleManager.update({ _id: medicalSchedule._id }, medicalSchedule);
    }

    async onUpdateMedicalScheduleStatus(medicalSchedule): Promise<HttpStatus<MedicalSchedule>> {
        this.store.dispatch(showProgress());
        const medicalScheduleManager = new MedicalScheduleManager(null);
        medicalScheduleManager.classInfo.endPoint = medicalScheduleManager.classInfo.endPoint.concat('/medicalScheduleStatus');
        return medicalScheduleManager.update({ _id: medicalSchedule._id }, medicalSchedule);
    }

    async onLoadMedicalScheduleFilter(medicalScheduleFilter: MedicalScheduleReport): Promise<HttpStatus<MedicalSchedule[]>> {
        this.store.dispatch(showProgress());
        const medicalScheduleManager = new MedicalScheduleManager(null);
        medicalScheduleManager.classInfo.endPoint = medicalScheduleManager.classInfo.endPoint.concat('/medicalScheduleFilter');
        return medicalScheduleManager.search(medicalScheduleFilter);
    }
    async onConfirmSchedule(action): Promise<HttpStatus<MedicalSchedule>> {
      this.store.dispatch(showProgress());
      const medicalScheduleManager = new MedicalScheduleManager(null);
      medicalScheduleManager.classInfo.endPoint = medicalScheduleManager.classInfo.endPoint.concat('/confirmSchedule');
      return medicalScheduleManager.update({_id: action._id}, action);
  }

    async onLoadArcMakingFilter(arcMakingFilter: MedicalScheduleReport): Promise<HttpStatus<MedicalSchedule[]>> {
        this.store.dispatch(showProgress());
        const medicalScheduleManager = new MedicalScheduleManager(null);
        medicalScheduleManager.classInfo.endPoint = medicalScheduleManager.classInfo.endPoint.concat('/arcMakingFilter');
        return medicalScheduleManager.search(arcMakingFilter);
    }

    async onUpdateStatusArcMaking(medicalSchedule): Promise<HttpStatus<MedicalSchedule>> {
        this.store.dispatch(showProgress());
        const medicalScheduleManager = new MedicalScheduleManager(null);
        medicalScheduleManager.classInfo.endPoint = medicalScheduleManager.classInfo.endPoint.concat('/medicalScheduleStatusArcMaking');
        return medicalScheduleManager.update({ _id: medicalSchedule._id }, medicalSchedule);
    }

    async onConfirmArcMaking(medicalSchedule): Promise<HttpStatus<MedicalSchedule>> {
        this.store.dispatch(showProgress());
        const medicalScheduleManager = new MedicalScheduleManager(null);
        medicalScheduleManager.classInfo.endPoint = medicalScheduleManager.classInfo.endPoint.concat('/confirmArcMaking');
        return medicalScheduleManager.insert(medicalSchedule);
    }
}
