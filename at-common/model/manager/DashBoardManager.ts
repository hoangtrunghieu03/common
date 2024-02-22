let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import DashBoard from "../DashBoard";
export default class DashBoardManager extends BaseHelper<DashBoard> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "MedicalRecord";
    this.classInfo.type = DashBoard;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "dashBoard";
  }

  public createObject(data): Promise<DashBoard> {
    let promise = new Promise((resolve, reject) => {
      let obj = new DashBoard();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: DashBoard, data: any) {
    obj._id = data._id;
    obj.revenueDays = data.revenueDays;
    obj.customers = data.customers;
    obj.medicalServices = data.medicalServices;
    obj.chairs = data.chairs;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new DashBoard();
  }
}
