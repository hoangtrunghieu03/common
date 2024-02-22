import { Injectable } from '@angular/core';
import MedicalRecord from '../../../../../at-common/model/MedicalRecord';
import MedicalRecordManager from '../../../../../at-common/model/manager/MedicalRecordManager';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import PaymentHistory from '../../../../../at-common/model/PaymentHistory';
import MedicalRecordReport from '../../../../../at-common/model/MedicalRecordReport';
import MedicalRecordReportManager from '../../../../../at-common/model/manager/MedicalRecordReportManager';
import { RootState } from '../entities/state.entity';
import { Store } from '@ngrx/store';
import { showProgress } from '../actions/progress.action';

@Injectable()
export class MedicalRecordService {

    constructor(
        private store: Store<RootState>) {
    }

    async onCreateMedicalRecord(medicalRecord: MedicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/reception');
        return medicalRecordManager.insert(medicalRecord);
    }

    async onLoadMedicalRecordById(action): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        let id = action.id;
        return medicalRecordManager.get(id);
    }

    async onLoadMedicalRecordByDate(action): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/medicalRecordByDate');
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/' + action.id);
        return medicalRecordManager.get(action.examinationDate);
    }

    async onDeletePayHistoryMedicalRecord(paymenHistory: PaymentHistory): Promise<HttpStatus<boolean>> {
      this.store.dispatch(showProgress());
      const medicalRecordManager:any = new MedicalRecordManager(null);
      medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/payment');
      return medicalRecordManager.delete(paymenHistory);
     }
    async onLoadMedicalRecordPaymentHistory(action): Promise<HttpStatus<any>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/paymentHistory');
        let medicalRecordCode = action.medicalRecordCode;
        return medicalRecordManager.get(medicalRecordCode);
    }

    async onMedicalRecordPayment(medicalRecord: MedicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/payment');
        return medicalRecordManager.update({ _id: medicalRecord._id }, medicalRecord);
    }

    async onUpdateMedicalRecordGeneral(medicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/general');
        return medicalRecordManager.update({ _id: medicalRecord._id }, medicalRecord);
    }

    async onUpdateMedicalRecordBrace(medicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/brace');
        return medicalRecordManager.update({ _id: medicalRecord._id }, medicalRecord);
    }

    async onAddTreatmentProcess(medicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/treatmentProcess');
        return medicalRecordManager.update({ _id: medicalRecord._id }, medicalRecord);
    }

    async onFinishTreatmentProcess(medicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/treatmentProcessFinish');
        return medicalRecordManager.update({ _id: medicalRecord._id }, medicalRecord);
    }

    async onAddMedicalServiceIndicates(medicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/medicalServiceIndicate');
        return medicalRecordManager.update({ _id: medicalRecord._id }, medicalRecord);
    }

    async onAddMedicalService(medicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/medicalService');
        return medicalRecordManager.update({ _id: medicalRecord._id }, medicalRecord);
    }

    async onDeleteTreatmentProcess(treatment): Promise<HttpStatus<boolean>> {
        this.store.dispatch(showProgress());
        const medicalRecord = {
            criteria: { _id: treatment._id },
            data: {
              _id: treatment._id,
              treatmentProcess: {
                id: treatment.treatmentProcess
              }
            }
          }
        const medicalRecordManager:any = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/treatmentProcess');
        return medicalRecordManager.delete(medicalRecord);
    }

    async onTransferRoom(roomData): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/tranferRoom');
        return medicalRecordManager.update({ _id: roomData._id }, roomData);
    }

    async onReceiveCustomerToRoom(medicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/receiveCustomerToRoom');
        return medicalRecordManager.update({ _id: medicalRecord._id }, medicalRecord);
    }

    async onMedicalCustomerChair(medicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/medicalCustomerChair');
        return medicalRecordManager.update({ _id: medicalRecord._id }, medicalRecord);
    }

    async onMedicalSICommand(medicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/medicalServiceIndicateCommand');
        return medicalRecordManager.update({ _id: medicalRecord._id }, medicalRecord);
    }

    async onExaminationFinish(medicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/examinationFinish');
        return medicalRecordManager.update({ _id: medicalRecord._id }, medicalRecord);
    }

    async onMedicalRecordFinish(medicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/medicalRecordFinish');
        return medicalRecordManager.update({ _id: medicalRecord._id }, medicalRecord);
    }

    async onMedicalServiceCommand(medicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/medicalServiceCommand');
        return medicalRecordManager.update({ _id: medicalRecord._id }, medicalRecord);
    }

    async onUpdateMedicalRecordImplant(medicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/implaint');
        return medicalRecordManager.update({ _id: medicalRecord._id }, medicalRecord);
    }

    async onReExamination(medicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/reExammination');
        return medicalRecordManager.update({ _id: medicalRecord._id }, medicalRecord);
    }

    async onUpdateMedicalRecordName(medicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/medicalRecordName');
        return medicalRecordManager.update({ _id: medicalRecord._id }, medicalRecord);
    }

    async onRemoveExamination(medicalRecord): Promise<HttpStatus<boolean>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        return medicalRecordManager.delete(medicalRecord);
    }

    async onMedicalRecordNote(medicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/medicalRecordNote');
        return medicalRecordManager.update({ _id: medicalRecord._id }, medicalRecord);
    }

    async onMedicalRecordImages(medicalRecord): Promise<HttpStatus<MedicalRecord>> {
        this.store.dispatch(showProgress());
        const medicalRecordManager = new MedicalRecordManager(null);
        medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/medicalRecordImages');
        return medicalRecordManager.update({ _id: medicalRecord._id }, medicalRecord);
    }

    async onLoadMedicalRecordFilter(filter): Promise<HttpStatus<MedicalRecordReport[]>> {
        this.store.dispatch(showProgress());
        const medicalRecordReportManager = new MedicalRecordReportManager(null);
        medicalRecordReportManager.classInfo.endPoint = medicalRecordReportManager.classInfo.endPoint.concat('/medicalRecordFilter');
        return medicalRecordReportManager.search(filter);
    }

}
