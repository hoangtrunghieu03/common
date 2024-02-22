let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import DeliveryNote from "../DeliveryNote";
export default class DeliveryNoteManager extends BaseHelper<DeliveryNote> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "DeliveryNote";
    this.classInfo.type = DeliveryNote;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "deliveryNote";
  }

  public createObject(data): Promise<DeliveryNote> {
    let promise = new Promise((resolve, reject) => {
      let obj = new DeliveryNote();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: DeliveryNote, data: any) {
    obj._id = data._id;
    obj.typeDeliveryNote = data.typeDeliveryNote;
    obj.sender = data.sender;
    obj.receiver = data.receiver;
    obj.listDeliveryNote = data.listDeliveryNote;
    obj.content = data.content;
    obj.image = data.image;
    obj.dateDelivery = data.dateDelivery;
    // obj.imageBase64 = data.imageBase64;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new DeliveryNote();
  }
}
