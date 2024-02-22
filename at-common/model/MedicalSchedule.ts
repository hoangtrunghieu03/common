import BaseEntity from "../base/BaseEntity";
import IgnoreDecorator from "../utilities/ignore-helper/IgnoreDecorator";
import Customer from "./Customer";
import { ARCMAKING_STATUS, MEDICAL_SERVICE_TYPE, SCHEDULE_STATUS } from "./enum";
/** Lịch hẹn */
export default class MedicalSchedule extends BaseEntity<MedicalSchedule> {
  medicalRecordCode: string = null;// mã hơ sơ
  customerCode: string = null;// mã của khách hàng
  @IgnoreDecorator.ignoreInDb()
  customerId: string = null;// Id của khách hàng
  serviceType: string = MEDICAL_SERVICE_TYPE.GENERAL;// loại dịch vụ khách hàng chọn 
  scheduleTime: Date = null;// thời gian hẹn
  content: string = null;//nội dung hẹn
  content_en: string = null;//nội dung hẹn
  note: string = null;//ghi chú
  staff: string = null; //ID người tạo lịch hẹn
  status: string = SCHEDULE_STATUS.NOTYETARRIVED;
  @IgnoreDecorator.ignoreInDb()
  customer: Customer // Thông tin khách hàng mới
  @IgnoreDecorator.ignoreInDb()
  customerName: string = null; //Tên khách hàng
  @IgnoreDecorator.ignoreInDb()
  customerTel: string = null; //Sô điện thoại khách hàng
  medicalRecordId: string = null; //Id hồ sơ bệnh án
  medicalTreatmentProcessId: string = null;
  typeSchedule: string = null; // Loại lịch hẹn
  contentArea: string = null; // Nội dung lịch hẹn cho loại lịch hẹn Khác và Làm cung
  isConfirm?: boolean = null; //Check nếu true thì lịch hẹn này đã được bác sĩ cho phép làm cung
  @IgnoreDecorator.ignoreInDb()
  listSchduleConfirm?: Array<any> = []; //Danh sach can xac nhan

  //model for delivery note
  sampleReceiveDate: Date = null;// Ngày nhận mẫu
  statusArc: string = ARCMAKING_STATUS.NOTYET;// Trạng thái làm cung
  executeOutSide: boolean = false; //Lam ngoai
  medicalServiceId: string = null;// Id dịch vụ
  medicalServiceIndicateId: string = null;// ID dịch vụ chỉ định
  companyName: string = null;// Đơn vị thực hiện ngoài
  companyName_en: string = null;// Đơn vị thực hiện ngoài
  @IgnoreDecorator.ignoreInDb()
  medicalServiceName: string = null;// Tên dịch vụ
  @IgnoreDecorator.ignoreInDb()
  medicalServiceIndicateName: string = null;// Tên dịch vụ
  countRemind: number = 0// đếm sồ lần nhắc nhở thành công

  constructor() {
    super();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.medicalRecordCode = obj.hasOwnProperty("medicalRecordCode") ? obj.medicalRecordCode : this.medicalRecordCode;
    this.customerCode = obj.hasOwnProperty("customerCode") ? obj.customerCode : this.customerCode;
    this.customerId = obj.hasOwnProperty("customerId") ? obj.customerId : this.customerId;
    this.serviceType = obj.hasOwnProperty("serviceType") ? obj.serviceType : this.serviceType;
    this.statusArc = obj.hasOwnProperty("statusArc") ? obj.statusArc : this.statusArc;
    this.sampleReceiveDate = obj.hasOwnProperty("sampleReceiveDate") ? obj.sampleReceiveDate : this.sampleReceiveDate;
    this.companyName = obj.hasOwnProperty("companyName") ? obj.companyName : this.companyName;
    this.companyName_en = obj.hasOwnProperty("companyName_en") ? obj.companyName_en : this.companyName_en;
    this.medicalServiceIndicateId = obj.hasOwnProperty("medicalServiceIndicateId") ? obj.medicalServiceIndicateId : this.medicalServiceIndicateId;
    this.medicalServiceIndicateName = obj.hasOwnProperty("medicalServiceIndicateName") ? obj.medicalServiceIndicateName : this.medicalServiceIndicateName;
    this.scheduleTime = obj.hasOwnProperty("scheduleTime") ? obj.scheduleTime : this.scheduleTime;
    this.typeSchedule = obj.hasOwnProperty("typeSchedule") ? obj.typeSchedule : this.typeSchedule;
    this.contentArea = obj.hasOwnProperty("contentArea") ? obj.contentArea : this.contentArea;
    this.isConfirm = obj.hasOwnProperty("isConfirm") ? obj.isConfirm : this.isConfirm;
    this.listSchduleConfirm = obj.hasOwnProperty("listSchduleConfirm") ? obj.listSchduleConfirm : this.listSchduleConfirm;
    this.medicalTreatmentProcessId = obj.hasOwnProperty("medicalTreatmentProcessId") ? obj.medicalTreatmentProcessId : this.medicalTreatmentProcessId;
    this.content = obj.hasOwnProperty("content") ? obj.content : this.content;
    this.content_en = obj.hasOwnProperty("content_en") ? obj.content_en : this.content_en;
    this.note = obj.hasOwnProperty("note") ? obj.note : this.note;
    this.staff = obj.hasOwnProperty("staff") ? obj.staff : this.staff;
    this.customer = obj.hasOwnProperty("customer") ? obj.customer : this.customer;
    this.executeOutSide = obj.hasOwnProperty("executeOutSide") ? obj.executeOutSide : this.executeOutSide;
    this.status = obj.hasOwnProperty("status") ? obj.status : this.status;
    this.customerName = obj.hasOwnProperty("customerName") ? obj.customerName : this.customerName;
    this.customerTel = obj.hasOwnProperty("customerTel") ? obj.customerTel : this.customerTel;
    this.medicalRecordId = obj.hasOwnProperty("medicalRecordId") ? obj.medicalRecordId : this.medicalRecordId;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;
    this.countRemind = obj.hasOwnProperty("countRemind") ? obj.countRemind : this.countRemind;

  }
  public static newInstance(): MedicalSchedule {
    let result = new MedicalSchedule();
    return result;
  }
}