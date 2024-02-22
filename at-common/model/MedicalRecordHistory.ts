import BaseEntity from "../base/BaseEntity";
/** LICH SƯ HỒ SƠ BỆNH ÁN */
export default class MedicalRecordHistory extends BaseEntity<MedicalRecordHistory> {

  medicalRecordCode: string = null;// id của hồ sơ
  action: string = null;//hành động chuyển phòng/dịch vu hoàn tất/dịch vu chỉ định hoàn tất/thanh toán
  medicalServiceName: string = null;// tên dịch vụ hoàn tất
  medicalServiceIndicateName: string = null;// tên dịch vụ chỉ định hoàn tất
  moneyPayment: number = null;// tiền đã thanh toán
  roomFromName: string = null;// chuyển từ phòng
  roomToName: string = null;// chuyển đến phòng
  staffId: string = null;// nhân viên thực hiện
  staffName: string = null;// tên nhân viên thực hiện
  constructor() {
    super();

  }

  public assign(obj: any) {
    this._id = obj._id;
    this.medicalRecordCode = obj.hasOwnProperty("medicalRecordCode") ? obj.medicalRecordCode : this.medicalRecordCode;
    this.action = obj.hasOwnProperty("action") ? obj.action : this.action;
    this.medicalServiceName = obj.hasOwnProperty("medicalServiceName") ? obj.medicalServiceName : this.medicalServiceName;
    this.medicalServiceIndicateName = obj.hasOwnProperty("medicalServiceIndicateName") ? obj.medicalServiceIndicateName : this.medicalServiceIndicateName;
    this.moneyPayment = obj.hasOwnProperty("moneyPayment") ? obj.moneyPayment : this.moneyPayment;
    this.staffId = obj.hasOwnProperty("staffId") ? obj.staffId : this.staffId;
    this.staffName = obj.hasOwnProperty("staffName") ? obj.staffName : this.staffName;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;

  }
  public static newInstance(): MedicalService {
    let result = new MedicalService();
    return result;
  }
}