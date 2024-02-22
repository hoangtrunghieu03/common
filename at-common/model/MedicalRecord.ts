import BaseEntity from "../base/BaseEntity";
import BraceExamination from "./BraceExamination";
import ChairMedical from "./ChairMedical";
import Customer from "./Customer";
import { MEDICAL_SERVICE_STATUS, MEDICAL_SERVICE_TYPE, ROOM_STATUS, PAYMENT_STATUS } from "./enum";
import GeneralExamination from "./GeneralExamination";
import ImplantExamination from "./ImplantExamination";
import MedicalBaseModel from "./MedicalBaseModel";
import MedicalImageModel from "./MedicalImageModel";
import MedicalRecordCommitment from "./MedicalRecordCommitment";
import Payment from "./Payment";
import PaymentHistory from "./PaymentHistory";
import TreatmentProcess from "./TreatmentProcess";
import DeliveryNoteImage from "./DeliveryNoteImage";
import IgnoreDecorator from "../utilities/ignore-helper/IgnoreDecorator";
import MedicalSupply from "./MedicalSupply";
import MedicalSupplyTreatment from "./MedicalSupplyTreatment";
/** Hồ sơ bệnh án */
export default class MedicalRecord extends BaseEntity<MedicalRecord> {
  medicalRecordCode: string = null;// mã hơ sơ
  customerCode: string = null;// mã của khách hàng
  serviceType: string = MEDICAL_SERVICE_TYPE.GENERAL;// loại dịch vụ khách hàng chọn 
  medicalRecordName: string = null;// Tên hồ sơ bệnh án
  serviceRequest: string = null; //id dịch vụ yêu cầu
  stt: number = null; //số thứ tự hồ sơ bệnh án
  customerNote: string = null;// khách hàng yêu cầu
  currentRoom: string = null;// phòng hiện tại
  fromRoom: string = null;//chuyển từ phòng   
  toRoom: string = null;// Chuyển đến phòng 
  toRoomName: string = null;// Chuyển đến phòng 
  timeTranfer: Date = null;//Thời gian chuyển phòng
  noteTranfer: string = null;//Ghi chú chuyển phòng
  staffId: string = null;// ID bác sỹ thực hiện
  roomStatus: string = ROOM_STATUS.WAITING;// Trạng thái tại phòng
  treatmentProcesses: Array<TreatmentProcess> = null;// quá trình điều trị   
  statusMedical: string = MEDICAL_SERVICE_STATUS.IN_PROGRESS; //trạng thái hồ sơ bệnh án
  statusPayment: string = PAYMENT_STATUS.NOT_PAYMENTED;// Trạng thái thanh toán hồ sơ bệnh án
  medicalServices: Array<MedicalBaseModel> = null;// dịch vụ sử dụng
  medicalServiceIndicates: Array<MedicalBaseModel> = null;// dịch vụ chỉ định sử dụng
  generalExamination: GeneralExamination = null;//khám tổng quát
  braceExamination: BraceExamination = null; // chuẩn đoán niềng răng
  implantExamination: ImplantExamination = null; // chuẩn đoán implant
  generalExaminationHistories: Array<GeneralExamination> = null;// khám tổng quát
  braceExaminationHistories: Array<BraceExamination> = null;// chuẩn đoán niềng răng
  implantExaminationHistories: Array<ImplantExamination> = null;//  chuẩn đoán implant
  images: Array<MedicalImageModel> = null;// hình ảnh
  chair: ChairMedical = null;// thông tin ghế chữa trị 
  payment: Payment = null;//thông tin thanh toán
  treatment: string = null;// điều trị
  advice: string = null;// lời khuyên
  customer: Customer;// thông tin khách hàng mới
  deliveryNoteImage: DeliveryNoteImage // Phiếu giao nhận
  medicalRecordCommitment: MedicalRecordCommitment = null;//thực hiện cam kết
  medicalService: MedicalBaseModel;// dịch vụ sử dụng
  medicalServicesUpdate: Array<MedicalBaseModel>;// dịch vụ sử dụng
  medicalServiceIndicate: MedicalBaseModel;// dịch vụ chỉ định sử dụng
  medicalServiceIndicatesUpdate: Array<MedicalBaseModel>;// dịch vụ chỉ định sử dụng
  treatmentProcess: TreatmentProcess;// quá trình điều trị 
  currentPayment: PaymentHistory;//thông tin thanh toán
  @IgnoreDecorator.ignoreInDb()
  paymentHistory: Array<PaymentHistory>
  @IgnoreDecorator.ignoreInDb()
  examinationHistories: any = null
  examinationDate: Date = null;
  examinationDateHistory: Array<any> = null;
  customerInfo: Array<string> = null; //bản tự khai bệnh nhân
  @IgnoreDecorator.ignoreInDb()
  reexaminationFlag: boolean = false;
  @IgnoreDecorator.ignoreInDb()
  medicalRecordId?: string = null; // Id hồ sơ bệnh án được copy
  note: string = null;//Ghi chú hồ sơ bệnh án theo ngày
  noteHistory: Array<any> = null;//Lịch sử ghi chú lưu theo ngày
  medicalSupply: Array<MedicalSupplyTreatment> = null;//Vat tu tieu hao
  deleteFlag: boolean = null; //xoa ho so benh an
  
