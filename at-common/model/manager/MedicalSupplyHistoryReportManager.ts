let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import MedicalSupplyHistoryReport from "../MedicalSupplyHistoryReport";
export default class MedicalSupplyHistoryReportReportManager extends BaseHelper<MedicalSupplyHistoryReport> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "MedicalSupplyHistory";
    this.classInfo.type = MedicalSupplyHistoryReport;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "medicalSupplyHistoryReport";
  }

  public createObject(data): Promise<MedicalSupplyHistoryReport> {
    let promise = new Promise((resolve, reject) => {
      let obj = new MedicalSupplyHistoryReport();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: MedicalSupplyHistoryReport, data: any) {
    obj._id = data._id;
    obj.filter = data.filter;
    obj.datas = data.datas;
  }
  public newInstance() {
    return new MedicalSupplyHistoryReport();
  }
}
