import { Injectable } from "@angular/core";
import MedicalService from '../../../../../at-common/model/MedicalService';
import MedicalServiceManager from '../../../../../at-common/model/manager/MedicalServiceManager';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import MedicalServiceReport from '../../../../../at-common/model/MedicalServiceReport';
import { RootState } from "../entities/state.entity";
import { Store } from "@ngrx/store";
import { showProgress } from "../actions/progress.action";


@Injectable()
export class MedicalServiceService {
    constructor(
        private store: Store<RootState>) { }

    async onLoadMedicalService(): Promise<HttpStatus<MedicalService[]>> {
        this.store.dispatch(showProgress());
        const medicalServiceManager = new MedicalServiceManager(null);
        return medicalServiceManager.search(null)
    }

    async onCreateMedicalService(medicalService: MedicalService): Promise<HttpStatus<MedicalService>> {
        this.store.dispatch(showProgress());
        const medicalServiceManager = new MedicalServiceManager(null);
        return medicalServiceManager.insert(medicalService)
    }

    async onUpdateMedicalService(medicalService: MedicalService): Promise<HttpStatus<MedicalService>> {
        this.store.dispatch(showProgress());
        const medicalServiceManager = new MedicalServiceManager(null);
        return medicalServiceManager.update({ _id: medicalService._id }, medicalService)
    }

    async onRemoveMedicalService(medicalService: MedicalService): Promise<HttpStatus<boolean>> {
        this.store.dispatch(showProgress());
        const medicalServiceManager = new MedicalServiceManager(null);
        return medicalServiceManager.delete(medicalService)
    }

    async onLoadMedicalServiceById(medicalService: MedicalService): Promise<HttpStatus<MedicalService>> {
        this.store.dispatch(showProgress());
        const medicalServiceManager = new MedicalServiceManager(null);
        let id = medicalService._id;
        return medicalServiceManager.get(id);
    }

    async onLoadMedicalServiceFilter(medicalServiceReport: MedicalServiceReport): Promise<HttpStatus<MedicalService[]>> {
        this.store.dispatch(showProgress());
        const medicalServiceManager = new MedicalServiceManager(null);
        medicalServiceManager.classInfo.endPoint = medicalServiceManager.classInfo.endPoint.concat('/medicalServiceFilter');
        return medicalServiceManager.search(medicalServiceReport);
    }

    async onLoadMedicalServiceTag(): Promise<HttpStatus<Array<{ _id: string, tagService: string }>>> {
        this.store.dispatch(showProgress());
        const medicalServiceManager = new MedicalServiceManager(null);
        medicalServiceManager.classInfo.endPoint = medicalServiceManager.classInfo.endPoint.concat('/medicalServiceTag');
        return medicalServiceManager.search(null);
    }
}