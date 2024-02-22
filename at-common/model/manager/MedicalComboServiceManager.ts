let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import MedicalComboService from "../MedicalComboService";
export default class MedicalComboServiceManager extends BaseHelper<MedicalComboService> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "MedicalComboService";
    this.classInfo.type = MedicalComboService;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "medicalComboService";
  }

  public createObject(data): Promise<MedicalComboService> {
    let promise = new Promise((resolve, reject) => {
      let obj = new MedicalComboService();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: MedicalComboService, data: any) {
    obj._id = data._id;
    obj.medicalComboServiceCode = data.medicalComboServiceCode;
    obj.name = data.name;
    obj.price = data.price;
    obj.description = data.description;
    obj.medicalServices = data.medicalServices;
    obj.medicalServicesName = data.medicalServicesName;
    obj.medicalServiceIndicates = data.medicalServiceIndicates;
    obj.medicalServiceIndicatesName = data.medicalServiceIndicatesName;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new MedicalComboService();
  }
}
