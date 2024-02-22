let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import MedicalSupplyHistory from "../MedicalSupplyHistory";
export default class MedicalSupplyHistoryManager extends BaseHelper<MedicalSupplyHistory> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "MedicalSupplyHistory";
    this.classInfo.type = MedicalSupplyHistory;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "medicalSupplyHistory";
  }

  public createObject(data): Promise<MedicalSupplyHistory> {
    let promise = new Promise((resolve, reject) => {
      let obj = new MedicalSupplyHistory();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: MedicalSupplyHistory, data: any) {
    obj._id = data._id;
    obj.medicalSupplyId = data.medicalSupplyId;
    obj.medicalSupplyName = data.medicalSupplyName;
    obj.medicalSupplyName_en = data.medicalSupplyName_en;
    obj.medicalSupplyUnit = data.medicalSupplyUnit;
    obj.medicalSupplyOrigin = data.medicalSupplyOrigin;
    obj.medicalSupplyInputId = data.medicalSupplyInputId;
    obj.roomId = data.roomId;
    obj.quantity = data.quantity;   
    obj.reason = data.reason;  
    obj.reasonAdjust = data.reasonAdjust;  
    obj.noteAdjust = data.noteAdjust;  
    obj.medicalRecordId = data.medicalRecordId;  
    obj.medicalRecordCode = data.medicalRecordCode;  
    obj.customerCode = data.customerCode;  
    obj.customerName = data.customerName;  
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new MedicalSupplyHistory();
  }
}
