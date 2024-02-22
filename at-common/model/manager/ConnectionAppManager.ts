let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import ConnectionApp from "../ConnectionApp";
export default class ConnectionAppManager extends BaseHelper<ConnectionApp> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "ConnectionApp";
    this.classInfo.type = ConnectionApp;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "connectionApp";
  }

  public createObject(data): Promise<ConnectionApp> {
    let promise = new Promise((resolve, reject) => {
      let obj = new ConnectionApp();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: ConnectionApp, data: any) {
    obj._id = data._id;       
    obj.name = data.name; 
    obj.userName = data.userName; 
    obj.url = data.url;    
    obj.accessToken = data.accessToken;        
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;     
    }  
  public newInstance() {
    return new ConnectionApp();
  }
}
