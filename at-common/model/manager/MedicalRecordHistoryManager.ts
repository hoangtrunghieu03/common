let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import MedicalRecordHistory from "../MedicalRecordHistory";
import Staffs from "../Staffs";
export default class MedicalRecordHistoryManager extends BaseHelper<MedicalRecordHistory> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "MedicalRecordHistory";
    this.classInfo.type = MedicalRecordHistory;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "medicalRecordHistory";
  }

  public createObject(data): Promise<MedicalRecordHistory> {
    let promise = new Promise((resolve, reject) => {
      let obj = new MedicalRecordHistory();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: MedicalRecordHistory, data: any) {
    obj._id = data._id;
    obj.medicalRecordCode = data.medicalRecordCode;
    obj.action = data.action;
    obj.medicalServiceName = data.medicalServiceName;
    obj.medicalServiceIndicateName = data.medicalServiceIndicateName;
    obj.moneyPayment = data.moneyPayment;
    obj.roomFromName = data.roomFromName;
    obj.roomToName = data.roomToName;
    obj.staffId = data.staffId;
    obj.staffName = data.staffName;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new MedicalRecordHistory();
  }
}
