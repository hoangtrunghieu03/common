import BaseEntity from "../base/BaseEntity";
import { SEX_TYPE } from "./enum";
import InfoMedicalCustomer from "./InfoMedicalCustomer";
import IgnoreDecorator from "../utilities/ignore-helper/IgnoreDecorator";
/** THÔNG TIN KHÁCH HÀNG */
export default class Customer extends BaseEntity<Customer> {
  customerCode: string = null; // Mã bệnh nhân
  fullName: string = null;// họ tên
  fullName_en: string = null;// họ tên không dấu dùng để search
  tel: string = null;// số điện thoại
  isPhoneContact: boolean = false;// số điện thoại liên lạc
  address:string =null;// địa chỉ
  birthday:Date =null;// sinh nhật
  stt:number = null;// số thứ tụ  
  sex:string = SEX_TYPE.FEMALE;// giới tính
  note:string =null;// chi chú
  id_number: string = null; // số CMND
  issueDate: Date = null; // ngày cấp
  issuePlace: string = null; // nơi cấp 
  id_facebook: string = null
  id_zalo: string = null
  email: string = null; //email
  qrcode: string = null;
  // @IgnoreDecorator.ignoreInDb()
  medicalInfo: InfoMedicalCustomer = null; // Thông tin khám hồ sơ bệnh án
  constructor() {
    super(); 
  }


  public assign(obj: any) {
    this._id = obj._id;
    this.customerCode = obj.hasOwnProperty("customerCode") ? obj.customerCode : this.customerCode;
    this.qrcode = obj.hasOwnProperty("qrcode") ? obj.qrcode : this.qrcode;
    this.fullName = obj.hasOwnProperty("fullName") ? obj.fullName : this.fullName;
    this.fullName_en = obj.hasOwnProperty("fullName_en") ? obj.fullName_en : this.fullName_en;
    this.sex = obj.hasOwnProperty("sex") ? obj.sex : this.sex;
    this.birthday = obj.hasOwnProperty("birthday") ? obj.birthday : this.birthday;
    this.tel = obj.hasOwnProperty("tel") ? obj.tel : this.tel;
    this.isPhoneContact = obj.hasOwnProperty("isPhoneContact") ? obj.isPhoneContact : this.isPhoneContact;
    this.address = obj.hasOwnProperty("address") ? obj.address : this.address;
    this.stt = obj.hasOwnProperty("stt") ? obj.stt : this.stt   
    this.note = obj.hasOwnProperty("note") ? obj.note : this.note;
    this.id_number = obj.hasOwnProperty("id_number") ? obj.id_number : this.id_number;
    this.issueDate = obj.hasOwnProperty("issueDate") ? obj.issueDate : this.issueDate;
    this.issuePlace = obj.hasOwnProperty("issuePlace") ? obj.issuePlace : this.issuePlace;
    this.id_facebook = obj.hasOwnProperty("id_facebook") ? obj.id_facebook : this.id_facebook;
    this.id_zalo = obj.hasOwnProperty("id_zalo") ? obj.id_zalo : this.id_zalo;
    this.medicalInfo = obj.hasOwnProperty("medicalInfo") ? obj.medicalInfo : this.medicalInfo;
    this.email = obj.hasOwnProperty("email") ? obj.email : this.email;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;
  }
  public static newInstance(): Customer {
    let result = new Customer();
    return result;
  }
}