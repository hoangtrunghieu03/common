import BaseEntity from "../base/BaseEntity";
import IgnoreDecorator from "../utilities/ignore-helper/IgnoreDecorator";
import MedicalSupplyInfo from "./MedicalSupplyInfo";
export default class MedicalSupplyInput extends BaseEntity<MedicalSupplyInput> {
  medicalSupplyId: string = null;// id vật tư
  // mfgDate: Date = null; //Ngày sản xuất
  expDate: Date = null; //Hạn sử dụng
  quantity: number = null;// số lượng
  quantityRemain: number = null;// số lượng còn lại
  priceInput: number = null;// giá nhập hàng
  @IgnoreDecorator.ignoreInDb()
  medicalSupplyInputId: string = null;//mã lô hàng
  @IgnoreDecorator.ignoreInDb()
  reason: string = null;//Lý do điều chỉnh
  @IgnoreDecorator.ignoreInDb()
  note: string = null;//ghi chú
  @IgnoreDecorator.ignoreInDb()
  listSupply: Array<MedicalSupplyInfo> = null; //Danh sách vật tư
  constructor() {
    super();
    this.listSupply = new Array<MedicalSupplyInfo>()
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.medicalSupplyId = obj.hasOwnProperty("medicalSupplyId") ? obj.medicalSupplyId : this.medicalSupplyId;
    // this.mfgDate = obj.hasOwnProperty("mfgDate") ? obj.mfgDate : this.mfgDate;
    this.expDate = obj.hasOwnProperty("expDate") ? obj.expDate : this.expDate;
    this.quantity = obj.hasOwnProperty("quantity") ? obj.quantity : this.quantity;
    this.quantityRemain = obj.hasOwnProperty("quantityRemain") ? obj.quantityRemain : this.quantityRemain;
    this.priceInput = obj.hasOwnProperty("priceInput") ? obj.priceInput : this.priceInput;
    this.medicalSupplyInputId = obj.hasOwnProperty("medicalSupplyInputId") ? obj.medicalSupplyInputId : this.medicalSupplyInputId;
    this.reason = obj.hasOwnProperty("reason") ? obj.reason : this.reason;
    this.note = obj.hasOwnProperty("note") ? obj.note : this.note;
    this.listSupply = obj.hasOwnProperty("listSupply") ? obj.listSupply : this.listSupply;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;

  }
  public static newInstance(): MedicalSupplyInput {
    let result = new MedicalSupplyInput();
    return result;
  }
}