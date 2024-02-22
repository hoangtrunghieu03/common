import { Injectable } from "@angular/core";
import MedicalServiceIndicate from '../../../../../at-common/model/MedicalServiceIndicate';
import MedicalServiceIndicateManager from '../../../../../at-common/model/manager/MedicalServiceIndicateManager';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import MedicalServiceIndicateReport from "../../../../../at-common/model/MedicalServiceIndicateReport";
import { RootState } from "../entities/state.entity";
import { Store } from "@ngrx/store";
import { showProgress } from "../actions/progress.action";

@Injectable()

export class ServiceIndicateService {
    constructor(
        private store: Store<RootState>
    ) { }

    async onLoadMedicalService(): Promise<HttpStatus<MedicalServiceIndicate[]>> {
        this.store.dispatch(showProgress());
        const medicalServiceIndicateManager = new MedicalServiceIndicateManager(null)
        return medicalServiceIndicateManager.search(null)
    }

    async onLoadServiceIndicateById(action): Promise<HttpStatus<MedicalServiceIndicate>> {
        this.store.dispatch(showProgress());
        let id = action.id;
        const medicalServiceIndicateManager = new MedicalServiceIndicateManager(null)
        return medicalServiceIndicateManager.get(id)
    }

    async onUpdateServiceIndicate(medicalIndicate: MedicalServiceIndicate): Promise<HttpStatus<MedicalServiceIndicate>> {
        this.store.dispatch(showProgress());
        const medicalServiceIndicateManager = new MedicalServiceIndicateManager(null);
        return medicalServiceIndicateManager.update({ _id: medicalIndicate._id }, medicalIndicate)
    }

    async onRemoveServiceIndicate(medicalIndicate: MedicalServiceIndicate): Promise<HttpStatus<boolean>> {
        this.store.dispatch(showProgress());
        const medicalServiceIndicateManager = new MedicalServiceIndicateManager(null);
        return medicalServiceIndicateManager.delete(medicalIndicate)
    }

    async onCreateServiceIndicate(serviceIndicate: MedicalServiceIndicate): Promise<HttpStatus<MedicalServiceIndicate>> {
        this.store.dispatch(showProgress());
        const serviceIndicateManager = new MedicalServiceIndicateManager(null);
        return serviceIndicateManager.insert(serviceIndicate)
    }

    async onLoadServiceIndicateFilter(serviceIndicateReport: MedicalServiceIndicateReport): Promise<HttpStatus<MedicalServiceIndicate[]>> {
        this.store.dispatch(showProgress());
        const serviceIndicateManager = new MedicalServiceIndicateManager(null);
        serviceIndicateManager.classInfo.endPoint = serviceIndicateManager.classInfo.endPoint.concat('/medicalServiceIndicateFilter');
        return serviceIndicateManager.search(serviceIndicateReport);
    }

    async onLoadTagServiceIndicate(): Promise<HttpStatus<Array<{ _id: string, tagService: string }>>> {
        this.store.dispatch(showProgress());
        const tagServiceIndicateManager = new MedicalServiceIndicateManager(null);
        tagServiceIndicateManager.classInfo.endPoint = tagServiceIndicateManager.classInfo.endPoint.concat('/medicalServiceIndicateTag');
        return tagServiceIndicateManager.search(null);
    }
}