let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import MedicalServiceIndicate from "../MedicalServiceIndicate";
export default class MedicalServiceIndicateManager extends BaseHelper<MedicalServiceIndicate> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "MedicalServiceIndicate";
    this.classInfo.type = MedicalServiceIndicate;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "medicalServiceIndicate";
  }

  public createObject(data): Promise<MedicalServiceIndicate> {
    let promise = new Promise((resolve, reject) => {
      let obj = new MedicalServiceIndicate();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: MedicalServiceIndicate, data: any) {
    obj._id = data._id;
    obj.orderDisplay = data.orderDisplay;
    obj.name = data.name;
    obj.name_en = data.name_en;
    obj.price = data.price;
    obj.description = data.description;
    obj.shortName = data.shortName;
    obj.tagService = data.tagService;
    obj.typeIndicate = data.typeIndicate;
    obj.medicalServiceIndicateGroupId = data.medicalServiceIndicateGroupId;
    obj.medicalServiceIndicateGroupName = data.medicalServiceIndicateGroupName;   
    obj.medicalServiceIndicateGroupShortName = data.medicalServiceIndicateGroupShortName;   
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new MedicalServiceIndicate();
  }
}