  constructor() {
    super();
    this.treatmentProcesses = new Array<TreatmentProcess>();
    this.medicalServices = new Array<MedicalBaseModel>();
    this.medicalServiceIndicates = new Array<MedicalBaseModel>();
    this.customerInfo = new Array<string>();
    this.generalExaminationHistories = new Array<GeneralExamination>();
    this.braceExaminationHistories = new Array<BraceExamination>();
    this.implantExaminationHistories = new Array<ImplantExamination>();
    this.examinationDateHistory = new Array<any>();
    this.paymentHistory = new Array<PaymentHistory>();
    this.examinationHistories = new Array<any>();
    this.noteHistory = new Array<any>();
    this.medicalSupply = new Array<MedicalSupplyTreatment>();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.medicalRecordCode = obj.hasOwnProperty("medicalRecordCode") ? obj.medicalRecordCode : this.medicalRecordCode;
    this.medicalRecordId = obj.hasOwnProperty("medicalRecordId") ? obj.medicalRecordId : this.medicalRecordId;
    this.customerCode = obj.hasOwnProperty("customerCode") ? obj.customerCode : this.customerCode;
    this.customer = obj.hasOwnProperty("customer") ? obj.customer : this.customer;
    this.serviceRequest = obj.hasOwnProperty("serviceRequest") ? obj.serviceRequest : this.serviceRequest;
    this.stt = obj.hasOwnProperty("stt") ? obj.stt : this.stt;
    this.timeTranfer = obj.hasOwnProperty("timeTranfer") ? obj.timeTranfer : this.timeTranfer;
    this.noteTranfer = obj.hasOwnProperty("noteTranfer") ? obj.noteTranfer : this.noteTranfer;
    this.serviceType = obj.hasOwnProperty("serviceType") ? obj.serviceType : this.serviceType;
    this.medicalRecordName = obj.hasOwnProperty("medicalRecordName") ? obj.medicalRecordName : this.medicalRecordName;
    this.customerNote = obj.hasOwnProperty("customerNote") ? obj.customerNote : this.customerNote;
    this.currentRoom = obj.hasOwnProperty("currentRoom") ? obj.currentRoom : this.currentRoom;
    this.fromRoom = obj.hasOwnProperty("fromRoom") ? obj.fromRoom : this.fromRoom;
    this.toRoom = obj.hasOwnProperty("toRoom") ? obj.toRoom : this.toRoom;
    this.toRoomName = obj.hasOwnProperty("toRoomName") ? obj.toRoomName : this.toRoomName;
    this.staffId = obj.hasOwnProperty("staffId") ? obj.staffId : this.staffId;
    this.treatmentProcesses = obj.hasOwnProperty("treatmentProcesses") ? obj.treatmentProcesses : this.treatmentProcesses;
    this.statusMedical = obj.hasOwnProperty("statusMedical") ? obj.statusMedical : this.statusMedical;
    this.medicalServices = obj.hasOwnProperty("medicalServices") ? obj.medicalServices : this.medicalServices;
    this.medicalServiceIndicates = obj.hasOwnProperty("medicalServiceIndicates") ? obj.medicalServiceIndicates : this.medicalServiceIndicates;
    this.generalExamination = obj.hasOwnProperty("generalExamination") ? obj.generalExamination : this.generalExamination;
    this.implantExamination = obj.hasOwnProperty("implantExamination") ? obj.implantExamination : this.implantExamination;
    this.braceExamination = obj.hasOwnProperty("braceExamination") ? obj.braceExamination : this.braceExamination;
    this.images = obj.hasOwnProperty("images") ? obj.images : this.images;
    this.chair = obj.hasOwnProperty("chair") ? obj.chair : this.chair;
    this.payment = obj.hasOwnProperty("payment") ? obj.payment : this.payment;
    this.treatment = obj.hasOwnProperty("treatment") ? obj.treatment : this.treatment;
    this.paymentHistory = obj.hasOwnProperty("paymentHistory") ? obj.paymentHistory : this.paymentHistory;
    this.examinationHistories = obj.hasOwnProperty("examinationHistories") ? obj.examinationHistories : this.examinationHistories;
    this.advice = obj.hasOwnProperty("advice") ? obj.advice : this.advice;
    this.roomStatus = obj.hasOwnProperty("roomStatus") ? obj.roomStatus : this.roomStatus;
    this.medicalRecordCommitment = obj.hasOwnProperty("medicalRecordCommitment") ? obj.medicalRecordCommitment : this.medicalRecordCommitment;
    this.medicalService = obj.hasOwnProperty("medicalService") ? obj.medicalService : this.medicalService;
    this.medicalServicesUpdate = obj.hasOwnProperty("medicalServicesUpdate") ? obj.medicalServicesUpdate : this.medicalServicesUpdate;
    this.medicalServiceIndicate = obj.hasOwnProperty("medicalServiceIndicate") ? obj.medicalServiceIndicate : this.medicalServiceIndicate;
    this.medicalServiceIndicatesUpdate = obj.hasOwnProperty("medicalServiceIndicatesUpdate") ? obj.medicalServiceIndicatesUpdate : this.medicalServiceIndicatesUpdate;
    this.treatmentProcess = obj.hasOwnProperty("treatmentProcess") ? obj.treatmentProcess : this.treatmentProcess;
    this.currentPayment = obj.hasOwnProperty("currentPayment") ? obj.currentPayment : this.currentPayment;
    this.examinationDate = obj.hasOwnProperty("examinationDate") ? obj.examinationDate : this.examinationDate;
    this.customerInfo = obj.hasOwnProperty("customerInfo") ? obj.customerInfo : this.customerInfo;
    this.deliveryNoteImage = obj.hasOwnProperty("deliveryNoteImage") ? obj.deliveryNoteImage : this.deliveryNoteImage;
    this.note = obj.hasOwnProperty("note") ? obj.note : this.note;
    this.noteHistory = obj.hasOwnProperty("noteHistory") ? obj.noteHistory : this.noteHistory;
    this.medicalSupply = obj.hasOwnProperty("medicalSupply") ? obj.medicalSupply : this.medicalSupply;
    this.generalExaminationHistories = obj.hasOwnProperty("generalExaminationHistories") ? obj.generalExaminationHistories : this.generalExaminationHistories;
    this.implantExaminationHistories = obj.hasOwnProperty("implantExaminationHistories") ? obj.implantExaminationHistories : this.implantExaminationHistories;
    this.braceExaminationHistories = obj.hasOwnProperty("braceExaminationHistories") ? obj.braceExaminationHistories : this.braceExaminationHistories;
    this.reexaminationFlag = obj.hasOwnProperty("reexaminationFlag") ? obj.reexaminationFlag : this.reexaminationFlag;
    this.deleteFlag = obj.hasOwnProperty("deleteFlag") ? obj.deleteFlag : this.deleteFlag;
    this.examinationDateHistory = obj.hasOwnProperty("examinationDateHistory") ? obj.examinationDateHistory : this.examinationDateHistory;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;

  }
  public static newInstance(): MedicalRecord {
    let result = new MedicalRecord();
    return result;
  }
}