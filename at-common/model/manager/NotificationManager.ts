let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import Notification from "../Notification";
export default class NotificationManager extends BaseHelper<Notification> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "Notification";
    this.classInfo.type = Notification;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "notification";
  }

  public createObject(data): Promise<Notification> {
    let promise = new Promise((resolve, reject) => {
      let obj = new Notification();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: Notification, data: any) {
    obj._id = data._id;
    obj.medicalRecordId = data.medicalRecordId;
    obj.customerCode = data.customerCode;
    obj.action = data.action;
    obj.dataAccessNames = data.dataAccessNames;
    obj.content = data.content;
    obj.scheduleId = data.scheduleId;
    obj.staffIds = data.staffIds;
    obj.markRead = data.markRead;
    obj.roomId = data.roomId;
    obj.roomName = data.roomName;
    obj.fromRoomName = data.fromRoomName;
    obj.fromRoomId = data.fromRoomId;
    obj.customerName = data.customerName;
    obj.chairStatus = data.chairStatus;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
    obj.fromStaffId = data.fromStaffId;
  }
  public newInstance() {
    return new Notification();
  }
}
