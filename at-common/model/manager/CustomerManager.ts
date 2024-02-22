let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import Customer from "../Customer";

export default class CustomerManager extends BaseHelper<Customer> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "Customer";
    this.classInfo.type = Customer;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "customer";
  }

  public createObject(data): Promise<Customer> {
    let promise = new Promise((resolve, reject) => {
      let obj = new Customer();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: Customer, data: any) {
    obj._id = data._id;
    obj.customerCode = data.customerCode;
    obj.fullName = data.fullName;
    obj.fullName_en = data.fullName_en;
    obj.sex = data.sex;
    obj.birthday = data.birthday;
    obj.tel = data.tel;
    obj.isPhoneContact = data.isPhoneContact;
    obj.address = data.address;
    obj.stt = data.stt;
    obj.note = data.note;
    obj.id_number = data.id_number;
    obj.issueDate = data.issueDate;
    obj.issuePlace = data.issuePlace;
    obj.id_facebook = data.id_facebook
    obj.id_zalo = data.id_zalo
    obj.medicalInfo = data.medicalInfo
    obj.email = data.email
    obj.qrcode = data.qrcode
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }

  public newInstance() {
    return new Customer();
  }
}
