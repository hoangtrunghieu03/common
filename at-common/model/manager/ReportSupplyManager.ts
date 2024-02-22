let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import ReportSupply from "../ReportSupply";
export default class ReportSupplyManager extends BaseHelper<ReportSupply> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "MedicalSupplyInput";
    this.classInfo.type = ReportSupply;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "reportSupply";
  }

  public createObject(data): Promise<ReportSupply> {
    let promise = new Promise((resolve, reject) => {
      let obj = new ReportSupply();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: ReportSupply, data: any) {
    obj._id = data._id;
    obj.filter = data.filter;
    obj.details = data.details;    
    obj.rooms = data.rooms;    
    obj.roomDetails = data.roomDetails;    
    obj.supplies = data.supplies;    
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new ReportSupply();
  }
}
