let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import MedicalSupplyInput from "../MedicalSupplyInput";
export default class MedicalSupplyManager extends BaseHelper<MedicalSupplyInput> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "MedicalSupplyInput";
    this.classInfo.type = MedicalSupplyInput;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "medicalSupplyInput";
  }

  public createObject(data): Promise<MedicalSupplyInput> {
    let promise = new Promise((resolve, reject) => {
      let obj = new MedicalSupplyInput();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: MedicalSupplyInput, data: any) {
    obj._id = data._id;
    obj.medicalSupplyId = data.medicalSupplyId;
    // obj.mfgDate = data.mfgDate;
    obj.expDate = data.expDate;
    obj.quantity = data.quantity;
    obj.quantityRemain = data.quantityRemain;
    obj.priceInput = data.priceInput;
    obj.medicalSupplyInputId = data.medicalSupplyInputId;
    obj.reason = data.reason;
    obj.note = data.note;
    obj.listSupply = data.listSupply;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new MedicalSupplyInput();
  }
}
