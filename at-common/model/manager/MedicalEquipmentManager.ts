let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import MedicalEquipment from "../MedicalEquipment";
export default class MedicalEquipmentManager extends BaseHelper<MedicalEquipment> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "MedicalEquipment";
    this.classInfo.type = MedicalEquipment;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "medicalEquipment";
  }

  public createObject(data): Promise<MedicalEquipment> {
    let promise = new Promise((resolve, reject) => {
      let obj = new MedicalEquipment();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: MedicalEquipment, data: any) {
    obj._id = data._id;
    obj.name = data.name;
    obj.price = data.price;
    obj.description = data.description;
    obj.quantity = data.quantity;
    obj.unit = data.unit;
    obj.origin = data.origin;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new MedicalEquipment();
  }
}
