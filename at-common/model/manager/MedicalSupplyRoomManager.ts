let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import MedicalSupplyRoom from "../MedicalSupplyRoom";
export default class MedicalSupplyRoomManager extends BaseHelper<MedicalSupplyRoom> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "MedicalSupplyRoom";
    this.classInfo.type = MedicalSupplyRoom;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "medicalSupplyRoom";
  }

  public createObject(data): Promise<MedicalSupplyRoom> {
    let promise = new Promise((resolve, reject) => {
      let obj = new MedicalSupplyRoom();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: MedicalSupplyRoom, data: any) {
    obj._id = data._id;
    obj.medicalSupplyId = data.medicalSupplyId;
    obj.medicalSupplyName = data.medicalSupplyName;
    obj.medicalSupplyName_en = data.medicalSupplyName_en;
    obj.medicalSupplyUnit = data.medicalSupplyUnit;
    obj.medicalSupplyInputId = data.medicalSupplyInputId;
    obj.roomId = data.roomId;
    obj.listSupply = data.listSupply;
    obj.quantityRemain = data.quantityRemain;    
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new MedicalSupplyRoom();
  }
}
