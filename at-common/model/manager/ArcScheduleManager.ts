let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import ArcSchedule from "../ArcSchedule";
export default class ArcScheduleManager extends BaseHelper<ArcSchedule> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "ArcSchedule";
    this.classInfo.type = ArcSchedule;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "ArcSchedule";
  }

  public createObject(data): Promise<ArcSchedule> {
    let promise = new Promise((resolve, reject) => {
      let obj = new ArcSchedule();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: ArcSchedule, data: any) {
    obj._id = data._id;
    obj.medicalRecordCode = data.medicalRecordCode;
    obj.deliveryDate = data.deliveryDate;
    obj.customerCode = data.customerCode;
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
  }
  public newInstance() {
    return new ArcSchedule();
  }
}
