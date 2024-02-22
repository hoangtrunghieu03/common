import { Injectable } from "@angular/core";
import MedicalComboService from '../../../../../at-common/model/MedicalComboService';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import MedicalComboServiceReport from '../../../../../at-common/model/MedicalComboServiceReport';
import MedicalComboServiceManager from '../../../../../at-common/model/manager/MedicalComboServiceManager';
import { Store } from "@ngrx/store";
import { RootState } from "../entities/state.entity";
import { showProgress } from "../actions/progress.action";

@Injectable()
export class MedicalComboServiceService {
    constructor(
        private store: Store<RootState>
    ) { }

    async onLoadMedicalComboService(): Promise<HttpStatus<MedicalComboService[]>> {
        this.store.dispatch(showProgress());
        const medicalComboServiceManager = new MedicalComboServiceManager(null);
        return medicalComboServiceManager.search(null)
    }

    async onCreateMedicalComboService(MedicalComboService: MedicalComboService): Promise<HttpStatus<MedicalComboService>> {
        this.store.dispatch(showProgress());
        const medicalComboServiceManager = new MedicalComboServiceManager(null);
        return medicalComboServiceManager.insert(MedicalComboService)
    }

    async onUpdateMedicalComboService(MedicalComboService: MedicalComboService): Promise<HttpStatus<MedicalComboService>> {
        this.store.dispatch(showProgress());
        const medicalComboServiceManager = new MedicalComboServiceManager(null);
        return medicalComboServiceManager.update({ _id: MedicalComboService._id }, MedicalComboService)
    }

    async onRemoveMedicalComboService(MedicalComboService: MedicalComboService): Promise<HttpStatus<boolean>> {
        this.store.dispatch(showProgress());
        const medicalComboServiceManager = new MedicalComboServiceManager(null);
        return medicalComboServiceManager.delete(MedicalComboService)
    }

    async onLoadMedicalComboServiceById(MedicalComboService: MedicalComboService): Promise<HttpStatus<MedicalComboService>> {
        this.store.dispatch(showProgress());
        const medicalComboServiceManager = new MedicalComboServiceManager(null);
        let id = MedicalComboService._id;
        return medicalComboServiceManager.get(id);
    }

    async onLoadMedicalComboServiceFilter(MedicalComboServiceReport: MedicalComboServiceReport): Promise<HttpStatus<MedicalComboService[]>> {
        this.store.dispatch(showProgress());
        const medicalComboServiceManager = new MedicalComboServiceManager(null);
        medicalComboServiceManager.classInfo.endPoint = medicalComboServiceManager.classInfo.endPoint.concat('/MedicalComboServiceFilter');
        return medicalComboServiceManager.search(MedicalComboServiceReport);
    }
}