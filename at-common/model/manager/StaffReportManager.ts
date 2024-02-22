let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import StaffReport from "../StaffReport";

export default class StaffReportManager extends BaseHelper<StaffReport> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "Staffs";
    this.classInfo.type = StaffReport;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "staffs";
  }

  public createObject(data): Promise<StaffReport> {
    let promise = new Promise((resolve, reject) => {
      let obj = new StaffReport();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: StaffReport, data: any) {
    obj._id = data._id;       
    obj.filter = data.filter;  
    obj.datas = data.datas;  
  }
  
  public newInstance() {
    return new StaffReport();
  }
}
