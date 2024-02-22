let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import ServiceRequest from "../ServiceRequest";
export default class ServiceRequestManager extends BaseHelper<ServiceRequest> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "ServiceRequest";
    this.classInfo.type = ServiceRequest;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "serviceRequest";
  }

  public createObject(data): Promise<ServiceRequest> {
    let promise = new Promise((resolve, reject) => {
      let obj = new ServiceRequest();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: ServiceRequest, data: any) {
    obj._id = data._id;       
    obj.serviceRequestName = data.serviceRequestName;    
    obj.typeServiceRequest = data.typeServiceRequest;    
    obj.description = data.description;         
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;     
    }  
  public newInstance() {
    return new ServiceRequest();
  }
}
