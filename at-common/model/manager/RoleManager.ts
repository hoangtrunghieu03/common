let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import Role from "../Role";
export default class RoleManager extends BaseHelper<Role> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "Role";
    this.classInfo.type = Role;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "role";
  }

  public createObject(data): Promise<Role> {
    let promise = new Promise((resolve, reject) => {
      let obj = new Role();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: Role, data: any) {
    obj._id = data._id;           
    obj.roleName = data.roleName;   
    obj.dataAccessNames = data.dataAccessNames;      
    obj.dataAccesses = data.dataAccesses;      
    obj.staffCount = data.staffCount;      
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;  
  }
  
  public newInstance() {
    return new Role();
  }
}
