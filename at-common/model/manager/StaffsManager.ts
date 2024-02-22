let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import HttpStatus from "../../base/HttpStatus";
export default class StaffsManager extends BaseHelper<Staffs> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "Staffs";
    this.classInfo.type = Staffs;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "staffs";
  }

  public createObject(data): Promise<Staffs> {
    let promise = new Promise((resolve, reject) => {
      let obj = new Staffs();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: Staffs, data: any) {
    obj._id = data._id;  
    obj.staffCode = data.staffCode;
    obj.fullName = data.fullName;   
    obj.fullName_en = data.fullName_en;   
    obj.email = data.email;   
    obj.password = data.password;
    obj.tel = data.tel;
    obj.birthday = data.birthday;
    obj.status = data.status;
    obj.id_number = data.id_number;
    obj.issueDate = data.issueDate;
    obj.issuePlace = data.issuePlace;
    obj.roleId = data.roleId;
    obj.token = data.token;
    obj.confirmPassword = data.confirmPassword;   
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;    
    obj.dataAccess = data.dataAccess;
    obj.resetPassword = data.resetPassword;
    obj.dataAccessNameExtends = data.dataAccessNameExtends;    
    obj.roleName = data.roleName;
    obj.roomIds = data.roomIds;
  }   

  public delete(search: any): Promise<HttpStatus<boolean>> {
    return this.persistance.delete(this, search);
  }
  public newInstance() {
    return new Staffs();
  }
}
