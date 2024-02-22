let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import MedicalServiceGroup from "../MedicalServiceGroup";
export default class MedicalServiceGroupManager extends BaseHelper<MedicalServiceGroup> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "MedicalServiceGroup";
    this.classInfo.type = MedicalServiceGroup;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "medicalServiceGroup";
  }

  public createObject(data): Promise<MedicalServiceGroup> {
    let promise = new Promise((resolve, reject) => {
      let obj = new MedicalServiceGroup();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: MedicalServiceGroup, data: any) {
    obj._id = data._id;
    obj.name = data.name;
    obj.description = data.description;
    obj.updateByUserId = data.updateByUserId;
    obj.orderDisplay = data.orderDisplay;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new MedicalServiceGroup();
  }
}
