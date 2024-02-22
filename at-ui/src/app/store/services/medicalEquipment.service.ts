import { Injectable } from '@angular/core';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import MedicalEquipmentManager from '../../../../../at-common/model/manager/MedicalEquipmentManager'
import MedicalEquipment from '../../../../../at-common/model/MedicalEquipment';
import Staffs from '../../../../../at-common/model/Staffs';
import MedicalSupplyHistoryReport from '../../../../../at-common/model/MedicalSupplyHistoryReport';
import MedicalSupplyHistoryManager from '../../../../../at-common/model/manager/MedicalSupplyHistoryManager';
import { Store } from '@ngrx/store';
import { RootState } from '../entities/state.entity';
import { showProgress } from 'src/app/store/actions/progress.action';

@Injectable()
export class MedicalEquipmentService {
    constructor(
        private store: Store<RootState>
    ) { }

    async loadAllEquipment(): Promise<HttpStatus<MedicalEquipment[]>> {
        this.store.dispatch(showProgress());
        const medicalEquipment = new MedicalEquipmentManager(null);
        medicalEquipment.classInfo.endPoint = medicalEquipment.classInfo.endPoint.concat('');
        return medicalEquipment.search(null);
    }

    async onLoadMedicalEquipmentById(medicalEquipment: MedicalEquipment): Promise<HttpStatus<MedicalEquipment>> {
        this.store.dispatch(showProgress());
        const medicalEquipmentManager = new MedicalEquipmentManager(null);
        let id = medicalEquipment._id;
        return medicalEquipmentManager.get(id);
    }

    async onCreatMedicalEquipment(medicalEquipment: MedicalEquipment): Promise<HttpStatus<MedicalEquipment>> {
        this.store.dispatch(showProgress());
        const medicalEquipmentManager = new MedicalEquipmentManager(null);
        return medicalEquipmentManager.insert(medicalEquipment);
    }

    async onUpdateMedicalEquipment(medicalEquipment: MedicalEquipment): Promise<HttpStatus<MedicalEquipment>> {
        this.store.dispatch(showProgress());
        const medicalEquipmentManager = new MedicalEquipmentManager(null);
        return medicalEquipmentManager.update({ _id: medicalEquipment._id }, medicalEquipment);
    }

    async onRemoveMedicalEquipment(medicalEquipment: MedicalEquipment): Promise<HttpStatus<boolean>> {
        this.store.dispatch(showProgress());
        const medicalEquipmentManager = new MedicalEquipmentManager(null);
        return medicalEquipmentManager.delete(medicalEquipment);
    }

    async onLoadMedicalSupplyHistory(medicalSupplyHistoryReport: MedicalSupplyHistoryReport): Promise<HttpStatus<any>> {
        this.store.dispatch(showProgress());
        const medicalSupplyHistoryManager = new MedicalSupplyHistoryManager(null);
        medicalSupplyHistoryManager.classInfo.endPoint = medicalSupplyHistoryManager.classInfo.endPoint.concat('/medicalSupplyFilter');
        return medicalSupplyHistoryManager.search(medicalSupplyHistoryReport);
    }

    async onLoadUnitSupplyHistory(): Promise<HttpStatus<any>> {
        this.store.dispatch(showProgress());
        const medicalSupplyHistoryManager = new MedicalSupplyHistoryManager(null);
        medicalSupplyHistoryManager.classInfo.endPoint = medicalSupplyHistoryManager.classInfo.endPoint.concat('/medicalSupplyUnit');
        return medicalSupplyHistoryManager.search(null);
    }

}
