let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import MedicalSchedule from "../MedicalSchedule";
export default class MedicalScheduleManager extends BaseHelper<MedicalSchedule> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "MedicalSchedule";
    this.classInfo.type = MedicalSchedule;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "medicalSchedule";
  }

  public createObject(data): Promise<MedicalSchedule> {
    let promise = new Promise((resolve, reject) => {
      let obj = new MedicalSchedule();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: MedicalSchedule, data: any) {
    obj._id = data._id;
    obj.medicalRecordCode = data.medicalRecordCode;
    obj.customerCode = data.customerCode;
    obj.customerId = data.customerId;
    obj.serviceType = data.serviceType;
    obj.sampleReceiveDate = data.sampleReceiveDate;
    obj.statusArc = data.statusArc;
    obj.medicalServiceIndicateId = data.medicalServiceIndicateId;
    obj.medicalServiceIndicateName = data.medicalServiceIndicateName;
    obj.scheduleTime = data.scheduleTime;
    obj.typeSchedule = data.typeSchedule;
    obj.contentArea = data.contentArea;
    obj.isConfirm = data.isConfirm;
    obj.listSchduleConfirm = data.listSchduleConfirm;
    obj.medicalTreatmentProcessId = data.medicalTreatmentProcessId;
    obj.content = data.content;
    obj.content_en = data.content_en;
    obj.note = data.note;
    obj.staff = data.staff;
    obj.customer = data.customer;
    obj.executeOutSide = data.executeOutSide;
    obj.companyName = data.companyName;
    obj.companyName_en = data.companyName_en;
    obj.status = data.status;
    obj.customerName = data.customerName;
    obj.customerTel = data.customerTel;
    obj.medicalRecordId = data.medicalRecordId;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
    obj.countRemind = data.countRemind;
  }
  public newInstance() {
    return new MedicalSchedule();
  }
}
