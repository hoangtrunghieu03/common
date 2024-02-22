let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import Room from "../Room";
export default class RoomManager extends BaseHelper<Room> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "Room";
    this.classInfo.type = Room;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "room";
  }

  public createObject(data): Promise<Room> {
    let promise = new Promise((resolve, reject) => {
      let obj = new Room();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: Room, data: any) {
    obj._id = data._id;       
    obj.name = data.name;    
    obj.description = data.description;         
    obj.customerCurrent = data.customerCurrent;         
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;     
    }  
  public newInstance() {
    return new Room();
  }
}
