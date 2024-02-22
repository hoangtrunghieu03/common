let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import PaymentHistory from "../PaymentHistory";
export default class PaymentHistoryManager extends BaseHelper<PaymentHistory> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "PaymentHistory";
    this.classInfo.type = PaymentHistory;
    this.classInfo.nameSpace = "fwg.dentistry.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "paymentHistory";
  }

  public createObject(data): Promise<PaymentHistory> {
    let promise = new Promise((resolve, reject) => {
      let obj = new PaymentHistory();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: PaymentHistory, data: any) {
    obj._id = data._id;
    obj.medicalRecordCode = data.medicalRecordCode;
    obj.medicalRecordId = data.medicalRecordId;
    obj.moneyPayment = data.moneyPayment;
    obj.totalMoney = data.totalMoney;
    obj.moneyPaymented = data.moneyPaymented;
    obj.moneyCustomerProvide = data.moneyCustomerProvide;
    obj.staffId = data.staffId;
    obj.medicalServices = data.medicalServices;
    obj.medicalServiceIndicates = data.medicalServiceIndicates;
    obj.totalAfterDiscount = data.totalAfterDiscount;
    obj.paymentDate = data.paymentDate;
    obj.paymentMethod = data.paymentMethod;
    obj.paymentStatus = data.paymentStatus;
    obj.discountAmount = data.discountAmount;
    obj.discountUnit = data.discountUnit;
    obj.discountValue = data.discountValue;
    obj.discountCurrent = data.discountCurrent;
    obj.customerCode = data.customerCode;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
  }
  public newInstance() {
    return new PaymentHistory();
  }
}
