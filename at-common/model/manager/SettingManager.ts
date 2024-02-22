let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import Setting from "../Setting";
export default class SettingManager extends BaseHelper<Setting> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "Setting";
    this.classInfo.type = Setting;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "setting";
  }

  public createObject(data): Promise<Setting> {
    let promise = new Promise((resolve, reject) => {
      let obj = new Setting();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: Setting, data: any) {
    obj._id = data._id;
    obj.settingType = data.settingType;
    obj.settingKey = data.settingKey;
    obj.settingValue = data.settingValue;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new Setting();
  }
}
