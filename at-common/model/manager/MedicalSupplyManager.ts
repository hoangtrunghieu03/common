let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import MedicalSupply from "../MedicalSupply";
export default class MedicalSupplyManager extends BaseHelper<MedicalSupply> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "MedicalSupply";
    this.classInfo.type = MedicalSupply;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "medicalSupply";
  }

  public createObject(data): Promise<MedicalSupply> {
    let promise = new Promise((resolve, reject) => {
      let obj = new MedicalSupply();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: MedicalSupply, data: any) {
    obj._id = data._id;
    obj.medicalSupplyCode = data.medicalSupplyCode;
    obj.listSupply = data.listSupply;
    obj.reason = data.reason;
    obj.note = data.note;
    obj.medicalSupplyInputId = data.medicalSupplyInputId;
    obj.supplyRequestId = data.supplyRequestId;
    obj.roomId = data.roomId;
    obj.name = data.name;
    obj.name_en = data.name_en;
    obj.price = data.price;
    obj.description = data.description;
    obj.quantity = data.quantity;
    obj.minQuantity = data.minQuantity;
    obj.unit = data.unit;
    obj.origin = data.origin;
    obj.origin_en = data.origin_en;
    obj.groupSupplyId = data.groupSupplyId;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
    // obj.mfgDate = data.mfgDate;
    obj.expDate = data.expDate;
  }
  public newInstance() {
    return new MedicalSupply();
  }
}
