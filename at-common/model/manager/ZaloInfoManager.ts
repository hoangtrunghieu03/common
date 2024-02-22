let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import ZaloInfo from "../ZaloInfo";
import HttpStatus from "../../base/HttpStatus";
import Staffs from "../Staffs";
export default class ZaloInfoManager extends BaseHelper<ZaloInfo> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "ZaloInfo";
    this.classInfo.type = ZaloInfo;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "zaloInfo";
  }

  public createObject(data): Promise<ZaloInfo> {
    let promise = new Promise((resolve, reject) => {
      let obj = new ZaloInfo();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: ZaloInfo, data: any) {
    obj._id = data._id;  
    obj.url = data.url
    obj.urlPermission = data.urlPermission
    obj.callBackUrl = data.callBackUrl
    obj.redirectUrl = data.redirectUrl
    obj.codeChallenge = data.codeChallenge
    obj.codeVerifier = data.codeVerifier
    obj.secret_key = data.secret_key
    obj.refresh_token = data.refresh_token
    obj.access_token = data.access_token
    obj.app_id = data.app_id
    obj.expire_in = data.expire_in
    obj.oa_id = data.oa_id
    obj.date_expire_refresh = data.date_expire_refresh
    obj.date_expire_access = data.date_expire_access
    obj.grant_type = data.grant_type
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;    
  }   

  public delete(search: any): Promise<HttpStatus<boolean>> {
    return this.persistance.delete(this, search);
  }
  public newInstance() {
    return new ZaloInfo();
  }
}
