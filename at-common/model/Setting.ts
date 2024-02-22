import BaseEntity from "../base/BaseEntity";
import { SETTING_TYPE } from "./enum";
/** THÔNG TIN GHẾ NGỒI */
export default class Setting extends BaseEntity<Setting> {
  settingType: string = SETTING_TYPE.PRINT;// Loại cài đặt
  settingKey: string = null; 
  settingValue: any = null;
  constructor() {
    super();
    this.settingValue = new Array<string>();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.settingType = obj.hasOwnProperty("settingType") ? obj.settingType : this.settingType;
    this.settingKey = obj.hasOwnProperty("settingKey") ? obj.settingKey : this.settingKey;
    this.settingValue = obj.hasOwnProperty("settingValue") ? obj.settingValue : this.settingValue;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;

  }
  public static newInstance(): Setting {
    let result = new Setting();
    return result;
  }
}