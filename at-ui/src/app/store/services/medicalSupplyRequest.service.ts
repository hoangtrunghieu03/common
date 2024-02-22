import { Injectable } from '@angular/core';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import MedicalSupplyExportRequestManager from '../../../../../at-common/model/manager/MedicalSupplyExportRequestManager';
import MedicalSupplyExportRequest from '../../../../../at-common/model/MedicalSupplyExportRequest';
import { Store } from '@ngrx/store';
import { RootState } from '../entities/state.entity';
import { showProgress } from '../actions/progress.action';

@Injectable()
export class MedicalSupplyRequestService {

    constructor(
        private store: Store<RootState>) {
    }

    async onLoadMedicalSupplyRequest(): Promise<HttpStatus<MedicalSupplyExportRequest[]>> {
        this.store.dispatch(showProgress());
        const medicalSupplyExportRequestManager = new MedicalSupplyExportRequestManager(null);
        return medicalSupplyExportRequestManager.search(null);
    }

    async onCreateMedicalSupplyRequest(medicalSupply: MedicalSupplyExportRequest): Promise<HttpStatus<MedicalSupplyExportRequest>> {
        this.store.dispatch(showProgress());
        const medicalSupplyExportRequestManager = new MedicalSupplyExportRequestManager(null);
        return medicalSupplyExportRequestManager.insert(medicalSupply);
    }

    async onRemoveMedicalSupplyRequest(medicalSupply: MedicalSupplyExportRequest): Promise<HttpStatus<boolean>> {
        this.store.dispatch(showProgress());
        const medicalSupplyExportRequestManager = new MedicalSupplyExportRequestManager(null);
        return medicalSupplyExportRequestManager.delete(medicalSupply);
    }

    async onLoadMedicalSupplyRequestById(medicalSupply: MedicalSupplyExportRequest): Promise<HttpStatus<MedicalSupplyExportRequest>> {
        this.store.dispatch(showProgress());
        const medicalSupplyExportRequestManager = new MedicalSupplyExportRequestManager(null);
        let id: string = medicalSupply._id;
        return medicalSupplyExportRequestManager.get(id);
    }
}
