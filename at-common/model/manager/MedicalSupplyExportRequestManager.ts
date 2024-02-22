let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import MedicalSupplyExportRequest from "../MedicalSupplyExportRequest";
export default class MedicalSupplyExportRequestManager extends BaseHelper<MedicalSupplyExportRequest> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "MedicalSupplyExportRequest";
    this.classInfo.type = MedicalSupplyExportRequest;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "MedicalSupplyExportRequest";
  }

  public createObject(data): Promise<MedicalSupplyExportRequest> {
    let promise = new Promise((resolve, reject) => {
      let obj = new MedicalSupplyExportRequest();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: MedicalSupplyExportRequest, data: any) {
    obj._id = data._id;
    obj.staffId = data.staffId;
    obj.roomId = data.roomId;
    obj.listSupply = data.listSupply;
    obj.confirmFlag = data.confirmFlag;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new MedicalSupplyExportRequest();
  }
}
