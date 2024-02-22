let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import MedicalServiceIndicateGroup from "../MedicalServiceIndicateGroup";
export default class MedicalServiceIndicateGroupManager extends BaseHelper<MedicalServiceIndicateGroup> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "MedicalServiceIndicateGroup";
    this.classInfo.type = MedicalServiceIndicateGroup;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "medicalServiceIndicateGroup";
  }

  public createObject(data): Promise<MedicalServiceIndicateGroup> {
    let promise = new Promise((resolve, reject) => {
      let obj = new MedicalServiceIndicateGroup();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: MedicalServiceIndicateGroup, data: any) {
    obj._id = data._id;
    obj.name = data.name;
    obj.description = data.description;
    obj.orderDisplay = data.orderDisplay;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new MedicalServiceIndicateGroup();
  }
}
