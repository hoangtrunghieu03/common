import BaseEntity from "../base/BaseEntity";
import ValidationDecorator from "../utilities/validation/ValidationDecorator";
import Constants from "../base/Constants";
import IgnoreDecorator from "../utilities/ignore-helper/IgnoreDecorator";
import MedicalSupplyInfo from "./MedicalSupplyInfo";
/**THÔNG TIN VẬT T */
export default class MedicalSupply extends BaseEntity<MedicalSupply> {
  medicalSupplyCode: string = null; // Mã vật tư
  @ValidationDecorator.required(Constants.NAME_REQUIRE)
  name: string = null;// tên vật tư
  name_en: string = null;// tên vật tư
  price: number = null;// giá
  quantity: number = null; // số lượng
  minQuantity: number = null;// số lượng tối thiểu
  unit: string = null;// đơn vị
  origin: string = null;//xuất xứ công ty sản xuất
  origin_en: string = null;//xuất xứ công ty sản xuất
  description: string = null; // mô tả 
  groupSupplyId: string = null; // nhóm vật tư
  // mfgDate: Date = null; //Ngày sản xuất
  expDate: Date = null; //Hạn sử dụng
  @IgnoreDecorator.ignoreInDb()
  listSupply: Array<MedicalSupplyInfo> = null; //Danh sách vật tư
  @IgnoreDecorator.ignoreInDb()
  reason: string = null;//Lý do điều chỉnh
  @IgnoreDecorator.ignoreInDb()
  roomId: string = null;//phòng điều chỉnh
  @IgnoreDecorator.ignoreInDb()
  note: string = null;//ghi chú
  @IgnoreDecorator.ignoreInDb()
  medicalSupplyInputId: string = null;//id lo hang cua vat tu
  @IgnoreDecorator.ignoreInDb()
  supplyRequestId: string = null;//id yeu cau xuat hang
  
  constructor() {
    super();
    this.listSupply = new Array<MedicalSupplyInfo>()
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.medicalSupplyCode = obj.hasOwnProperty("medicalSupplyCode") ? obj.medicalSupplyCode : this.medicalSupplyCode;
    this.listSupply = obj.hasOwnProperty("listSupply") ? obj.listSupply : this.listSupply;
    this.reason = obj.hasOwnProperty("reason") ? obj.reason : this.reason;
    this.roomId = obj.hasOwnProperty("roomId") ? obj.roomId : this.roomId;
    this.note = obj.hasOwnProperty("note") ? obj.note : this.note;
    this.medicalSupplyInputId = obj.hasOwnProperty("medicalSupplyInputId") ? obj.medicalSupplyInputId : this.medicalSupplyInputId;
    this.supplyRequestId = obj.hasOwnProperty("supplyRequestId") ? obj.supplyRequestId : this.supplyRequestId;
    this.name = obj.hasOwnProperty("name") ? obj.name : this.name;
    this.name_en = obj.hasOwnProperty("name_en") ? obj.name_en : this.name_en;
    this.price = obj.hasOwnProperty("price") ? obj.price : this.price;
    this.quantity = obj.hasOwnProperty("quantity") ? obj.quantity : this.quantity;
    this.minQuantity = obj.hasOwnProperty("minQuantity") ? obj.minQuantity : this.minQuantity;
    this.unit = obj.hasOwnProperty("unit") ? obj.unit : this.unit;
    this.origin = obj.hasOwnProperty("origin") ? obj.origin : this.origin;
    this.origin_en = obj.hasOwnProperty("origin_en") ? obj.origin_en : this.origin_en;
    this.description = obj.hasOwnProperty("description") ? obj.description : this.description;
    this.groupSupplyId = obj.hasOwnProperty("groupSupplyId") ? obj.groupSupplyId : this.groupSupplyId;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;
    // this.mfgDate = obj.hasOwnProperty("mfgDate") ? obj.mfgDate : this.mfgDate;
    this.expDate = obj.hasOwnProperty("expDate") ? obj.expDate : this.expDate;

  }
  public static newInstance(): MedicalSupply {
    let result = new MedicalSupply();
    return result;
  }
}