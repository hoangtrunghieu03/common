let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import DataAccess from "../DataAccess";
export default class DataAccessManager extends BaseHelper<DataAccess> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "DataAccess";
    this.classInfo.type = DataAccess;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "dataAccess";
  }

  public createObject(data): Promise<DataAccess> {
    let promise = new Promise((resolve, reject) => {
      let obj = new DataAccess();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: DataAccess, data: any) {
    obj._id = data._id;           
    obj.dataAccessName = data.dataAccessName;   
    obj.group = data.group;    
    obj.groupOrder = data.groupOrder;    
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;  
  }
  
  public newInstance() {
    return new DataAccess();
  }
}
