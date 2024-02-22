import { Injectable } from "@angular/core";
import MedicalServiceIndicateGroup from '../../../../../at-common/model/MedicalServiceIndicateGroup';
import MedicalServiceIndicateGroupManager from '../../../../../at-common/model/manager/MedicalServiceIndicateGroupManager';
import HttpStatus from '../../../../../at-common/base/HttpStatus';


@Injectable()

export class ServiceIndicateGroupService {
    constructor() {}

    async onLoadMedicalServiceGroup():Promise<HttpStatus<MedicalServiceIndicateGroup[]>> {
        const medicalServiceIndicateGroupManager = new MedicalServiceIndicateGroupManager(null)
        return medicalServiceIndicateGroupManager.search(null)
    }
}