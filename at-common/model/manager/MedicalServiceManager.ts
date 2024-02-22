let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import MedicalService from "../MedicalService";
export default class MedicalServiceManager extends BaseHelper<MedicalService> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "MedicalService";
    this.classInfo.type = MedicalService;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "medicalService";
  }

  public createObject(data): Promise<MedicalService> {
    let promise = new Promise((resolve, reject) => {
      let obj = new MedicalService();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: MedicalService, data: any) {
    obj._id = data._id;
    obj.orderDisplay = data.orderDisplay;
    obj.name = data.name;
    obj.name_en = data.name_en;
    obj.price = data.price;
    obj.description = data.description;
    obj.medicalServiceGroupId = data.medicalServiceGroupId;
    obj.priceType = data.priceType;
    obj.priceMin = data.priceMin;   
    obj.priceMax = data.priceMax;   
    obj.tagService = data.tagService;   
    obj.medicalServiceGroupName = data.medicalServiceGroupName;   
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new MedicalService();
  }
}
