import BaseEntity from "../base/BaseEntity";
import { IsoDateHelper } from "../utilities/helpers/IsoDateHelper";
import IgnoreDecorator from "../utilities/ignore-helper/IgnoreDecorator";
import { UNIT } from "./enum";
import MedicalBaseModel from "./MedicalBaseModel";
/** Thông tin lịch sử thanh toán */
export default class PaymentHistory extends BaseEntity<PaymentHistory> {
  paymentDate: Date = null; //Ngày thanh toán    
  medicalRecordCode: string = null; // mã bệnh án   
  medicalRecordId: string = null; // Id bệnh án   
  moneyCustomerProvide: number = 0; // tiền khách đưa
  staffId: string = null; // nhân viên thanh toán
  paymentMethod: string = null; //Phương thức thanh toán chuyển khoản/tiền mặt
  paymentStatus: string = null;
  // @IgnoreDecorator.ignoreInDb()
  discountAmount: number = 0;// Số tiền giảm giá
  discountUnit: string = UNIT.PRICE; // Loại giảm giá
  discountValue: number = 0; // Giá trị giảm giá
  customerCode: string = null; // Mã bệnh nhân
  discountCurrent: number = 0; // Số tiền được giảm giá trong lần thanh toán
  //Info service
  medicalServices: Array<MedicalBaseModel> = null;// dịch vụ sử dụng
  medicalServiceIndicates: Array<MedicalBaseModel> = null;// dịch vụ chỉ định sử dụng
  //Payment info
  moneyPaymented: number = 0;// tiền đã thanh toán
  totalMoney: number = 0;// tổng tiền
  moneyPayment : number = 0;// Tiền còn lại cần thanh toán
  totalAfterDiscount: number = 0;// Số tiền sau khi giảm giá
  constructor() {
    super();
    this.medicalServices = new Array<MedicalBaseModel>()
    this.medicalServiceIndicates = new Array<MedicalBaseModel>()
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.medicalRecordCode = obj.hasOwnProperty("medicalRecordCode") ? obj.medicalRecordCode : this.medicalRecordCode;
    this.medicalRecordId = obj.hasOwnProperty("medicalRecordId") ? obj.medicalRecordId : this.medicalRecordId;
    this.moneyPaymented = obj.hasOwnProperty("moneyPaymented") ? obj.moneyPaymented : this.moneyPaymented;
    this.totalMoney = obj.hasOwnProperty("totalMoney") ? obj.totalMoney : this.totalMoney;
    this.totalAfterDiscount = obj.hasOwnProperty("totalAfterDiscount") ? obj.totalAfterDiscount : this.totalAfterDiscount;
    this.moneyPayment = obj.hasOwnProperty("moneyPayment") ? obj.moneyPayment : this.moneyPayment;
    this.moneyCustomerProvide = obj.hasOwnProperty("moneyCustomerProvide") ? obj.moneyCustomerProvide : this.moneyCustomerProvide;
    this.customerCode = obj.hasOwnProperty("customerCode") ? obj.customerCode : this.customerCode;
    this.discountCurrent = obj.hasOwnProperty("discountCurrent") ? obj.discountCurrent : this.discountCurrent;
    this.medicalServices = obj.hasOwnProperty("medicalServices") ? obj.medicalServices : this.medicalServices;
    this.medicalServiceIndicates = obj.hasOwnProperty("medicalServiceIndicates") ? obj.medicalServiceIndicates : this.medicalServiceIndicates;
    this.discountAmount = obj.hasOwnProperty("discountAmount") ? obj.discountAmount : this.discountAmount;
    this.discountUnit = obj.hasOwnProperty("discountUnit") ? obj.discountUnit : this.discountUnit;
    this.discountValue = obj.hasOwnProperty("discountValue") ? obj.discountValue : this.discountValue;
    this.paymentDate = obj.hasOwnProperty("paymentDate") ? obj.paymentDate : this.paymentDate;
    this.paymentStatus = obj.hasOwnProperty("paymentStatus") ? obj.paymentStatus : this.paymentStatus;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;

  }
  public static newInstance(): PaymentHistory {
    let result = new PaymentHistory();
    return result;
  }
}