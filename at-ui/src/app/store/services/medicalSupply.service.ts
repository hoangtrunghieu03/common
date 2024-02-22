import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import MedicalSupply from '../../../../../at-common/model/MedicalSupply';
import MedicalSupplyHistory from '../../../../../at-common/model/MedicalSupplyHistory';
import MedicalSupplyReport from '../../../../../at-common/model/MedicalSupplyReport';
import MedicalSupplyHistoryManager from '../../../../../at-common/model/manager/MedicalSupplyHistoryManager';
import MedicalSupplyManager from '../../../../../at-common/model/manager/MedicalSupplyManager';
import { showProgress } from '../actions/progress.action';
import { RootState } from '../entities/state.entity';

@Injectable()
export class MedicalSupplyService {

    constructor(
        private store: Store<RootState>
    ) {
    }

    async adjustMedicalSupplyByRoom(medicalSupply): Promise<HttpStatus<MedicalSupply>> {
      this.store.dispatch(showProgress());
      const medicalSupplyManager = new MedicalSupplyManager(null);
      medicalSupplyManager.classInfo.endPoint = medicalSupplyManager.classInfo.endPoint.concat('/adjustMedicalSupplyByRoom');
      return medicalSupplyManager.update({ _id: medicalSupply._id }, medicalSupply);
  }

    async onLoadMedicalSupply(): Promise<HttpStatus<MedicalSupply[]>> {
        this.store.dispatch(showProgress());
        const medicalSupplyManager = new MedicalSupplyManager(null);
        medicalSupplyManager.classInfo.endPoint = medicalSupplyManager.classInfo.endPoint.concat('');
        return medicalSupplyManager.search(null);
    }

    async onCreateMedicalSupply(medicalSupply: MedicalSupply): Promise<HttpStatus<MedicalSupply>> {
        this.store.dispatch(showProgress());
        const medicalSupplyManager = new MedicalSupplyManager(null);
        return medicalSupplyManager.insert(medicalSupply);
    }

    async onUpdateMedicalSupply(medicalSupply: MedicalSupply): Promise<HttpStatus<MedicalSupply>> {
        this.store.dispatch(showProgress());
        const medicalSupplyManager = new MedicalSupplyManager(null);
        return medicalSupplyManager.update({ _id: medicalSupply._id }, medicalSupply);
    }

    async onRemoveMedicalSupply(medicalSupply: MedicalSupply): Promise<HttpStatus<boolean>> {
        this.store.dispatch(showProgress());
        const medicalSupplyManager = new MedicalSupplyManager(null);
        return medicalSupplyManager.delete(medicalSupply);
    }

    async onImportMedicalSupply(medicalSupplyInput: MedicalSupply): Promise<HttpStatus<MedicalSupply>> {
        this.store.dispatch(showProgress());
        const medicalSupplyManager = new MedicalSupplyManager(null);
        medicalSupplyManager.classInfo.endPoint = medicalSupplyManager.classInfo.endPoint.concat('/importMedicalSupply');
        return medicalSupplyManager.insert(medicalSupplyInput);
    }

    async onExportMedicalSupply(medicalSupply): Promise<HttpStatus<MedicalSupply>> {
        this.store.dispatch(showProgress());
        const medicalSupplyManager = new MedicalSupplyManager(null);
        medicalSupplyManager.classInfo.endPoint = medicalSupplyManager.classInfo.endPoint.concat('/exportMedicalSupply');
        return medicalSupplyManager.insert(medicalSupply);
    }

    async onAdjustMedicalInput(medicalSupply): Promise<HttpStatus<MedicalSupply>> {
        this.store.dispatch(showProgress());
        const medicalSupplyManager = new MedicalSupplyManager(null);
        medicalSupplyManager.classInfo.endPoint = medicalSupplyManager.classInfo.endPoint.concat('/adjustMedicalInput');
        return medicalSupplyManager.insert(medicalSupply);
    }

    async onLoadMedicalSupplyById(medicalSupply: MedicalSupply): Promise<HttpStatus<MedicalSupply>> {
        this.store.dispatch(showProgress());
        const medicalSupplyManager = new MedicalSupplyManager(null);
        medicalSupplyManager.classInfo.endPoint = medicalSupplyManager.classInfo.endPoint.concat('');
        let id: string = medicalSupply._id;
        return medicalSupplyManager.get(id);
    }

    async onLoadMedicalSupplyFilter(medicalSupply: MedicalSupplyReport): Promise<HttpStatus<MedicalSupply[]>> {
        this.store.dispatch(showProgress());
        const medicalSupplyManager = new MedicalSupplyManager(null);
        medicalSupplyManager.classInfo.endPoint = medicalSupplyManager.classInfo.endPoint.concat('/medicalSupplyFilter');
        return medicalSupplyManager.search(medicalSupply);
    }

    async onLoadMedicalSupplyUnit(): Promise<HttpStatus<MedicalSupplyHistory[]>> {
        const medicalSupplyUnit = new MedicalSupplyHistoryManager(null);
        medicalSupplyUnit.classInfo.endPoint = medicalSupplyUnit.classInfo.endPoint.concat('/medicalSupplyUnit');
        return medicalSupplyUnit.search(null);
    }
    async onReturnMedicalSupply(medicalSupply): Promise<HttpStatus<MedicalSupply>> {
      this.store.dispatch(showProgress());
      const medicalSupplyManager = new MedicalSupplyManager(null);
      medicalSupplyManager.classInfo.endPoint = medicalSupplyManager.classInfo.endPoint.concat('/returnMedicalSupply');
      return medicalSupplyManager.insert(medicalSupply);
  }
}
