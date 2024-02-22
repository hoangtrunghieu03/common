let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import Chair from "../Chair";
export default class ChairManager extends BaseHelper<Chair> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "Chair";
    this.classInfo.type = Chair;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "chair";
  }

  public createObject(data): Promise<Chair> {
    let promise = new Promise((resolve, reject) => {
      let obj = new Chair();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: Chair, data: any) {
    obj._id = data._id;
    obj.name = data.name;
    obj.description = data.description;
    obj.chairStatus = data.chairStatus;
    obj.roomId = data.roomId;
    obj.staffId = data.staffId;
    obj.staffName = data.staffName;
    obj.medicalRecordId = data.medicalRecordId;
    obj.customerName = data.customerName;
    obj.medicalRecordQueue = data.medicalRecordQueue;
    obj.count = data.count;
    obj.medicalRecord = data.medicalRecord;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new Chair();
  }
}
