import BaseEntity from "../base/BaseEntity";
import { ADJUST_WAREHORSE_REASON } from "./enum";
/**THÔNG TIN LỊCH SỬ VẬT TƯ */
export default class MedicalSupplyHistory extends BaseEntity<MedicalSupplyHistory> {
  medicalSupplyId: string = null; // id vật tư
  medicalSupplyName: string = null;// Tên vật tư
  medicalSupplyName_en: string = null;// Tên vật tư
  medicalSupplyUnit: string = null;// Đơn vị vật tư
  medicalSupplyOrigin: string = null;// Nguon goc vat tu
  medicalSupplyInputId: string = null; // id vật tư lô hàng
  roomId: string = null;// id phòng
  reason: string = ADJUST_WAREHORSE_REASON.INPUT;// nguyên nhân
  quantity:number = null;// số lượng điều chỉnh
  priceInput: number = null; //Giá nhập/điều chỉnh 
  reasonAdjust: string = null;// Ly do dieu chinh
  noteAdjust: string = null;// Ghi chu dieu chinh 

  //case reason = "Tiêu hao"
  medicalRecordId: string = null;// Id hồ sơ bệnh án
  medicalRecordCode?: string = null;// mã hồ sơ bệnh án
  customerCode: string = null;// Mã bệnh nhân
  customerName: string = null;// Tên bệnh nhân
  constructor() {
    super();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.medicalSupplyId = obj.hasOwnProperty("medicalSupplyId") ? obj.medicalSupplyId : this.medicalSupplyId;
    this.medicalSupplyName = obj.hasOwnProperty("medicalSupplyName") ? obj.medicalSupplyName : this.medicalSupplyName;
    this.medicalSupplyName_en = obj.hasOwnProperty("medicalSupplyName_en") ? obj.medicalSupplyName_en : this.medicalSupplyName_en;
    this.medicalSupplyUnit = obj.hasOwnProperty("medicalSupplyUnit") ? obj.medicalSupplyUnit : this.medicalSupplyUnit;
    this.medicalSupplyOrigin = obj.hasOwnProperty("medicalSupplyOrigin") ? obj.medicalSupplyOrigin : this.medicalSupplyOrigin;
    this.medicalSupplyInputId = obj.hasOwnProperty("medicalSupplyInputId") ? obj.medicalSupplyInputId : this.medicalSupplyInputId;
    this.roomId = obj.hasOwnProperty("roomId") ? obj.roomId : this.roomId;
    this.reason = obj.hasOwnProperty("reason") ? obj.reason : this.reason;
    this.quantity = obj.hasOwnProperty("quantity") ? obj.quantity : this.quantity;
    this.reasonAdjust = obj.hasOwnProperty("reasonAdjust") ? obj.reasonAdjust : this.reasonAdjust;
    this.noteAdjust = obj.hasOwnProperty("noteAdjust") ? obj.noteAdjust : this.noteAdjust;
    this.medicalRecordId = obj.hasOwnProperty("medicalRecordId") ? obj.medicalRecordId : this.medicalRecordId;
    this.medicalRecordCode = obj.hasOwnProperty("medicalRecordCode") ? obj.medicalRecordCode : this.medicalRecordCode;
    this.customerCode = obj.hasOwnProperty("customerCode") ? obj.customerCode : this.customerCode;
    this.customerName = obj.hasOwnProperty("customerName") ? obj.customerName : this.customerName;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;  

  }
  public static newInstance(): MedicalSupplyHistory {
    let result = new MedicalSupplyHistory();
    return result;
  }
}