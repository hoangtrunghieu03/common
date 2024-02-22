import { Injectable } from "@angular/core";
import MedicalServiceGroup from '../../../../../at-common/model/MedicalServiceGroup';
import MedicalServiceGroupManager from '../../../../../at-common/model/manager/MedicalServiceGroupManager';
import HttpStatus from '../../../../../at-common/base/HttpStatus';


@Injectable()

export class MedicalServiceGroupService {
    constructor() {}

    async onLoadMedicalServiceGroup():Promise<HttpStatus<MedicalServiceGroup[]>> {
        const medicalServiceGroupManager = new MedicalServiceGroupManager(null)
        return medicalServiceGroupManager.search(null)
    }
}