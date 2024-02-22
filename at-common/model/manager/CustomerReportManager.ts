let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import CustomerReport from "../CustomerReport";

export default class CustomerReportManager extends BaseHelper<CustomerReport> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "Customer";
    this.classInfo.type = CustomerReport;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "customer";
  }

  public createObject(data): Promise<CustomerReport> {
    let promise = new Promise((resolve, reject) => {
      let obj = new CustomerReport();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: CustomerReport, data: any) {
    obj._id = data._id;       
    obj.filter = data.filter;  
    obj.reports = data.reports;  
  }
  
  public newInstance() {
    return new CustomerReport();
  }
}
