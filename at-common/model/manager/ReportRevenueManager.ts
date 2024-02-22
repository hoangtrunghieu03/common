let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import ReportRevenue from "../ReportRevenue";
export default class ReportRevenueManager extends BaseHelper<ReportRevenue> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "MedicalRecord";
    this.classInfo.type = ReportRevenue;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "reportRevenue";
  }

  public createObject(data): Promise<ReportRevenue> {
    let promise = new Promise((resolve, reject) => {
      let obj = new ReportRevenue();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: ReportRevenue, data: any) {
    obj._id = data._id;
    obj.filter = data.filter;
    obj.general = data.general;
    obj.generalDetails = data.generalDetails;
    obj.staffs = data.staffs;
    obj.services = data.services;
    obj.rooms = data.rooms;
    obj.staffDetails = data.staffDetails;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new ReportRevenue();
  }
}
