let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import MedicalRecord from "../MedicalRecord";
export default class MedicalRecordManager extends BaseHelper<MedicalRecord> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "MedicalRecord";
    this.classInfo.type = MedicalRecord;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "medicalRecord";
  }

  public createObject(data): Promise<MedicalRecord> {
    let promise = new Promise((resolve, reject) => {
      let obj = new MedicalRecord();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: MedicalRecord, data: any) {
    obj._id = data._id;
    obj.medicalRecordCode = data.medicalRecordCode;
    obj.medicalRecordId = data.medicalRecordId;
    obj.customerCode = data.customerCode;
    obj.serviceRequest = data.serviceRequest;
    obj.stt = data.stt;
    obj.timeTranfer = data.timeTranfer;
    obj.noteTranfer = data.noteTranfer;
    obj.serviceType = data.serviceType;
    obj.medicalRecordName = data.medicalRecordName;
    obj.customerNote = data.customerNote;
    obj.currentRoom = data.currentRoom;
    obj.fromRoom = data.fromRoom;
    obj.toRoom = data.toRoom;
    obj.toRoomName = data.toRoomName;
    obj.staffId = data.staffId;
    obj.treatmentProcesses = data.treatmentProcesses;
    obj.statusMedical = data.statusMedical;
    obj.medicalServices = data.medicalServices;
    obj.medicalServiceIndicates = data.medicalServiceIndicates;
    obj.generalExamination = data.generalExamination;
    obj.braceExamination = data.braceExamination;
    obj.implantExamination = data.implantExamination;
    obj.images = data.images;
    obj.chair = data.chair;
    obj.payment = data.payment;    
    obj.treatment = data.treatment;
    obj.advice = data.advice;
    obj.customer = data.customer;
    obj.roomStatus = data.roomStatus;
    obj.medicalRecordCommitment = data.medicalRecordCommitment;
    obj.medicalService = data.medicalService;
    obj.medicalServicesUpdate = data.medicalServicesUpdate;
    obj.medicalServiceIndicate = data.medicalServiceIndicate;
    obj.medicalServiceIndicatesUpdate = data.medicalServiceIndicatesUpdate;
    obj.treatmentProcess = data.treatmentProcess;
    obj.paymentHistory = data.paymentHistory;
    obj.examinationHistories = data.examinationHistories;
    obj.currentPayment = data.currentPayment;
    obj.examinationDate = data.examinationDate;
    obj.customerInfo = data.customerInfo;
    obj.deliveryNoteImage = data.deliveryNoteImage;
    obj.note = data.note;
    obj.noteHistory = data.noteHistory;
    obj.medicalSupply = data.medicalSupply;
    obj.generalExaminationHistories = data.generalExaminationHistories;
    obj.braceExaminationHistories = data.braceExaminationHistories;
    obj.implantExaminationHistories = data.implantExaminationHistories;
    obj.reexaminationFlag = data.reexaminationFlag;
    obj.examinationDateHistory = data.examinationDateHistory;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new MedicalRecord();
  }
}
